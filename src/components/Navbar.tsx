import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./SignInButton";

const Navbar = async () => {
  const session = await getAuthSession();
  
  return (
    // FIX: Changed "fixed" to "sticky" so it pushes content down naturally
    <div className="sticky inset-x-0 top-0 z-50 h-fit border-b border-zinc-200 bg-white/75 py-3 backdrop-blur-lg transition-all duration-300 animate-in fade-in slide-in-from-top-full dark:border-zinc-800 dark:bg-gray-950/75">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-8">
        
        {/* Logo */}
        <Link 
          href={"/"} 
          className="group flex items-center gap-2 duration-300 animate-in fade-in slide-in-from-left-8"
        >
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black bg-white px-2 py-1 text-xl font-bold transition-all duration-200 group-hover:translate-y-[2px] group-hover:border-b-2 group-hover:border-r-2 group-hover:shadow-sm md:block dark:border-white dark:bg-gray-950">
            Quizzzy
          </p>
        </Link>
        
        {/* Actions */}
        <div className="flex items-center gap-4 duration-500 animate-in fade-in slide-in-from-right-8">
          {/* <div className="transition-transform duration-300 hover:scale-110">
            <ThemeToggle className="mr-2" />
          </div> */}
          
          <div className="transition-all duration-300 hover:scale-105">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton text={"Sign In"} />
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;