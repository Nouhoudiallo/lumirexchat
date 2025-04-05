import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, imageUrl, name, email } = body;
  console.log("userId", userId);
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    if (existingUser) {

      return NextResponse.json(
        {
          message: "L'utilisateur existe déjà",
          user: existingUser,
        },
        {
          status: 200,
        }
      );
    }

    
    
    // Insérer l'utilisateur dans la base de données
    const insert = await prisma.user.create({
      data:{
        imageUrl: imageUrl as string,
        name: name as string,
        email: email as string,
        clerUserId: userId as string
      }
    })
    return NextResponse.json(
      {
        message: "Utilisateur inséré avec succès",
        user: insert,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de l'insertion de l'utilisateur",
      },
      {
        status: 500,
      }
    );
  }
}
