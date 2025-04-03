"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  interface Chat {
    id: string;
    title: string;
  }
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const router = useRouter();

  // Récupérer tous les chats
  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
        setLoading(false);
      });
  }, []);

  // Créer un chat
  const createChat = async () => {
    if (!title.trim()) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newChat = await res.json();
    setChats([newChat, ...chats]); // Ajoute le chat en haut
    setTitle("");

    // Redirige vers le chat
    router.push(`/chat/${newChat.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Chats</h1>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Nouveau Chat"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createChat} className="bg-blue-500 text-white p-2 rounded">
          Créer
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul className="mt-4">
          {chats.map((chat) => (
            <li key={chat.id}>
              <a href={`/chat/${chat.id}`} className="block p-2 bg-gray-100 rounded mt-2">
                {chat.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}