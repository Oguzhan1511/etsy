import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const clientId = process.env.ETSY_API_KEY;
  const redirectUri = process.env.ETSY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Etsy credentials not configured in .env.local" }, { status: 500 });
  }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const scopes = [
    'email_r',
    'listings_r',
    'listings_w',
    'listings_d',
    'orders_r',
    'orders_w',
    'profile_r',
    'profile_w',
    'shops_r',
    'shops_w',
    'transactions_r',
    'billing_r',
    'feedback_r',
  ].join('%20');

  const authUrl = `https://www.etsy.com/oauth/connect?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  const response = NextResponse.redirect(authUrl);

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  };

  response.cookies.set('etsy_code_verifier', codeVerifier, cookieOpts);
  response.cookies.set('etsy_pending_user_id', userId, cookieOpts);

  return response;
}
