import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-development');

export async function POST(req: Request) {
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

    const body = await req.json().catch(() => ({}));
    if (!userId && body.userId) {
      userId = body.userId;
    }
    if (!userId) {
      userId = req.headers.get('x-user-id') || '';
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği bulunamadı.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Cancel subscription / trial
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'cancelled',
        paymentStatus: false,
        plan: 'none',
      },
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
      nextBillingDate: null,
      cardLast4: updatedUser.cardLast4,
    };

    return NextResponse.json({
      success: true,
      message: 'Aboneliğiniz ve 3 günlük deneme süreniz başarıyla iptal edildi. Kartınızdan hiçbir ücret tahsil edilmeyecektir.',
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Subscription Cancel Error:', error);
    return NextResponse.json({ error: 'İptal işlemi sırasında bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
