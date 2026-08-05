import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    let userId = '';

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id as string;
      } catch (err) {}
    }

    if (!userId) {
      const url = new URL(req.url);
      userId = url.searchParams.get('userId') || req.headers.get('x-user-id') || '';
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        tokens: true,
        paymentStatus: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        nextBillingDate: true,
        cardLast4: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Check if trial has expired and calculate remaining days/hours
    let daysLeftInTrial = 0;
    let isTrialActive = false;

    if (user.trialEndsAt) {
      const now = Date.now();
      const trialEnd = new Date(user.trialEndsAt).getTime();
      const diffMs = trialEnd - now;
      if (diffMs > 0) {
        isTrialActive = true;
        daysLeftInTrial = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }
    }

    return NextResponse.json({
      success: true,
      subscription: {
        plan: user.plan,
        paymentStatus: user.paymentStatus,
        subscriptionStatus: user.subscriptionStatus || (user.paymentStatus ? 'active' : 'none'),
        isTrialActive,
        daysLeftInTrial,
        trialEndsAt: user.trialEndsAt,
        nextBillingDate: user.nextBillingDate,
        cardLast4: user.cardLast4 || '4242',
        tokens: user.tokens,
      },
    });
  } catch (error) {
    console.error('Subscription status fetch error:', error);
    return NextResponse.json({ error: 'Abonelik bilgisi alınamadı.' }, { status: 500 });
  }
}
