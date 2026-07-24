import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Mock payment successful: Update user plan and payment status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planId || 'pro',
        paymentStatus: true,
        tokens: planId === 'plus' ? 999999 : (planId === 'pro' ? 100 : 30)
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Mock Payment Error:', error);
    return NextResponse.json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' }, { status: 500 });
  }
}
