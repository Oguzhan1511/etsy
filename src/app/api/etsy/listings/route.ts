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
    if (!meRes.ok) throw new Error("Failed to fetch Etsy user");
    const meData = await meRes.json();

    const shopRes = await fetch(`https://api.etsy.com/v3/application/users/${meData.user_id}/shops`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': apiKeyWithSecret }
    });
    if (!shopRes.ok) throw new Error("Failed to fetch shop");
    const shopData = await shopRes.json();
    const shopId = shopData.shop_id;
    if (!shopId) return NextResponse.json({ error: "No shop found" }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    const listingsRes = await fetch(
      `https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=${limit}&offset=${offset}&includes=Images`,
      { headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': apiKeyWithSecret } }
    );
    if (!listingsRes.ok) throw new Error("Failed to fetch listings");
    const data = await listingsRes.json() as Record<string, unknown>;
    const rawResults = (data.results as any[]) || [];

    // Fetch images manually for each listing since includes=Images seems unreliable
    const resultsWithImages = await Promise.all(rawResults.map(async (item) => {
      try {
        const imgRes = await fetch(`https://api.etsy.com/v3/application/listings/${item.listing_id}/images`, {
          headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': apiKeyWithSecret }
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          item.images = imgData.results || [];
        }
      } catch (e) {
        console.error("Failed to fetch images for listing", item.listing_id, e);
      }
      return item;
    }));

    return NextResponse.json({
      results: resultsWithImages,
      count: data.count,
    });
  } catch (err: unknown) {
    console.error("Etsy listings fetch error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
