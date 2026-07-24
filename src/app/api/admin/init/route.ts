import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      take: 1
    });

    if (users.length > 0) {
      const user = users[0];
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
      });
      return NextResponse.json({ success: true, message: `Kullanıcı ${user.email} başarıyla ADMIN yapıldı.` });
    }

    return NextResponse.json({ success: false, message: 'Sistemde hiç kullanıcı bulunamadı.' });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
