import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const discounts = await prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    return NextResponse.json({ discounts });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountPct } = body;

    if (!code || typeof discountPct !== 'number') {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const existing = await prisma.discountCode.findUnique({
      where: { code }
    });

    if (existing) {
      return NextResponse.json({ error: "Bu kod zaten mevcut" }, { status: 400 });
    }

    const discount = await prisma.discountCode.create({
      data: {
        code,
        discountPct,
        isActive: true
      },
    });

    return NextResponse.json({ discount });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
