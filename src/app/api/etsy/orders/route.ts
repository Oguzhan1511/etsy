import { NextResponse } from 'next/server';
import { getValidEtsyToken } from '@/lib/etsy';

export async function GET() {
  const token = await getValidEtsyToken();
  const clientId = process.env.ETSY_API_KEY;

  if (!token || !clientId) {
    return NextResponse.json({ error: "Not authenticated with Etsy" }, { status: 401 });
  }

  try {
    // 1. Get the current user
    const meRes = await fetch('https://api.etsy.com/v3/application/users/me', {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });
    if (!meRes.ok) throw new Error("Failed to fetch user");
    const meData = await meRes.json();
    const userId = meData.user_id;

    // 2. Get the shop
    const shopRes = await fetch(`https://api.etsy.com/v3/application/users/${userId}/shops`, {
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
    
    const data = (await receiptsRes.json()) as Record<string, unknown>;
    return NextResponse.json((data.results as unknown[]) || []);
  } catch (err: unknown) {
    console.error("Etsy orders fetch error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
