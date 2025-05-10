"use client"

import { useEffect, useRef } from "react";
import type { Message } from "@/types/chat"
import ChatMessage from "./chat-message";

interface ChatAreaProps {
  messages: Message[];
}

export default function ChatArea({ messages }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Défilement automatique vers le bas lorsque les messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {/* Élément de fin pour le défilement */}
      <div ref={messagesEndRef} />
    </div>
  );
}
