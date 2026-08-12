import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, discountCodeId: true, discountCode: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const discounts = await prisma.discountCode.findMany({
      include: { _count: { select: { users: true } } },
    });
    return NextResponse.json({ users, discounts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
