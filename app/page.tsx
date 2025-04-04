"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import getGreeting from "@/src/lib/greeting";
import { toast } from "sonner";
import axios from "axios";
import HomePageComponent from "@/src/components/custom/wrapper";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const message = getGreeting();
  const router = useRouter();
  const { user } = useUser();

  const handleClick = async () => {
    if (user && user.id) {
      const chat = await axios.post("/api/chat", {
        title: "Nouvelle discussion",
        messages: [
          {
            text: "Bonjour, comment puis-je vous aider ?",
            sender: "assistant",
          },
        ],
        userId: user?.id,
      });

      const res = await chat;

      if (res.status === 200) {
        router.push(`/c/${res.data.id}`);
      } else {
        toast.error("Erreur lors de la création de la discussion");
      }
    }
    if(!user) toast.error("veuillez vous connecté");
  };

  useEffect(() => {
    const insertUser = async () => {
      if (user && user.id) {
        console.log("Données utilisateur envoyées :", {
          userId: user.id,
          imageUrl: user.imageUrl,
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
        });

        const res = await axios.post("/api/user", {
          userId: user.id,
          imageUrl: user.imageUrl,
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
        });

        if (res.status === 200) {
          toast.success("Utilisateur inséré avec succès");
        }
        if (res.status === 400) {
          toast.error("L'utilisateur existe déjà");
        }
        if (res.status === 500) {
          toast.error(
            "Une erreur est survenue lors de l'insertion de l'utilisateur"
          );
        }
      }
    };
    insertUser();
  }, [user]);

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
