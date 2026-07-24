import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const errors = await prisma.errorLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Sadece son 50 hatayı getir
    });

    return NextResponse.json({ success: true, errors });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
