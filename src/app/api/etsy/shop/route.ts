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

    let bannerUrl = (shopData.image_url_760x100 as string)
      || (shopData.banner_url as string)
      || (shopData.large_banner_url as string)
      || (shopData.banner_url_fullxfull as string)
      || null;

    let iconUrl = (shopData.icon_url_fullxfull as string) || null;

    if ((!bannerUrl || !iconUrl) && shopData.shop_id) {
      try {
        const directShopRes = await fetch(`https://api.etsy.com/v3/application/shops/${shopData.shop_id}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': apiKeyWithSecret }
        });
        if (directShopRes.ok) {
          const directShop = await directShopRes.json() as Record<string, unknown>;
          if (!bannerUrl) {
            bannerUrl = (directShop.image_url_760x100 as string)
              || (directShop.banner_url as string)
              || (directShop.large_banner_url as string)
              || (directShop.banner_url_fullxfull as string)
              || null;
          }
          if (!iconUrl) {
            iconUrl = (directShop.icon_url_fullxfull as string) || null;
          }
        }
      } catch (e) {
        console.warn("Direct shop fetch fallback warning:", e);
      }
    }

    return NextResponse.json({
      shop_id: shopData.shop_id,
      shop_name: shopData.shop_name,
      title: shopData.title,
      icon_url_fullxfull: iconUrl,
      image_url_760x100: shopData.image_url_760x100 || bannerUrl,
      banner_url: bannerUrl,
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
