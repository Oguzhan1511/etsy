import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ETSY_API_KEY = process.env.ETSY_API_KEY;
const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET;

const getEtsyHeaders = () => {
  return {
    "x-api-key": `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
    "Content-Type": "application/json"
  };
};

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

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    if (!ETSY_API_KEY || !ETSY_SHARED_SECRET) {
      return NextResponse.json({ 
        error: "Eksik Kurulum: Vercel üzerinde ETSY_API_KEY veya ETSY_SHARED_SECRET eksik. Lütfen Vercel ayarlarından Environment Variables kısmını kontrol edin." 
      }, { status: 500 });
    }

    // 1. Fetch listings using global search
    const searchRes = await fetch(`https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=50&sort_on=score`, {
      headers: getEtsyHeaders()
    });

    if (!searchRes.ok) {
      let errorDetail = searchRes.statusText;
      try {
        const errorJson = await searchRes.json();
        errorDetail = errorJson.error || JSON.stringify(errorJson);
      } catch (e) {
        errorDetail = await searchRes.text();
      }
      console.error("Etsy search error:", errorDetail);
      throw new Error(`Etsy API Hatası (${searchRes.status}): ${errorDetail}`);
    }

    const data = (await searchRes.json()) as Record<string, unknown>;
    let rawListings = (data.results as EtsyListing[]) || [];

    // 2. Filter and sort
    rawListings = rawListings.filter(item => (item.views || 0) > 0 || (item.num_favorers || 0) > 0);
    rawListings.sort((a, b) => {
      const scoreA = (a.views || 0) + (a.num_favorers || 0) * 15;
      const scoreB = (b.views || 0) + (b.num_favorers || 0) * 15;
      return scoreB - scoreA;
    });

    rawListings = rawListings.slice(0, 12);
    const now = Date.now() / 1000;

    // 3. Fetch images and shop names
    const fetchPromises = rawListings.map(async (item) => {
      const listingId = item.listing_id;
      const shopId = item.shop_id;

      try {
        const [imageRes, shopRes] = await Promise.all([
          fetch(`https://api.etsy.com/v3/application/listings/${listingId}/images`, { headers: getEtsyHeaders() }),
          fetch(`https://api.etsy.com/v3/application/shops/${shopId}`, { headers: getEtsyHeaders() })
        ]);
        
        let imageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"; // fallback
        if (imageRes.ok) {
          const imgData = (await imageRes.json()) as Record<string, unknown>;
          const imgs = (imgData.results as EtsyImage[]) || [];
          if (imgs.length > 0) {
            imageUrl = imgs[0].url_570xN || imgs[0].url_fullxfull || imageUrl;
          }
        }

        let shopName = "Unknown Shop";
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
        
        let rawEstimatedSales = (viewVelocity * 0.03) + (favVelocity * 0.25);
        if (views > 500 && rawEstimatedSales < 1) {
            rawEstimatedSales += (views / 2000);
        }
        
        const estimatedSales24h = Math.max(0, Math.round(rawEstimatedSales));

        let score = (estimatedSales24h * 8) + (viewVelocity * 2) + Math.min(40, views / 50) + Math.min(30, favs / 5);
        score = Math.min(99, Math.max(12, score));
        score = Math.floor(score);
        
        const isBestseller = estimatedSales24h >= 2 || viewVelocity > 5 || score > 80;
        if (isBestseller) score = Math.min(99, score + Math.floor(Math.random() * 5 + 5));

        return {
          id: `etsy_${listingId}`,
          title: item.title,
          category: item.taxonomy_id ? String(item.taxonomy_id) : "unknown",
          price: item.price ? (item.price.amount / item.price.divisor) : 0,
          views: views,
          favs: favs,
          estimatedSales24h: estimatedSales24h,
          opportunityScore: score,
          isBestseller: isBestseller,
          shopName: shopName,
          imageUrl: imageUrl,
          url: item.url
        };
      } catch (innerErr) {
        return null;
      }
    });

    const productsResult = await Promise.all(fetchPromises);
    const products = productsResult.filter(Boolean);

    products.sort((a: any, b: any) => b.opportunityScore - a.opportunityScore);

    return NextResponse.json({ products });
  } catch (err: unknown) {
    console.error("Native Etsy research error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
