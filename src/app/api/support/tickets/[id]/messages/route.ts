import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { userId, message, isAdmin } = body;

    if (!userId || !message) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: params.id,
        userId,
        message,
        isAdmin: isAdmin || false,
      },
    });

    await prisma.supportTicket.update({
      where: { id: params.id },
      data: {
        updatedAt: new Date(),
        status: !isAdmin ? "OPEN" : undefined
      }
    });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
