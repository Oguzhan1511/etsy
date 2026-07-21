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

    // 2. Get the shop for this user
    const shopRes = await fetch(`https://api.etsy.com/v3/application/users/${userId}/shops`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });
    if (!shopRes.ok) throw new Error("Failed to fetch shop");
    const shopData = await shopRes.json();
    const shopId = shopData.shop_id;

    if (!shopId) return NextResponse.json({ error: "No shop found" }, { status: 404 });

    // 3. Get Active Listings
    const listingsRes = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}/listings/active?limit=50&includes=Images`, {
      headers: { 'Authorization': `Bearer ${token}`, 'x-api-key': clientId }
    });

    if (!listingsRes.ok) throw new Error("Failed to fetch listings");
    const data = (await listingsRes.json()) as Record<string, unknown>;
    return NextResponse.json((data.results as unknown[]) || []);
  } catch (err: unknown) {
    console.error("Etsy listings fetch error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
