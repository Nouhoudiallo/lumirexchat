"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import ChatInputField from "@/src/components/custom/sender-input";
import { Loader } from "lucide-react";
import { ClipboardCopyIcon } from "lucide-react";
import NavBarComponent from "@/src/components/custom/navbar-component";

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

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
        const req = await axios.get(`/api/chat/${chatId}`);
        console.log("Données reçues :", req.data); // Vérifiez la structure ici
        setMessages(req.data.allChat?.[0]?.messages || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
        toast.error("Impossible de charger les messages.");
      } finally {
        setLoading(false);
        scrollToBottom(); // Défilement après le chargement des messages
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
    const botPlaceholder = {
      sender: "bot",
      text: "Le bot est en train de répondre...",
    };
    setMessages((prev) => [...prev, botPlaceholder]);
    scrollToBottom(); // Défilement après l'ajout des messages temporaires

    try {
      const { data: messageResponse } = await axios.post(
        `/api/chat/${chatId}`,
        {
          sender: "user",
          text: input,
        }
      );

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
      scrollToBottom(); // Défilement après la réponse du bot
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message.");
      setMessages((prev) => prev.slice(0, -1)); // Supprimer le placeholder du bot
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Message copié dans le presse-papiers !");
      })
      .catch(() => {
        toast.error("Échec de la copie du message.");
      });
  };

  useEffect(() => {
    scrollToBottom(); // Défilement chaque fois que les messages changent
  }, [messages]);

  return (
    <section className="flex flex-col h-screen bg-zinc-800">
      <NavBarComponent/>
      {/* Zone de messages */}
      <div className="flex-grow flex flex-col items-center w-full p-4 overflow-y-auto scrollbar-hide scroll-container">
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
                  className={`relative p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-zinc-900 text-white max-w-[75%]"
                      : " text-white max-w-full"
                  }`}
                >
                  <div className="break-words space-y-2 mb-3">
                    {message.text === "Le bot est en train de répondre..." ? (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                      </span>
                    ) : (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                  </div>
                  {/* Bouton de copie en dessous */}
                  {message.text !== "Le bot est en train de répondre..." && (
                    <div className=" flex justify-end mt-6 ">
                      <button
                        onClick={() => copyToClipboard(message.text)}
                        className="text-gray-400 hover:text-gray-200 cursor-pointer"
                        aria-label="Copier le message"
                      >
                        <ClipboardCopyIcon size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Loader
                className="animate-spin text-gray-400"
                size={24}
                strokeWidth={2}
                color="currentColor"
                aria-label="Loading messages..."
              />
            </div>
          )}
          {/* Élément pour le défilement */}
          <div ref={messagesEndRef} />
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
