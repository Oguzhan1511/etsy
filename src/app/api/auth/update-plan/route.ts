import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json({ error: 'Eksik bilgi gönderildi.' }, { status: 400 });
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan,
        paymentStatus: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Update Plan Error:', error);
    return NextResponse.json({ error: 'Plan güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}
