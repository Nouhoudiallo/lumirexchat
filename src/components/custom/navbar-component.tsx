"use client";
import Link from "next/link";
import React from "react";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const NavBarComponent = () => {
  return (
      <div className="sticky top-0 flex justify-between h-14 shrink-0 items-center gap-2 bg-zinc-800 border-b border-zinc-700 z-50 px-4">
        <Link href="/">Acueil</Link>
        <div className="flex items-center gap-2 pr-4">
          <img
            src="/window.svg"
            alt="User profile"
            className="h-8 w-8 rounded-full"
          />
          <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          <Menu/>
        </div>
      </div>
  );
};

export default NavBarComponent;
