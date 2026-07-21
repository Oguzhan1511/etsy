import { NextResponse } from 'next/server';

const ETSY_API_KEY = process.env.ETSY_API_KEY;
const ETSY_SHARED_SECRET = process.env.ETSY_SHARED_SECRET;

const getEtsyHeaders = () => {
  return {
    "x-api-key": `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
    "Content-Type": "application/json"
  };
};

// Rate limiter helper function (simple sleep)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      return NextResponse.json({ error: "Etsy Developer keys missing in environment variables" }, { status: 500 });
    }

    // 1. Fetch listings using global search
    const searchRes = await fetch(`https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=12`, {
      headers: getEtsyHeaders()
    });

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error("Etsy search error:", errorText);
      throw new Error(`Failed to fetch from Etsy: ${searchRes.statusText}`);
    }

    const data = (await searchRes.json()) as Record<string, unknown>;
    const rawListings = (data.results as EtsyListing[]) || [];

    // 2. Fetch images and shop names in parallel, but throttle to respect rate limits
    const products = [];
    const now = Date.now() / 1000;

    for (const item of rawListings) {
      const listingId = item.listing_id;
      const shopId = item.shop_id;

      // Rate limit protection - Wait 150ms between iterations
      await sleep(150);

      try {
        // Fetch Image
        const imageRes = await fetch(`https://api.etsy.com/v3/application/listings/${listingId}/images`, {
          headers: getEtsyHeaders()
        });
        
        let imageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"; // fallback
        if (imageRes.ok) {
          const imgData = (await imageRes.json()) as Record<string, unknown>;
          const imgs = (imgData.results as EtsyImage[]) || [];
          if (imgs.length > 0) {
            imageUrl = imgs[0].url_570xN || imgs[0].url_fullxfull || imageUrl;
          }
        }

        // Fetch Shop Name
        const shopRes = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}`, {
          headers: getEtsyHeaders()
        });
        
        let shopName = "Unknown Shop";
        if (shopRes.ok) {
          const shopData = (await shopRes.json()) as Record<string, unknown>;
          shopName = (shopData.shop_name as string) || shopName;
        }

        // Calculate Opportunity Score
        // Simple algorithm: 
        // 1. View Velocity: Views / Days Alive
        // 2. Engagement: Favs / Views
        // 3. Normalize to a 0-100 scale
        const views = item.views || 0;
        const favs = item.num_favorers || 0;
        const creationTime = item.original_creation_timestamp || item.creation_timestamp;
        
        const daysAlive = Math.max(1, (now - creationTime) / (60 * 60 * 24));
        const viewVelocity = views / daysAlive;
        const engagementRate = views > 0 ? (favs / views) : 0;
        
        // Base score off velocity and engagement, cap at 99
        let score = (viewVelocity * 2) + (engagementRate * 500);
        score = Math.min(99, Math.max(10, score)); // Keep between 10 and 99
        score = Math.floor(score);
        
        // Bonus for bestsellers (simulated or if we detect high velocity)
        const isBestseller = viewVelocity > 10;
        if (isBestseller) score = Math.min(99, score + 15);

        products.push({
          id: `etsy_${listingId}`,
          title: item.title,
          category: item.taxonomy_id ? String(item.taxonomy_id) : "unknown",
          price: item.price ? (item.price.amount / item.price.divisor) : 0,
          views: views,
          favs: favs,
          opportunityScore: score,
          isBestseller: isBestseller,
          shopName: shopName,
          imageUrl: imageUrl,
          url: item.url
        });
      } catch (innerErr) {
        console.error(`Error enriching listing ${listingId}:`, innerErr);
        // Continue loop even if one item fails
      }
    }

    return NextResponse.json({ products });
  } catch (err: unknown) {
    console.error("Native Etsy research error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
