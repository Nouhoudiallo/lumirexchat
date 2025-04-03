import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
  const { title, messages } = await req.json();
  if (!title || !messages) {
    return new Response("Données invalides", { status: 400 });
  }
  try {
    const chat = await prisma.chat.create({
      data: {
        title,
        messages: {
          create: messages,
        },
      },
    });
    
    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la création du chat:", error);
    return new Response("Erreur lors de la création du chat", { status: 500 });
  }
}