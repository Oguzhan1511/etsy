import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const clientId = process.env.ETSY_API_KEY;
  const redirectUri = process.env.ETSY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Etsy credentials not configured in .env.local" }, { status: 500 });
  }

  // Generate a random string for the code verifier
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Create the code challenge using SHA-256
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // We need to store the codeVerifier to use it in the callback
  // In Next.js, we can set it as a secure HTTP-only cookie
  const response = NextResponse.redirect(
    `https://www.etsy.com/oauth/connect?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=email_r%20listings_r%20listings_w%20orders_r%20orders_w%20profile_r%20profile_w%20shops_r%20shops_w%20transactions_r&code_challenge=${codeChallenge}&code_challenge_method=S256`
  );

  response.cookies.set('etsy_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
