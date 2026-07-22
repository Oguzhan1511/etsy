import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Doğrulama kodu (token) eksik.' }, { status: 400 });
    }

    // Find the user with this token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bir doğrulama kodu.' }, { status: 400 });
    }

    // If already verified
    if (user.isVerified) {
      return NextResponse.json({ success: true, message: 'Hesabınız zaten doğrulanmış. Giriş yapabilirsiniz.' });
    }

    // Mark as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Hesabınız başarıyla onaylandı!' });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Hesap doğrulanırken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
