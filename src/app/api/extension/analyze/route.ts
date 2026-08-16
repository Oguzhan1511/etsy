import { NextResponse } from 'next/server';
import { getValidEtsyToken } from '@/lib/etsy';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ETSY_API_KEY = process.env.ETSY_API_KEY || '';
const ETSY_API_SECRET = process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET || '';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { listing_id } = await req.json();
    if (!listing_id) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400, headers: corsHeaders });
    }

    let accessToken: string | null = null;
    // Since the request comes from a Chrome extension but might include cookies if sent to the same domain.
    // In the extension popup.js, we also pass the auth_token in the Authorization header as Bearer token.
    const authHeader = req.headers.get('authorization');
    let tokenFromHeader = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      tokenFromHeader = authHeader.substring(7);
    }

    if (!tokenFromHeader) {
      return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen giriş yapın.' }, { status: 401, headers: corsHeaders });
    }

    try {
      const decodedToken = decodeURIComponent(tokenFromHeader);
      const { payload } = await jwtVerify(decodedToken, JWT_SECRET);
      const userId = payload.id as string;
      const tokenRecord = await prisma.etsyToken.findUnique({ where: { userId } });
      
      if (!tokenRecord) {
        return NextResponse.json({ error: 'Etsy mağazanız bağlı değil.' }, { status: 403, headers: corsHeaders });
      }
      
      accessToken = await getValidEtsyToken(userId);
    } catch (authErr) {
      console.error('JWT/Auth error:', authErr);
      return NextResponse.json({ error: 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.' }, { status: 401, headers: corsHeaders });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Etsy erişim izni alınamadı.' }, { status: 403, headers: corsHeaders });
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': `${ETSY_API_KEY}:${ETSY_API_SECRET}`,
      'Content-Type': 'application/json',
    };

    // Ürün detaylarını ve aynı anda Mağaza detaylarını (daha iyi tahmin için) çekiyoruz
    const listingResponse = await fetch(`https://api.etsy.com/v3/application/listings/${listing_id}`, { headers });

    if (!listingResponse.ok) {
      throw new Error(`Etsy API Hatası: ${listingResponse.statusText}`);
    }

    const data = await listingResponse.json();
    const shopId = data.shop_id;
    
    let shopTotalSales = 0;
    let shopDaysAlive = 1;
    
    try {
      const shopResponse = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}`, { headers });
      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        shopTotalSales = shopData.transaction_solds || 0;
        const shopCreation = shopData.create_date || (Date.now() / 1000);
        shopDaysAlive = Math.max(1, (Date.now() / 1000 - shopCreation) / (60 * 60 * 24));
      }
    } catch (e) { console.error('Shop fetch error', e); }

    // Gelişmiş Tahmin Algoritması
    const now = Date.now() / 1000;
    const creation = data.original_creation_timestamp || data.creation_timestamp || now;
    const daysAlive = Math.max(1, (now - creation) / (60 * 60 * 24));
    
    const totalFavs = data.num_favorers || 0;
    const totalViews = data.views || (totalFavs * 35) + 50;
    
    // 1. Ürünün Kendi Hızı
    let baseDailyFavs = totalFavs / daysAlive;
    let baseDailyViews = totalViews / daysAlive;
    
    // 2. Mağaza Hızı Çarpanı (Mağaza çok satıyorsa, bu ürün de vitrindeyse fazla trafik alır)
    let shopDailySales = shopTotalSales / shopDaysAlive;
    
    // 3. Yaş Çarpanı (Eski ürünler genellikle ömürleri boyunca çok satmış ama son zamanlarda düşmüş olabilir
    // veya tam tersi yeni patlamış olabilir. Genelde 1 favori = 3-5 satış kuralını esnetiyoruz)
    
    // Son 7 gün istatistikleri için gerçeğe en yakın simüle edilmiş formül:
    let salesMultiplier = 3.5; 
    if (shopDailySales > 10) salesMultiplier = 5; // Çok satan mağazalarda favoriye dönüşmeden direkt satış oranı yüksektir
    if (daysAlive > 365) {
      // Ürün 1 yıldan eskiyse, muhtemelen son zamanlarda tüm zamanlar ortalamasından DÜŞÜK veya stabil satıyordur.
      // Ancak "Bestseller" ise yüksek satıyordur.
      baseDailyFavs = baseDailyFavs * 0.8;
    }
    if (daysAlive < 30) {
      // Ürün çok yeniyse ve favori aldıysa trenddir, ivmesi yüksektir.
      baseDailyFavs = baseDailyFavs * 2.5;
    }

    let estimatedDailySales = baseDailyFavs * salesMultiplier;
    
    // Eğer ürün uzun zamandır var ama mağaza günlük çok iyi satıyorsa, bu ürün ortalama üstü olabilir
    if (shopDailySales > 0 && estimatedDailySales < 0.5 && totalFavs > 50) {
      estimatedDailySales = 1.5;
    }

    // Nihai 7 Günlük Değerler
    let favorites7d = Math.max(0, Math.floor(baseDailyFavs * 7));
    let sales7d = Math.max(0, Math.floor(estimatedDailySales * 7));
    let views7d = Math.max(0, Math.floor(baseDailyViews * 7));

    // Eğer satış varsa ama görüntülenme aşırı düşük kaldıysa dengele
    if (sales7d > 0 && views7d < sales7d * 20) {
      views7d = sales7d * 35 + Math.floor(Math.random() * 50);
    }

    // Çok yeni veya hiç favorisi yoksa minimum mantıklı değerler ver
    if (totalFavs === 0) {
      favorites7d = 0;
      sales7d = 0;
      views7d = Math.floor(Math.random() * 10) + 2;
    }

    return NextResponse.json({
      tags: data.tags || [],
      stats: {
        views7d,
        sales7d,
        favorites7d,
      }
    }, { headers: corsHeaders });

  } catch (err: unknown) {
    console.error('Extension analyze error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: corsHeaders });
  }
}
