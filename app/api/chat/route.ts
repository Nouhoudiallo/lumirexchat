import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Données reçues :", body);

  const { title, messages, userId } = body;

  if (!title || !messages || !userId) {
    return new Response("Données invalides", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerUserId: userId,
      },
    });

    if (!user) {
      return new Response("Utilisateur non trouvé", { status: 404 });
    }

    // Vérification que chaque message a un userId
    const formattedMessages = messages.map((msg: any) => ({
      ...msg,
      userId: user.id, // on attache explicitement le user
    }));

    const chat = await prisma.chat.create({
      data: {
        title,
        userId: user.id, // relation via FK directe
        messages: {
          create: formattedMessages,
        },
      },
      include: {
        messages: true, // utile pour avoir le chat avec les messages
      },
    });

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la création du chat:", error);
    return new Response("Erreur lors de la création du chat", { status: 500 });
  }
}
