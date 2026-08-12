import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, planId, cardNumber, cardHolder, discountCode } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Determine plan and tokens
    let assignedPlan = 'Standard';
    let grantedTokens = 10;

    const normalizedPlan = (planId || '').toLowerCase();
    if (normalizedPlan === 'premium' || normalizedPlan === 'plus') {
      assignedPlan = 'Premium';
      grantedTokens = 100;
    } else if (normalizedPlan === 'pro') {
      assignedPlan = 'Pro';
      grantedTokens = 50;
    } else {
      assignedPlan = 'Standard';
      grantedTokens = 10;
    }

    const cleanCard = (cardNumber || '').replace(/\D/g, '');
    const cardLast4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';

    // 3 days from now
    const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const nextBillingDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    let discountCodeId = null;
    if (discountCode) {
      const dbDiscount = await prisma.discountCode.findUnique({ where: { code: discountCode.trim().toUpperCase() } });
      if (dbDiscount && dbDiscount.isActive) {
        discountCodeId = dbDiscount.id;
      }
    }

    // 3-Day Free Trial initiated: Update user plan, trial status, and tokens
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: assignedPlan,
        paymentStatus: true,
        subscriptionStatus: 'trial',
        trialEndsAt: trialEndsAt,
        nextBillingDate: nextBillingDate,
        cardLast4: cardLast4,
        tokens: grantedTokens,
        ...(discountCodeId && { discountCodeId }),
      }
    });

    const namePart = updatedUser.name || updatedUser.email.split("@")[0];
    const initials = namePart
      .split(/[._\- ]/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      initials,
      plan: updatedUser.plan,
      paymentStatus: updatedUser.paymentStatus,
      subscriptionStatus: updatedUser.subscriptionStatus,
      trialEndsAt: updatedUser.trialEndsAt?.toISOString() || null,
      nextBillingDate: updatedUser.nextBillingDate?.toISOString() || null,
      cardLast4: updatedUser.cardLast4,
      tokens: updatedUser.tokens
    };

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error('Mock Payment Error:', error);
    return NextResponse.json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' }, { status: 500 });
  }
}
