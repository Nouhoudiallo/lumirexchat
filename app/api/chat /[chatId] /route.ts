import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ chatId: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "chatId manquant" }, { status: 400 });
  }
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ allChat: [chat] }, { status: 200 });
  } catch (error) {
    console.error("Erreur dans GET /api/chat/[chatId]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "chatId manquant" }, { status: 400 });
  }
  try {
    const { sender, text } = await request.json();
    if (!sender || !text) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat non trouvé" }, { status: 404 });
    }
    const message = await prisma.message.create({
      data: { chatId, sender, text },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Erreur dans POST /api/chat/[chatId]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}