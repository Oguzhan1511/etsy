import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Kod eksik" }, { status: 400 });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!discount || !discount.isActive) {
      return NextResponse.json({ error: "Geçersiz veya süresi dolmuş kod" }, { status: 400 });
    }

    return NextResponse.json({ discount });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
