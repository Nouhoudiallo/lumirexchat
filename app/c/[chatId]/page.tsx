"use client";

import { useState, useEffect, useRef } from "react";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";
import ChatLayout from "@/src/components/chat-layout";
import { useUser } from "@clerk/nextjs";
import { ChatCompletion, SaveUserMessage } from "@/src/actions/completion";
import { GetMessages } from "@/src/actions/user";
import { Message } from "@/types/chat";

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour la barre latérale
  const { user } = useUser();

  // Référence pour le défilement
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const req = await GetMessages(chatId);
        const fetchedMessages = req.allChat?.[0]?.messages || [];
        const formattedMessages: Message[] = fetchedMessages.map((msg: any) => ({
          id: msg.id || crypto.randomUUID(), // Génère un ID si absent
          role: msg.sender === "user" ? "user" : "assistant", // Assurez-vous que le rôle est correctement typé
          content: msg.text,
          createdAt: msg.createdAt || new Date().toISOString(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        toast.error("Impossible de charger les messages.");
      } finally {
        setLoading(false);
        scrollToBottom(); // Défilement après le chargement des messages
      }
    };

    if (!chatId) redirect("/");
    fetchMessages();
  }, [chatId]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Ajouter un message temporaire pour l'utilisateur
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user", // Typage correct pour le rôle
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Ajouter un message temporaire pour le bot
    const botPlaceholder: Message = {
      id: crypto.randomUUID(),
      role: "assistant", // Typage correct pour le rôle
      content: "Le bot est en train de répondre...",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botPlaceholder]);
    scrollToBottom(); // Défilement après l'ajout des messages temporaires

    try {
      const messageResponse = await SaveUserMessage(content, chatId, "user");
      if (messageResponse.error) {
        console.log("Erreur dans la réponse du bot:", messageResponse.error);
        toast.error("Erreur lors de l'envoi du message ou réponse vide.");
        setMessages((prev) => prev.slice(0, -1)); // Supprimer le placeholder du bot
        setMessages((prev) => prev.slice(0, -1)); // Supprimer le message de l'utilisateur
        return;
      }

      const postData = await ChatCompletion(content, chatId, user?.id as string);
      if (postData.error) {
        console.log("Erreur dans la réponse du bot:", postData.error);
        toast.error("Erreur lors de l'envoi du message ou réponse vide.");
        setMessages((prev) => prev.slice(0, -1)); // Supprimer le placeholder du bot
        setMessages((prev) => prev.slice(0, -1)); // Supprimer le message de l'utilisateur
        return;
      }
      const botData = postData.text || "Réponse indisponible.";

      // Remplacer le placeholder par la réponse réelle du bot
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant", // Typage correct pour le rôle
        content: botData,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev.slice(0, -1), botMessage]);
      scrollToBottom(); // Défilement après la réponse du bot
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message.");
      setMessages((prev) => prev.slice(0, -1)); // Supprimer le placeholder du bot
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <ChatLayout
      messages={messages}
      onSendMessage={sendMessage}
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
    />
  );
}
