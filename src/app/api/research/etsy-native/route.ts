import { NextResponse } from 'next/server';
import { getValidEtsyToken } from '@/lib/etsy';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ETSY_API_KEY = process.env.ETSY_API_KEY!;
const ETSY_API_SECRET = process.env.ETSY_API_SECRET!;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

interface EtsyListing {
  listing_id: number;
  shop_id: number;
  title: string;
  views: number;
  num_favorers: number;
  original_creation_timestamp?: number;
  creation_timestamp: number;
  taxonomy_id?: number;
  price?: { amount: number; divisor: number };
  url: string;
}

interface EtsyImage {
  url_570xN?: string;
  url_fullxfull?: string;
}

// ----------------------------
// REAL API: Uses user's OAuth token
// ----------------------------
async function fetchRealEtsyProducts(keyword: string, accessToken: string) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': `${ETSY_API_KEY}:${ETSY_API_SECRET}`,
    'Content-Type': 'application/json',
  };

  const searchRes = await fetch(
    `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=50&sort_on=score`,
    { headers }
  );

  if (!searchRes.ok) {
    let errorDetail = searchRes.statusText;
    try {
      const errorJson = await searchRes.json();
      errorDetail = errorJson.error || JSON.stringify(errorJson);
    } catch {
      errorDetail = await searchRes.text();
    }
    throw new Error(`Etsy API Hatası (${searchRes.status}): ${errorDetail}`);
  }

  const data = (await searchRes.json()) as Record<string, unknown>;
  let rawListings = (data.results as EtsyListing[]) || [];

  rawListings = rawListings.filter(item => (item.views || 0) > 0 || (item.num_favorers || 0) > 0);
  rawListings.sort((a, b) => {
    const scoreA = (a.views || 0) + (a.num_favorers || 0) * 15;
    const scoreB = (b.views || 0) + (b.num_favorers || 0) * 15;
    return scoreB - scoreA;
  });
  rawListings = rawListings.slice(0, 12);

  const now = Date.now() / 1000;

  const fetchPromises = rawListings.map(async (item) => {
    const listingId = item.listing_id;
    const shopId = item.shop_id;

    try {
      const [imageRes, shopRes] = await Promise.all([
        fetch(`https://api.etsy.com/v3/application/listings/${listingId}/images`, { headers }),
        fetch(`https://api.etsy.com/v3/application/shops/${shopId}`, { headers }),
      ]);

      let imageUrl = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80';
      if (imageRes.ok) {
        const imgData = (await imageRes.json()) as Record<string, unknown>;
        const imgs = (imgData.results as EtsyImage[]) || [];
        if (imgs.length > 0) imageUrl = imgs[0].url_570xN || imgs[0].url_fullxfull || imageUrl;
      }

      let shopName = 'Unknown Shop';
      if (shopRes.ok) {
        const shopData = (await shopRes.json()) as Record<string, unknown>;
        shopName = (shopData.shop_name as string) || shopName;
      }

      const views = item.views || 0;
      const favs = item.num_favorers || 0;
      const creationTime = item.original_creation_timestamp || item.creation_timestamp;
      const daysAlive = Math.max(1, (now - creationTime) / (60 * 60 * 24));
      const viewVelocity = views / daysAlive;
      const favVelocity = favs / daysAlive;

      let rawEstimatedSales = viewVelocity * 0.03 + favVelocity * 0.25;
      if (views > 500 && rawEstimatedSales < 1) rawEstimatedSales += views / 2000;

      const estimatedSales24h = Math.max(0, Math.round(rawEstimatedSales));
      let score = estimatedSales24h * 8 + viewVelocity * 2 + Math.min(40, views / 50) + Math.min(30, favs / 5);
      score = Math.min(99, Math.max(12, Math.floor(score)));

      const isBestseller = estimatedSales24h >= 2 || viewVelocity > 5 || score > 80;
      if (isBestseller) score = Math.min(99, score + Math.floor(Math.random() * 5 + 5));

      return {
        id: `etsy_${listingId}`,
        title: item.title,
        category: item.taxonomy_id ? String(item.taxonomy_id) : 'unknown',
        price: item.price ? item.price.amount / item.price.divisor : 0,
        views,
        favs,
        estimatedSales24h,
        opportunityScore: score,
        isBestseller,
        shopName,
        imageUrl,
        url: item.url,
        isReal: true,
      };
    } catch {
      return null;
    }
  });

  const results = await Promise.all(fetchPromises);
  return results.filter(Boolean);
}

// ----------------------------
// SIMULATION MODE: Used when user has no Etsy token
// ----------------------------
function generateSimulatedProducts(keyword: string) {
  const lowerKw = keyword.trim().toLowerCase();
  const hash = lowerKw.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  const adjectives = ['Premium', 'Custom', 'Personalized', 'Vintage', 'Aesthetic', 'Minimalist', 'Handmade'];
  const shopNames = ['StudioCrafts', 'DesignLab', 'CreativeVibes', 'ArtisanGoods', 'PrintysellShop'];

  return Array.from({ length: 12 }, (_, index) => {
    const pHash = hash + index;
    const isBestseller = pHash % 3 === 0;
    const views = 500 + (pHash % 5000);
    const favs = Math.floor(views * (0.05 + (pHash % 10) / 100));
    const price = 15 + (pHash % 40) + (pHash % 100) / 100;
    const estimatedSales = isBestseller ? 5 + (pHash % 15) : pHash % 5;
    const score = Math.min(99, Math.max(50, 60 + (pHash % 40) + (isBestseller ? 10 : 0)));
    const imageUrl = `https://loremflickr.com/600/600/${encodeURIComponent(lowerKw)}?lock=${pHash}`;

    return {
      id: `sim_${pHash}`,
      title: `${adjectives[pHash % adjectives.length]} ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Unique E-commerce Design`,
      category: 'simulated',
      price: parseFloat(price.toFixed(2)),
      views,
      favs,
      estimatedSales24h: estimatedSales,
      opportunityScore: score,
      isBestseller,
      shopName: shopNames[pHash % shopNames.length] + Math.floor(Math.random() * 99),
      imageUrl,
      url: '#',
      isReal: false,
    };
  }).sort((a, b) => b.opportunityScore - a.opportunityScore);
}

// ----------------------------
// MAIN ROUTE HANDLER
// ----------------------------
export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();
    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    // Try to get the logged-in user's Etsy OAuth token
    let accessToken: string | null = null;
    try {
      const cookieStore = req.headers.get('cookie') || '';
      const match = cookieStore.match(/auth_token=([^;]+)/);
      if (match) {
        const { payload } = await jwtVerify(match[1], JWT_SECRET);
        const userId = payload.id as string;
        // Check if user has a connected Etsy account
        const tokenRecord = await prisma.etsyToken.findUnique({ where: { userId } });
        if (tokenRecord) {
          accessToken = await getValidEtsyToken(userId);
        }
      }
    } catch {
      // No valid session - will use simulation
    }

    if (accessToken) {
      // User has connected Etsy → use real API with their OAuth token
      try {
        const products = await fetchRealEtsyProducts(keyword, accessToken);
        return NextResponse.json({ products, mode: 'real' });
      } catch (err) {
        // Real API failed - fall back to simulation
        console.error('Real Etsy search failed, falling back to simulation:', err);
      }
    }

    // No Etsy connection or real API failed → use simulation
    const products = generateSimulatedProducts(keyword);
    return NextResponse.json({ products, mode: 'simulation' });

  } catch (err: unknown) {
    console.error('Native Etsy research error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
