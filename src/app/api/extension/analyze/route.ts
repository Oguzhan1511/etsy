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

    const response = await fetch(`https://api.etsy.com/v3/application/listings/${listing_id}`, { headers });

    if (!response.ok) {
      throw new Error(`Etsy API Hatası: ${response.statusText}`);
    }

    const data = await response.json();

    // Matematiksel tahminler (Etsy başkalarının gerçek istatistiklerini vermez, favori hızından hesaplarız)
    const now = Date.now() / 1000;
    const creation = data.original_creation_timestamp || data.creation_timestamp || now;
    const daysAlive = Math.max(1, (now - creation) / (60 * 60 * 24));
    const totalFavs = data.num_favorers || 0;
    const totalViews = data.views || (totalFavs * 35) + 50;

    const favVelocity = totalFavs / daysAlive;
    
    // Son 7 gün istatistik tahminleri
    let favorites7d = Math.floor(favVelocity * 7);
    let sales7d = Math.floor(favVelocity * 3.5 * 7);
    let views7d = Math.floor((totalViews / daysAlive) * 7);

    // Çok yeni veya hiç favorisi yoksa 0
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
