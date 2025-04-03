import prisma from "@/src/lib/prisma";
export async function GET(req: Request) {
  try {
    const allChat = await prisma.chat.findMany({
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return new Response(JSON.stringify({ allChat }), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des chats:", error);
    return new Response("Erreur lors de la récupération des chats", { status: 500 });
  }
}