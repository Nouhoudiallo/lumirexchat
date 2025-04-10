import type React from "react"

import { useState, useRef, useEffect } from "react"
import { PlusCircle, Search, MoreHorizontal, Mic } from "lucide-react"
import ChatMessage from "./chat-message"
import { Button } from "@/src/components/ui/button"

interface Message {
  id: string;
  role: "user" | "assistant"
  content: string;
  createdAt: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Introduction (version optimisée) :

L'indépendance des pays africains, obtenue au prix de luttes acharnées, portait en elle l'espoir d'une ère nouvelle, libérée de toute domination étrangère. Pourtant, cet espoir a parfois laissé place à une grande désillusion : certains dirigeants issus de cette libération se sont comportés en véritables oppresseurs.

En somme, le pire pour l'Afrique serait que la fin du colonialisme débouche sur une domination intérieure encore plus brutale, exercée par ses propres fils.

Cette situation soulève une question essentielle : la libération a-t-elle vraiment un sens si elle conduit à une nouvelle forme d'asservissement interne ?

Pour y répondre, nous verrons d'abord comment certains dirigeants ont trahi les idéaux de l'indépendance, puis en quoi cette oppression venue de l'intérieur peut s'avérer encore plus destructrice que celle des anciens colons.`,
      id: "",
      createdAt: ""
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    // Add user message
    setMessages([...messages, {
      role: "user", content: input,
      id: "",
      createdAt: ""
    }])

    // Clear input
    setInput("")

    // Simulate AI response (in a real app, you would call an API here)
    setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Je suis une simulation de réponse. Dans une implémentation réelle, cette réponse viendrait d'une API comme celle d'OpenAI.",
              id: `${Date.now()}`, // Generate a unique ID
              createdAt: new Date().toISOString(), // Add a timestamp
            },
          ])
        }, 1000)
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto">
        
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-gray-700 p-4 bg-[#343541]">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="flex items-center bg-[#40414f] rounded-lg border border-gray-600 shadow-lg">
            <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
              <PlusCircle size={20} />
            </Button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Poser une question"
              className="flex-1 bg-transparent border-none focus:outline-none text-white p-3"
            />

            <div className="flex items-center gap-1 px-2">
              <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                <Search size={20} />
              </Button>
              <span className="text-xs text-gray-500 mx-1">Rechercher</span>

              <div className="h-6 w-px bg-gray-700 mx-1"></div>

              <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">Raisonner</span>
                </div>
              </Button>

              <div className="h-6 w-px bg-gray-700 mx-1"></div>

              <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                <MoreHorizontal size={20} />
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 bg-[#343541] rounded-full p-2"
          >
            <Mic size={20} />
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500 mt-2">
          ChatGPT peut faire des erreurs. Vérifiez les informations importantes.
        </div>
      </div>
    </div>
  )
}
