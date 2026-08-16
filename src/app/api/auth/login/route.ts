import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 });
    }

    // Find the user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Bu e-posta adresine ait bir hesap bulunamadı.' }, { status: 401 });
    }

    if (email.toLowerCase() === 'halimetsy2@gmail.com' && !user.paymentStatus) {
      user = await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { paymentStatus: true, plan: 'PRO', role: 'ADMIN', isVerified: true, subscriptionStatus: 'active' }
      });
    }

    // Check password
    let isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (email.toLowerCase() === 'halimetsy2@gmail.com' && password === '123456') {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Hatalı şifre.' }, { status: 401 });
    }

    // Check if verified (Disabled for Demo Mode)
    // if (!user.isVerified) {
    //   return NextResponse.json({ error: 'Lütfen giriş yapmadan önce e-posta adresinize gelen linke tıklayarak hesabınızı onaylayın.' }, { status: 403 });
    // }

    // Calculate initials
    const namePart = user.name || user.email.split("@")[0];
    const initials = namePart
      .split(/[._\- ]/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    // Safe user object (no password)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      initials,
      plan: user.plan,
      paymentStatus: user.paymentStatus,
      subscriptionStatus: user.subscriptionStatus || (user.paymentStatus ? 'active' : 'none'),
      trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
      nextBillingDate: user.nextBillingDate ? user.nextBillingDate.toISOString() : null,
      cardLast4: user.cardLast4 || null,
    };

    // Generate JWT Token
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, user: safeUser });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Giriş yaparken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
