"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { HomeIcon, LucideIcon, MenuIcon } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { createUser } from "@/src/actions/user";
import { toast } from "sonner";
import { UserInfos } from "@/src/utils/user-info";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
const MENU_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
];

const { user } = UserInfos;

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

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-screen ">
      <div className="relative flex flex-col w-full h-full mx-auto">
        <header className="fixed z-50 w-full ">
          <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <Link href={"/"} className="text-xl font-semibold">
              LumiRexChat
            </Link>
            <nav className="">
              <ul className="hidden md:flex space-x-4">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center p-2 rounded-lg"
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </ul>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <MenuIcon className="w-6 h-6 text-white cursor-pointer" />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>LumiRexChat</SheetTitle>
                      <SheetDescription>
                        Une IA au service de votre avenir
                      </SheetDescription>
                    </SheetHeader>
                    <div className="p-4 flex flex-col gap-4">
                      {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                          >
                            <Icon className="w-5 h-5 mr-2" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </nav>
          </div>
        </header>
        <div className="flex-grow  pt-15">{children}</div>
      </div>
    </div>
  );
}
