import Link from "next/link";
import React from "react";
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
