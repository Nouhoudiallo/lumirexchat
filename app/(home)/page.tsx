'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import getGreeting from "@/src/lib/greeting";
import { toast } from "sonner";
import axios from "axios";
import HomePageComponent from "@/src/components/custom/wrapper";

export default function Page() {
  const message = getGreeting();
  const router = useRouter();

  const handleClick = async () => {
    const chat = await axios.post("/api/chat", {
      title: "Nouvelle discussion",
      messages: [
        {
          text: "Bonjour, comment puis-je vous aider ?",
          sender: "assistant",
        },
      ],
    });

    const res = await chat;

    if (res.status === 200) {
      router.push(`/chat/${res.data.id}`);
    } else {
      toast.error("Erreur lors de la création de la discussion");
    }
  };

  return (
    <HomePageComponent>
      <div className="flex flex-col h-full w-full justify-center items-center gap-4">
        <h2 className="text-2xl md:text-3xl text-center">{message}</h2>
        <Button size={"lg"} className="cursor-pointer" onClick={handleClick}>
          Lancer une Discussion
        </Button>
      </div>
    </HomePageComponent>
  );
}