import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?etsy_error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  const clientId = process.env.ETSY_API_KEY;
  const redirectUri = process.env.ETSY_REDIRECT_URI;

  const cookieHeader = request.headers.get('cookie') || '';
  const getcookie = (name: string) => {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const codeVerifier = getcookie('etsy_code_verifier');
  const userId = getcookie('etsy_pending_user_id');

  if (!clientId || !redirectUri || !codeVerifier || !userId) {
    console.error("Missing config:", { clientId: !!clientId, redirectUri: !!redirectUri, codeVerifier: !!codeVerifier, userId: !!userId });
    return NextResponse.redirect(new URL('/dashboard?etsy_error=missing_config', request.url));
  }

  try {
    const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      return NextResponse.redirect(new URL('/dashboard?etsy_error=oauth_failed', request.url));
    }

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.etsyToken.upsert({
      where: { userId },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      },
      create: {
        userId,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      },
    });

    const response = NextResponse.redirect(new URL('/dashboard?etsy_connected=true', request.url));
    response.cookies.set('etsy_code_verifier', '', { maxAge: 0, path: '/' });
    response.cookies.set('etsy_pending_user_id', '', { maxAge: 0, path: '/' });
    return response;

  } catch (err) {
    console.error('Error exchanging Etsy token:', err);
    return NextResponse.redirect(new URL('/dashboard?etsy_error=internal_error', request.url));
  }
}
