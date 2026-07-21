import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?etsy_error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  const clientId = process.env.ETSY_API_KEY;
  const redirectUri = process.env.ETSY_REDIRECT_URI;
  
  // Try to get cookie from request directly
  const cookieStore = request.headers.get('cookie') || '';
  let codeVerifier = '';
  const match = cookieStore.match(/etsy_code_verifier=([^;]+)/);
  if (match) {
    codeVerifier = match[1];
  }

  if (!clientId || !redirectUri || !codeVerifier) {
    return NextResponse.json({ error: "Missing configuration or code_verifier session" }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Etsy OAuth Error:", data);
      return NextResponse.redirect(new URL('/?etsy_error=oauth_failed', request.url));
    }

    // Save tokens to our database using Prisma
    // We only need one token record since it's a single seller app
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.etsyToken.upsert({
      where: { id: 1 },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      },
      create: {
        id: 1,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      },
    });

    return NextResponse.redirect(new URL('/?etsy_connected=true', request.url));
  } catch (err) {
    console.error('Error exchanging Etsy token:', err);
    return NextResponse.redirect(new URL('/?etsy_error=internal_error', request.url));
  }
}
