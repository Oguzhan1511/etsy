import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/etsy';

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    await prisma.etsyToken.deleteMany({
      where: { userId }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Disconnect error:", err);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
