import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    etsyKey: process.env.ETSY_API_KEY ? `Uzunluk: ${process.env.ETSY_API_KEY.length}, Ilk 5 harf: ${process.env.ETSY_API_KEY.substring(0, 5)}` : 'BULUNAMADI',
    redirectUri: process.env.ETSY_REDIRECT_URI || 'BULUNAMADI',
    env: process.env.NODE_ENV
  });
}
