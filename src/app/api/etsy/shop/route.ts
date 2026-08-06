import { NextResponse } from 'next/server';
import { getValidEtsyToken, getUserIdFromRequest } from '@/lib/etsy';

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const token = await getValidEtsyToken(userId);
  const clientId = process.env.ETSY_API_KEY;
  const clientSecret = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET;
  if (!clientId || !clientSecret) return NextResponse.json({ error: "Etsy store not connected (missing credentials)" }, { status: 401 });
  if (!token) return NextResponse.json({ error: "Etsy store not connected" }, { status: 401 });

  const apiKeyWithSecret = `${clientId}:${clientSecret}`;

  try {
    const meRes = await fetch('https://api.etsy.com/v3/application/users/me', {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': apiKeyWithSecret }
    });
    if (!meRes.ok) {
      const errText = await meRes.text();
      throw new Error(`Failed to fetch Etsy user: ${meRes.status} ${errText}`);
    }
    const meData = await meRes.json() as Record<string, unknown>;

    const shopRes = await fetch(`https://api.etsy.com/v3/application/users/${meData.user_id}/shops`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': apiKeyWithSecret }
    });
    if (!shopRes.ok) {
      const errText = await shopRes.text();
      throw new Error(`Failed to fetch shop: ${shopRes.status} ${errText}`);
    }
    const shopData = await shopRes.json() as Record<string, unknown>;

    if (!shopData.shop_id) {
      return NextResponse.json({ error: "User has no Etsy shop", shopData }, { status: 404 });
    }

    return NextResponse.json({
      shop_id: shopData.shop_id,
      shop_name: shopData.shop_name,
      title: shopData.title,
      icon_url_fullxfull: shopData.icon_url_fullxfull,
      url: shopData.url,
      review_count: shopData.review_count,
      review_average: shopData.review_average,
      transaction_sold_count: shopData.transaction_sold_count,
      listing_active_count: shopData.listing_active_count,
      currency_code: shopData.currency_code,
    });
  } catch (err: unknown) {
    console.error("Etsy shop fetch error:", err);
    return NextResponse.json({ error: (err as Error).message, debug: true }, { status: 500 });
  }
}
