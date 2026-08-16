import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getValidEtsyToken } from '@/lib/etsy';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || 'shirt';

  const tokenRecord = await prisma.etsyToken.findFirst();
  if (!tokenRecord) return NextResponse.json({ error: 'No token in DB' });

  const accessToken = await getValidEtsyToken(tokenRecord.userId);
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'x-api-key': `${process.env.ETSY_API_KEY}:${process.env.ETSY_API_SECRET || process.env.ETSY_SHARED_SECRET}`,
    'Content-Type': 'application/json',
  };

  const searchRes = await fetch(
    `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=10&sort_on=score`,
    { headers }
  );
  
  const data = await searchRes.json();
  
  return NextResponse.json({
    results: (data.results || []).map((i: any) => ({
      id: i.listing_id,
      title: i.title,
      views: i.views,
      favs: i.num_favorers
    }))
  });
}
