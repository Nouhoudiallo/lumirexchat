"use client"
import React from "react";
import { Chat } from "@prisma/client";
// Removed unused axios import
import { Loader2, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import NavBarComponent from "@/src/components/custom/navbar-component";
import { deleteChat, getUser, userChat } from "@/src/actions/user";
import { toast } from "sonner";
import { redirect, useRouter} from "next/navigation";
import { getCookieValue } from "@/src/actions/cookie";

export default function ChatHistoriePage() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter()
  
      
  React.useEffect(() => {
    async function fetchChats(userId: string) {
        const userInfos = await getUser(userId);
        try {
          if (userInfos) {
            const chat = await userChat(userInfos.id);
            if (chat.message !== "Les chats de l'utilisateur") {
              toast.error("Erreur lors du chargement des chats");
              throw new Error("Erreur lors du chargement des chats");
            }
            setChats(chat.allChat || []);
            setLoading(false);
          }
        } catch (error) {
          console.error("Erreur:", error);
          setLoading(false);
          toast.error("Erreur lors du chargement des chats");
        } finally {
          setLoading(false);
        }

      if(!userInfos) redirect("/");
    }
    getCookieValue("lumicharUser").then((cookieValue) => {
      if (!cookieValue) redirect("/")

      if(cookieValue) fetchChats(cookieValue);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Fonction pour formater la date
  const getFormattedDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd’hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    }
  };

  // Organiser les chats par date (Aujourd’hui, Hier, ou une date complète)
  const chatsByDate: Record<string, Chat[]> = chats.reduce((acc, chat) => {
    const formattedDate = getFormattedDate(new Date(chat.createdAt));
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);

  return (
    <div className="w-full mx-auto p-6 rounded-lg shadow-lg">
      <NavBarComponent />
      <h1 className="text-3xl font-bold text-white mb-6">
        📜 Historique des Chats
      </h1>
      {Object.keys(chatsByDate).length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-400">Aucun chat trouvé.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(chatsByDate).map(([date, chatList]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-3 text-blue-400">
                {date}
              </h2>
              <ul className="space-y-3">
                {chatList.map((chat) => (
                  <li
                    key={chat.id}
                    className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg shadow hover:bg-zinc-800 transition cursor-pointer"
                  >
                    <Link
                      href={`/c/${chat.id}`}
                      className="flex items-center w-full"
                    >
                      <MessageCircle className="text-blue-400 w-6 h-6 mr-3" />

                      <h2 className="text-md font-semibold text-white truncate w-60">
                        {chat.title}
                      </h2>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        deleteChat(chat.id, "/c");
                        router.refresh();
                        router.push("/c");
                        toast.success("Le chat a été supprimé avec succès");
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
