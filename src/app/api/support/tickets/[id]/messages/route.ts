import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { userId, message, isAdmin } = body;

    if (!userId || !message) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: id,
        userId,
        message,
        isAdmin: isAdmin || false,
      },
    });

    await prisma.supportTicket.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        status: !isAdmin ? "OPEN" : undefined
      }
    });

    return NextResponse.json({ message: newMessage });
  } catch (error: any) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Sunucu hatası: " + (error?.message || "Bilinmeyen hata") }, { status: 500 });
  }
}
