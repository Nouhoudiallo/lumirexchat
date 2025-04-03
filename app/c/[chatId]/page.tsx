"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import ChatInputField from "@/src/components/custom/sender-input";

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const req = await axios.get(`/api/chat/${chatId}`);
        console.log("Données reçues :", req.data); // Vérifiez la structure ici
        setMessages(req.data.allChat?.[0]?.messages || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        toast.error("Impossible de charger les messages.");
      } finally {
        setLoading(false);
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Ajouter un message temporaire pour l'utilisateur
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Ajouter un message temporaire pour le bot
    const botPlaceholder = { sender: "bot", text: "Le bot est en train de répondre..." };
    setMessages((prev) => [...prev, botPlaceholder]);

    try {
      // Envoyer le message de l'utilisateur
      toast.info("chatId", { description: chatId });
      console.log("chatId:", chatId);
      
      const { data: messageResponse } = await axios.post(`/api/chat/${chatId}`, {
        sender: "user",
        text: input,
      });

      console.log("Message envoyé:", messageResponse);
      

      // Envoyer à n8n pour générer la réponse du bot
      const postData = await axios.post("/api/chatCompletion", {
        chatId,
        text: input,
      });
      console.log("Réponse du bot:", postData.data);
      const botData = postData.data;

      if (botData.error || !botData.text) {
        console.log("Erreur dans la réponse du bot:", botData.error);
        
        toast.error("Erreur lors de l'envoi du message ou réponse vide.");
        setMessages((prev) => prev.slice(0, -1)); // Supprimer le placeholder du bot
        return;
      }

      // Remplacer le placeholder par la réponse réelle du bot
      const botMessage = { sender: "bot", text: botData.text };
      setMessages((prev) => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message.");
      setMessages((prev) => prev.slice(0, -1)); // Supprimer le placeholder du bot
    }
  };

  return (
    <section className="flex flex-col h-screen bg-zinc-800">
      {/* Zone de messages */}
      <div className="flex-grow flex flex-col items-center w-full p-4 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col w-full max-w-[900px] space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-zinc-900 text-white max-w-[75%]"
                      : " text-white max-w-full"
                  }`}
                >
                  <div className="break-words">
                    {message.text === "Le bot est en train de répondre..." ? (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                      </span>
                    ) : (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Aucun message pour l'instant...</p>
          )}
        </div>
      </div>

      {/* Zone d'entrée */}
      <ChatInputField
        className="flex items-center justify-center py-2"
        inputProps={{
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && sendMessage(),
        }}
        buttonProps={{ onClick: sendMessage }}
      />
    </section>
  );
}