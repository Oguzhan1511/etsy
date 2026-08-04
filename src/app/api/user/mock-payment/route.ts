import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json();

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

    // Mock payment successful: Update user plan and payment status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: assignedPlan,
        paymentStatus: true,
        tokens: grantedTokens
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Mock Payment Error:', error);
    return NextResponse.json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' }, { status: 500 });
  }
}
