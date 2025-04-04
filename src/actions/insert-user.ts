"use server"
import prisma from "@/src/lib/prisma";




export async function insertUserInDatabase(userId: string,imageUrl: string, name: string, email: string, ) {

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (existingUser) {
      console.log("User already exists:", existingUser);
      
      return {
        error: "L'utilisateur existe déjà",
        user: existingUser,
      }
    }
    // Insérer l'utilisateur dans la base de données
    // const insert = await prisma.user.create({
    //   data: {
    //     id: userId,
    //     imageUrl: imageUrl,
    //     name: name,
    //     email: email,
    //   },
    // })
    // return {
    //   message: "Utilisateur inséré avec succès",
    //   user: insert,
    // }
  } catch (error:any) {
    return {
      error: "Une erreur est survenue lors de l'insertion de l'utilisateur",
      message: error.message,
    }
  }
}