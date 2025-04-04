import prisma from "@/src/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, text, chatId } = await request.json(); // userId = clerUserId ici !

  try {
    // 1. Identifier l'utilisateur réel par son clerUserId
    const user = await prisma.user.findUnique({
      where: {
        clerUserId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: `Utilisateur non trouvé id: ${userId}` }, { status: 404 });
    }

    // 2. Envoyer à n8n pour générer la réponse du bot
    const { data: botData } = await axios.post(
      "https://n8n-doc.onrender.com/webhook/lumichat",
      {
        chatId,
        text,
      }
    );

    const { error, output: botText } = botData;

    if (error) {
      return NextResponse.json({ error: "Erreur du bot" }, { status: 500 });
    }

    // 3. Enregistrer le message du bot
    const saveMessage = await prisma.message.create({
      data: {
        chatId,
        sender: "assistant",
        text: botText,
        userId: user.id, // id réel ici
      },
    });

    return NextResponse.json({ text: saveMessage.text });
  } catch (error) {
    console.error("Erreur dans l'envoi du message :", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du message:" }, { status: 500 });
  }
}
