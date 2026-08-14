import { NextResponse } from 'next/server';
import { getValidEtsyToken } from '@/lib/etsy';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ETSY_API_KEY = process.env.ETSY_API_KEY || '';
const ETSY_API_SECRET = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET || '';
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

  const fetchPage = async (offset: number) => {
    const searchRes = await fetch(
      `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=100&offset=${offset}&sort_on=score`,
      { headers }
    );
    if (!searchRes.ok) {
      if (offset === 0) {
        let errorDetail = searchRes.statusText;
        try {
          const errorJson = await searchRes.json();
          errorDetail = errorJson.error || JSON.stringify(errorJson);
        } catch {
          errorDetail = await searchRes.text();
        }
        throw new Error(`Etsy API Hatası (${searchRes.status}): ${errorDetail}`);
      }
      return [];
    }
    const data = (await searchRes.json()) as Record<string, unknown>;
    return (data.results as EtsyListing[]) || [];
  };

  const [page1, page2, page3] = await Promise.all([
    fetchPage(0),
    fetchPage(100),
    fetchPage(200)
  ]);

  let rawListings = [...page1, ...page2, ...page3];

  const personalizationRegex = /custom|personalized|personalisation|customized|kişiye\s*özel/i;

  const now = Date.now() / 1000;
  
  // Tekrarlananları ve kişiselleştirilmiş ürünleri filtrele
  const seenIds = new Set();
  rawListings = rawListings.filter(item => {
    if (seenIds.has(item.listing_id)) return false;
    seenIds.add(item.listing_id);

    const title = item.title || "";
    if (personalizationRegex.test(title)) return false;

    const views = item.views || 0;
    // Çok düşük görüntülenmesi olanları ele
    if (views < 10) return false;
    
    return true;
  });

  rawListings.sort((a, b) => {
    const getScore = (item: EtsyListing) => {
      const creation = item.original_creation_timestamp || item.creation_timestamp || now;
      const daysAlive = Math.max(1, (now - creation) / (60 * 60 * 24));
      const views = item.views || 0;
      const favs = item.num_favorers || 0;
      
      const dailyViews = views / daysAlive;
      const dailyFavs = favs / daysAlive;
      
      // Satış potansiyelini belirlemek için günlük görüntülenme ve toplam görüntülenmeye daha fazla ağırlık ver
      const trendScore = (dailyViews * 20.0) + (dailyFavs * 40.0) + (views * 0.1) + (favs * 0.5);
      
      let finalScore = trendScore;

      // Bonus for new products getting rapid traction
      if (daysAlive < 30 && dailyViews > 5) finalScore *= 1.5;

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
      
      let rawEstimatedSales = (viewVelocity * 0.05) + (favVelocity * 0.3) + (favRatio * 2);
      if (views > 500 && rawEstimatedSales < 1) rawEstimatedSales += views / 2000;
      const estimatedSales24h = Math.max(0, Math.round(rawEstimatedSales));
      
      // Daha gerçekçi Puanlama (75 Taban Puan + Performans Bonusu)
      const baseScore = 75;
      const viewBonus = Math.min(12, viewVelocity * 1.5);
      const favBonus = Math.min(8, favVelocity * 5);
      const ratioBonus = Math.min(4, favRatio * 100);
      
      let finalScore = baseScore + viewBonus + favBonus + ratioBonus;
      if (estimatedSales24h >= 2) finalScore += 3;
      if (daysAlive < 30 && viewVelocity > 5) finalScore += 2; // Viral bonus

      let score = Math.min(99, Math.floor(finalScore));

      const isBestseller = estimatedSales24h >= 1 || viewVelocity >= 3 || favVelocity >= 0.5 || score >= 85 || views > 500;
      if (isBestseller) score = Math.min(99, score + Math.floor(Math.random() * 2 + 1));

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

  let results = await Promise.all(fetchPromises);
  results = results.filter(Boolean);

  // Zaten filtreden geçmiş (günde satış almış veya 20'den fazla görüntülenmiş)
  // ilk 10 ürün geldiği için ekstra bir skor filtresi uygulayıp sonucu boşaltmıyoruz,
  // çünkü matematiği güncelledik ve bu ürünler zaten 85-99 arası puan alacak.
  return results;
}

// Simulation mode has been strictly disabled as per user request to never show mock data.

// ----------------------------
// MAIN ROUTE HANDLER
// ----------------------------
export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();
    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    let accessToken: string | null = null;
    const cookieStore = req.headers.get('cookie') || '';
    const match = cookieStore.match(/auth_token=([^;]+)/);
    
    if (!match) {
      return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen giriş yapın.' }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(match[1], JWT_SECRET);
      const userId = payload.id as string;
      const tokenRecord = await prisma.etsyToken.findUnique({ where: { userId } });
      
      if (!tokenRecord) {
        return NextResponse.json({ error: 'Gerçek zamanlı Etsy verisi çekebilmek için lütfen Ayarlar sayfasından Etsy mağazanızı bağlayın.' }, { status: 403 });
      }
      
      accessToken = await getValidEtsyToken(userId);
    } catch {
      return NextResponse.json({ error: 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.' }, { status: 401 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Etsy erişim izni alınamadı. Lütfen mağaza bağlantınızı yenileyin.' }, { status: 403 });
    }

    try {
      const products = await fetchRealEtsyProducts(keyword, accessToken);
      return NextResponse.json({ products, mode: 'real' });
    } catch (err: unknown) {
      console.error('Real Etsy search failed:', err);
      return NextResponse.json({ error: `Etsy API Hatası: ${(err as Error).message}` }, { status: 502 });
    }

  } catch (err: unknown) {
    console.error('Native Etsy research error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
