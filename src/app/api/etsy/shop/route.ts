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
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-api-key': clientId,
      }
    });

    if (!meRes.ok) throw new Error("Failed to fetch user");
    const meData = (await meRes.json()) as Record<string, unknown>;
    const userId = meData.user_id;

    // 2. Get the shop for this user
    const shopRes = await fetch(`https://api.etsy.com/v3/application/users/${userId}/shops`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-api-key': clientId,
      }
    });

    if (!shopRes.ok) throw new Error("Failed to fetch shop");
    const data = (await shopRes.json()) as Record<string, unknown>;
    const shop = data.shop_id ? data : null;

    if (!shop) {
       return NextResponse.json({ error: "User has no shop" }, { status: 404 });
    }

    return NextResponse.json({
      shop_id: shop.shop_id,
      shop_name: shop.shop_name,
      title: shop.title,
      icon_url_fullxfull: shop.icon_url_fullxfull,
      url: shop.url,
      review_count: shop.review_count,
      review_average: shop.review_average,
      transaction_sold_count: shop.transaction_sold_count,
      listing_active_count: shop.listing_active_count,
    });
  } catch (err: unknown) {
    console.error("Etsy shop fetch error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
