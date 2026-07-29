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

    // 3. Get Active Listings
    const listingsRes = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=100&includes=Images`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });

    if (!listingsRes.ok) throw new Error("Failed to fetch listings");
    const data = (await listingsRes.json()) as Record<string, any>;
    const rawListings = data.results || [];

    // Map to frontend format
    const formattedListings = rawListings.map((listing: any) => ({
      id: listing.listing_id.toString(),
      name: listing.title,
      image: listing.images?.[0]?.url_570xN || "/screenshots/mock_product1.png",
      sales: listing.views || 0, // Fallback since Etsy API doesn't expose sales per listing directly in this endpoint
      revenue: `$${((listing.price?.amount || 0) / (listing.price?.divisor || 1)).toFixed(2)}`,
      trend: "+0%",
      views: listing.views || 0,
      favorites: listing.num_favorers || 0
    }));

    // Best Sellers (sort by views as a proxy for sales)
    const bestSellers = [...formattedListings]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Most Favorited
    const mostFavorited = [...formattedListings]
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, 5);

    return NextResponse.json({
      bestSellers,
      mostFavorited
    });
  } catch (err: unknown) {
    console.error("Etsy listings fetch error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
