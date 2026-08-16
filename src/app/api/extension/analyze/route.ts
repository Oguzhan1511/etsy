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
      'x-api-key': ETSY_API_KEY,
      'Content-Type': 'application/json',
    };

    // Önce kullanıcının kendi shop_id'sini alıyoruz
    let shopId: string | null = null;
    try {
      const meResponse = await fetch('https://api.etsy.com/v3/application/users/me', { headers });
      if (meResponse.ok) {
        const meData = await meResponse.json();
        const userId2 = meData.user_id;
        // Shop'u bul
        const shopResponse = await fetch(`https://api.etsy.com/v3/application/users/${userId2}/shops`, { headers });
        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          shopId = shopData.shop_id?.toString() || shopData.results?.[0]?.shop_id?.toString() || null;
        }
      }
    } catch (e) { console.error('Shop ID fetch error', e); }

    // Ürün temel verilerini çek
    const listingResponse = await fetch(`https://api.etsy.com/v3/application/listings/${listing_id}`, { headers });
    if (!listingResponse.ok) {
      throw new Error(`Etsy API Hatası: ${listingResponse.statusText}`);
    }
    const data = await listingResponse.json();

    const totalFavs: number = data.num_favorers || 0;
    const totalViews: number = data.views || 0;

    // Gerçek satış sayısını çek (sadece kendi mağaza ürünlerinde mümkün)
    let totalSales = 0;
    if (shopId) {
      try {
        // Listing'in satış sayısını transaction_count üzerinden al
        const receiptRes = await fetch(
          `https://api.etsy.com/v3/application/shops/${shopId}/receipts?listing_id=${listing_id}&limit=100`,
          { headers }
        );
        if (receiptRes.ok) {
          const receiptData = await receiptRes.json();
          // Her receipt birden fazla adet olabilir
          const receipts = receiptData.results || [];
          totalSales = receipts.reduce((acc: number, r: { quantity?: number }) => acc + (r.quantity || 1), 0);
          if (totalSales === 0 && receiptData.count) {
            totalSales = receiptData.count;
          }
        }
      } catch (e) { console.error('Receipt fetch error', e); }
    }

    // Eğer bu ürün başka birinin mağazasına aitse satışı tahmin et
    if (totalSales === 0 && totalFavs > 0) {
      totalSales = Math.floor(totalFavs * 3.5);
    }

    return NextResponse.json({
      tags: data.tags || [],
      stats: {
        views: totalViews,
        sales: totalSales,
        favorites: totalFavs,
      }
    }, { headers: corsHeaders });

  } catch (err: unknown) {
    console.error('Extension analyze error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500, headers: corsHeaders });
  }
}
