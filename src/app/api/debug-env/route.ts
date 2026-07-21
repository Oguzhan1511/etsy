import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    etsyKey: process.env.ETSY_API_KEY || 'BULUNAMADI',
    redirectUri: process.env.ETSY_REDIRECT_URI || 'BULUNAMADI',
    env: process.env.NODE_ENV
  });
}
