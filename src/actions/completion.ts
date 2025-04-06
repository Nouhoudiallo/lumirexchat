"use server"

import axios from "axios";
import prisma from "../lib/prisma";

export const ChatCompletion = async (text: string, chatId: string, userId: string) => {
  try {
    // 1. Identifier l'utilisateur réel par son clerUserId
    const user = await prisma.user.findUnique({
      where: {
        clerUserId: userId,
      },
    });

    if (!user) {
      return {
        error: `Utilisateur non trouvé id: ${userId}`,
        status: 404,
      }
    }
    // 2. Envoyer à n8n pour générer la réponse du bot
    const { data: botData } = await axios.post(
      "https://n8n-doc.onrender.com/webhook/lumirexai",
      {
        chatId,
        text,
      }
    );
    
    const { error, output: botText } = botData;
    if (error) {
      return {
        error: "Erreur du bot",
        status: 500,
      }
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
    

    return {
      text: saveMessage.text,
      status: 200,
    }

  } catch (error:any) {
    return {
      error: "Erreur lors de l'envoi du message:",
      status: 500,
      message: error.message,
    }
  }
}

export const SaveUserMessage = async (text: string, chatId: string, sender: string) => {
  
  if(!chatId){
    return {
      error: "chatId manquant",
      status: 400,
    }
  }

  try {

    if(!text && !sender){
      return {
        error: "message vide",
        status: 400,
      }
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return {
        error: "Chat non trouvé",
        status: 404,
      }
    }
    const message = await prisma.message.create({
      data: {
        text,
        sender: sender,
        chatId: chat.id,
        userId: chat.userId,
      }
    });
    return {
      text: message.text,
      status: 201,
    }

  } catch (error:any) {
    return {
      error: "Erreur lors de l'envoi du message:",
      status: 500,
      message: error.message
    }
  }
}