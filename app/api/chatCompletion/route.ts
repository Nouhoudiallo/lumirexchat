import prisma from "@/src/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { chatId, text } = await request.json();

  try {
    // Envoyer à n8n pour générer la réponse du bot
    const { data: botData } = await axios.post(
      "https://n8n-doc.onrender.com/webhook/lumichat",
      {
        chatId,
        text,
      }
    );
    
    const { error, output: botText } = botData;
    const saveMessage = await prisma.message.create({
      data: {
        chatId,
        sender: "assistant",
        text: botText,
      },
    });

    return NextResponse.json({ text: saveMessage.text });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" });
  }
}