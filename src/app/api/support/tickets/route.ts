import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId gerekli" }, { status: 400 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true } } }
        }
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("GET tickets error:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + (error?.message || "Bilinmeyen hata") }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, subject, initialMessage } = body;

    if (!userId || !subject || !initialMessage) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        messages: {
          create: {
            userId,
            message: initialMessage,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error("POST ticket error:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + (error?.message || "Bilinmeyen hata") }, { status: 500 });
  }
}
