"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import getGreeting from "@/src/lib/greeting";
import { toast } from "sonner";
import axios from "axios";
import HomePageComponent from "@/src/components/custom/wrapper";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser } from "@/src/actions/user";
import Wrapper from "@/src/components/custom/wrapper";

export default function Page() {
  const message = getGreeting();
  const router = useRouter();
  const { user } =  useUser();

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

      if (user) {
        const userInfo = await createUser(
          user.id,
          user.imageUrl,
          user.fullName || "",
          user.emailAddresses[0].emailAddress
        );

        if(userInfo.message === "Utilisateur inséré avec succès") {
          toast.success(userInfo.message);
        }
      } else {
        toast.error("Certaines informations utilisateur sont manquantes");
      }
    };
   
    insertUser();
  }, [user]);

  return (
    <Wrapper>
      <div className="flex flex-col h-full w-full justify-center items-center gap-4">
        <h2 className="text-2xl md:text-3xl text-center">{message}</h2>
        <Button size={"lg"} className="cursor-pointer" onClick={handleClick}>
          Lancer une Discussion
        </Button>
      </div>
    </Wrapper>
  );
}
