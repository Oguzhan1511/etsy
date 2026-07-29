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
    `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=100&sort_on=score`,
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

  const personalizationRegex = /custom|personalized|personalisation|customized|kişiye\s*özel/i;

  const now = Date.now() / 1000;
  
  rawListings = rawListings.filter(item => {
    const title = item.title || "";
    if (personalizationRegex.test(title)) return false;

    const views = item.views || 0;
    const favs = item.num_favorers || 0;
    const creationTime = item.original_creation_timestamp || item.creation_timestamp || now;
    const daysAlive = Math.max(1, (now - creationTime) / (60 * 60 * 24));
    
    const viewVelocity = views / daysAlive;
    const favVelocity = favs / daysAlive;
    const estimatedSales24h = (viewVelocity * 0.03) + (favVelocity * 0.25);

    // Koşul: 24 saatte satış almış olma potansiyeli veya 20'den fazla görüntülenme
    return views > 20 || estimatedSales24h >= 0.5;
  });

  rawListings.sort((a, b) => {
    const getScore = (item: EtsyListing) => {
      const creation = item.original_creation_timestamp || item.creation_timestamp || now;
      const daysAlive = Math.max(1, (now - creation) / (60 * 60 * 24));
      const views = item.views || 0;
      const favs = item.num_favorers || 0;
      
      const dailyViews = views / daysAlive;
      const dailyFavs = favs / daysAlive;
      const favRatio = views > 0 ? (favs / views) : 0;
      
      // A product is trending if it has high daily views AND high favorites ratio
      const trendScore = (dailyViews * 0.4) + (dailyFavs * 2.0) + (favRatio * 50);
      
      // Penalize old products that have stagnant views
      const agePenalty = daysAlive > 365 ? 0.8 : 1.0; 
      
      // Bonus for new products getting rapid traction (viral potential)
      const viralBonus = daysAlive < 30 && dailyViews > 10 ? 1.5 : 1.0;

      let finalScore = trendScore * agePenalty * viralBonus;

      // Filter out duds
      if (views < 10 && daysAlive > 14) finalScore *= 0.1;

      return finalScore;
    };
    return getScore(b) - getScore(a);
  });
  rawListings = rawListings.slice(0, 10);


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

      const favRatio = views > 0 ? (favs / views) : 0;
      
      // Yüksek Doğruluklu Satış Potansiyeli Analizi (High Accuracy Sales Potential)
      const trendScore = (viewVelocity * 0.4) + (favVelocity * 2.0) + (favRatio * 50);
      const agePenalty = daysAlive > 365 ? 0.8 : 1.0; 
      const viralBonus = daysAlive < 30 && viewVelocity > 10 ? 1.5 : 1.0;
      const internalScore = trendScore * agePenalty * viralBonus;

      let rawEstimatedSales = (viewVelocity * 0.05) + (favVelocity * 0.3) + (favRatio * 2);
      if (views > 500 && rawEstimatedSales < 1) rawEstimatedSales += views / 2000;

      const estimatedSales24h = Math.max(0, Math.round(rawEstimatedSales));
      
      // Fırsat Skoru (Opportunity Score) 0-99 arasına oturtulur
      let score = Math.min(99, Math.max(45, Math.floor(internalScore * 1.5)));

      const isBestseller = estimatedSales24h >= 2 || viewVelocity > 7 || score > 85;
      if (isBestseller) score = Math.min(99, score + Math.floor(Math.random() * 3 + 2));

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
