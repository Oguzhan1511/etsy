import { NextResponse } from 'next/server';
import { getValidEtsyToken } from '@/lib/etsy';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

export async function GET(request: Request) {
  try {
    const cookieStore = request.headers.get('cookie') || '';
    let authToken = '';
    const match = cookieStore.match(/auth_token=([^;]+)/);
    if (match) {
      authToken = match[1];
    }

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(authToken, JWT_SECRET);
    const userId = payload.id as string;

    const token = await getValidEtsyToken(userId);
    const clientId = process.env.ETSY_API_KEY;

    if (!token || !clientId) {
      return NextResponse.json({ error: "Not authenticated with Etsy" }, { status: 401 });
    }

    // 1. Get the current user
    const meRes = await fetch('https://api.etsy.com/v3/application/users/me', {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });
    if (!meRes.ok) throw new Error("Failed to fetch user");
    const meData = await meRes.json();
    const etsyUserId = meData.user_id;

    // 2. Get the shop
    const shopRes = await fetch(`https://api.etsy.com/v3/application/users/${etsyUserId}/shops`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });
    if (!shopRes.ok) throw new Error("Failed to fetch shop");
    const shopData = await shopRes.json();
    const shopId = shopData.shop_id;

    if (!shopId) return NextResponse.json({ error: "No shop found" }, { status: 404 });

    // 3. Get Receipts (Orders)
    const receiptsRes = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}/receipts?limit=50&includes=Transactions,Listings`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });

    if (!receiptsRes.ok) {
      const errTxt = await receiptsRes.text();
      console.error("Orders fetch failed:", errTxt);
      throw new Error("Failed to fetch orders");
    }
    
    const data = (await receiptsRes.json()) as Record<string, any>;
    const rawResults = data.results || [];
    
    // 4. Calculate total revenue and format orders
    let totalRevenue = 0;
    const orders = rawResults.map((receipt: any) => {
      const amount = parseFloat(receipt.grandtotal?.amount || "0");
      const divisor = receipt.grandtotal?.divisor || 1;
      totalRevenue += (amount / divisor);
      
      return {
        id: receipt.receipt_id.toString(),
        buyer: receipt.name || 'Etsy Buyer',
        item: receipt.transactions?.[0]?.title || 'Unknown Item',
        status: receipt.is_shipped ? 'Gönderildi' : 'Bekliyor',
        date: new Date(receipt.created_timestamp * 1000).toISOString(),
        amount: (amount / divisor).toFixed(2),
        currency: receipt.grandtotal?.currency_code || 'USD',
        url: `https://www.etsy.com/your/orders/sold?order_id=${receipt.receipt_id}`
      };
    });

    return NextResponse.json({
      orders: orders.slice(0, 10), // Limit to top 10 for dashboard
      total_revenue: totalRevenue.toFixed(2),
      total_orders: data.count || orders.length
    });
  } catch (err: unknown) {
    console.error("Etsy orders fetch error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
