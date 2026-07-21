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

    // 1. Fetch listings using global search (get 50 to find the best ones)
    const searchRes = await fetch(`https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=50&sort_on=score`, {
      headers: getEtsyHeaders()
    });

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error("Etsy search error:", errorText);
      throw new Error(`Failed to fetch from Etsy: ${searchRes.statusText}`);
    }

    const data = (await searchRes.json()) as Record<string, unknown>;
    let rawListings = (data.results as EtsyListing[]) || [];

    // 2. Filter out 0-view items and sort by views/favorites to get the most "winning" products
    rawListings = rawListings.filter(item => (item.views || 0) > 5 || (item.num_favorers || 0) > 0);
    rawListings.sort((a, b) => {
      const scoreA = (a.views || 0) + (a.num_favorers || 0) * 10;
      const scoreB = (b.views || 0) + (b.num_favorers || 0) * 10;
      return scoreB - scoreA;
    });

    // Take top 12
    rawListings = rawListings.slice(0, 12);

    // 3. Fetch images and shop names in parallel, but throttle to respect rate limits
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

        // Calculate Opportunity Score & 24h Sales Estimate
        const views = item.views || 0;
        const favs = item.num_favorers || 0;
        const creationTime = item.original_creation_timestamp || item.creation_timestamp;
        
        const daysAlive = Math.max(1, (now - creationTime) / (60 * 60 * 24));
        const viewVelocity = views / daysAlive;
        const favVelocity = favs / daysAlive;
        
        // Estimate 24h sales based on view and favorer velocity (assuming ~2% conversion on views, and higher intent on favs)
        const estimatedSales24h = Math.max(0, Math.round((viewVelocity * 0.015) + (favVelocity * 0.1)));

        // Base score off estimated sales (highest priority) and engagement
        let score = (estimatedSales24h * 15) + (viewVelocity * 1.5) + (favVelocity * 5);
        score = Math.min(99, Math.max(10, score)); // Keep between 10 and 99
        score = Math.floor(score);
        
        // Bonus for bestsellers (high sales velocity)
        const isBestseller = estimatedSales24h >= 2 || viewVelocity > 15;
        if (isBestseller) score = Math.min(99, score + 12);

        products.push({
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
        });
      } catch (innerErr) {
        console.error(`Error enriching listing ${listingId}:`, innerErr);
        // Continue loop even if one item fails
      }
    }

    // Explicitly sort products from highest opportunity score (potential) to lowest
    products.sort((a, b) => b.opportunityScore - a.opportunityScore);

    return NextResponse.json({ products });
  } catch (err: unknown) {
    console.error("Native Etsy research error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
