import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const userId = searchParams.get('userId');

  const clientId = process.env.ETSY_API_KEY;
  // Use configured ETSY_REDIRECT_URI or fallback to current origin callback
  const redirectUri = process.env.ETSY_REDIRECT_URI || `${origin}/api/etsy/callback`;

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Etsy credentials not configured in environment" }, { status: 500 });
  }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const state = crypto.randomBytes(16).toString('hex');

  const scopes = [
    'email_r',
    'listings_r',
    'listings_w',
    'listings_d',
    'transactions_r',
    'transactions_w',
    'profile_r',
    'profile_w',
    'shops_r',
    'shops_w',
    'billing_r',
    'feedback_r',
  ].join(' ');

  const authUrl = new URL('https://www.etsy.com/oauth/connect');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId.trim());
  authUrl.searchParams.set('redirect_uri', redirectUri.trim());
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(authUrl.toString());

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  };

  response.cookies.set('etsy_code_verifier', codeVerifier, cookieOpts);
  response.cookies.set('etsy_pending_user_id', userId, cookieOpts);
  response.cookies.set('etsy_oauth_state', state, cookieOpts);
  response.cookies.set('etsy_oauth_redirect_uri', redirectUri.trim(), cookieOpts);

  return response;
}

