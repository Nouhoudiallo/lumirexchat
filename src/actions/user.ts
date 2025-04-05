"use server"
import { cookies } from "next/headers"
import prisma from "../lib/prisma"
import { revalidatePath } from "next/cache"

export const getUser = async (userId: string) => {
  const replace = userId.replace(/"/g, "")
  const user = await prisma.user.findUnique({
    where: {
      clerUserId: replace,
    }
  })
  
  return user
}

export const createUser = async (userId: string, imageUrl: string, name: string, email: string) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: {
      clerUserId: userId as string,
      email: email as string,
    },
  });

  if (existingUser) {
    // faire mon propre cookie
    const cookie = await cookies();
    const userCookie = cookie.set("lumicharUser", JSON.stringify(existingUser.clerUserId), {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), // 3 jours

    })
    return {
      message: "L'utilisateur existe déjà",
      user: existingUser,
    };
  }

  // Insérer l'utilisateur dans la base de données
  const insert = await prisma.user.create({
    data: {
      imageUrl: imageUrl as string,
      name: name as string,
      email: email as string,
      clerUserId: userId as string,
    },
  });
  const cookie = await cookies();
    const userCookie = cookie.set("lumicharUser", JSON.stringify(insert.clerUserId), {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 3 * 1000), // 3 jours
      
    })
  return {
    message: "Utilisateur inséré avec succès",
    user: insert,
  };
}

export const userChat = async (userId: string) => {
  const isExist = await prisma.user.findUnique({
    where: {
      // id de l'utilisateur
      id: userId as string,
    },
  })

  if(!isExist) {
    return {
      message: "L'utilisateur n'existe pas",
    }
  }
  const chat = await prisma.chat.findMany({
    where: {
      userId: userId as string,
    },
    orderBy: {
      createdAt: "desc",
    }
  })

  return{
    message: "Les chats de l'utilisateur",
    allChat: chat,
  }
}

export const deleteChat = async (chatId: string, path?: string) => {
  // Supprimer les messages associés au chat
  await prisma.message.deleteMany({
    where: {
      chatId: chatId as string,
    },
  });

  // Supprimer le chat
  const chat = await prisma.chat.delete({
    where: {
      id: chatId as string,
    },
  });

  if(path) revalidatePath(path)

  return {
    message: "Le chat a été supprimé avec succès",
    chat: chat,
  };
};