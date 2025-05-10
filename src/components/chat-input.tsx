import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() === "") return;
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="rounded-3xl flex flex-col gap-2 p-3">
      <form
        className="w-full bg-zinc-700 rounded-3xl p-2"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Ajout de l'écouteur pour gérer Enter et Shift + Enter
          placeholder="Posez votre question ici..."
          className="w-full bg-transparent resize-none text-white placeholder:text-gray-400 rounded-3xl min-h-10 max-h-40 overflow-y-auto border-none focus:ring-0 focus-visible:ring-0"
        />
        <div className="flex justify-end mt-2">
          <Button
            type="submit"
            size="icon"
            className="bg-white text-black hover:opacity-80 rounded-full w-8 h-8"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-500 mt-1">
        LumiRexCHAT peut faire des erreurs. Vérifiez les informations
        importantes.
      </div>
    </div>
  );
}
