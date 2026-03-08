"use client";

import Image from "next/image";
import {
  SignedIn,
  UserButton,
} from '@clerk/nextjs'

import DarkLight from "@/components/DarkLight"
import { ThemeProvider } from "@/components/theme-provider"


export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white  shadow-sm px-6 py-4 flex justify-between items-center">
      <ThemeProvider>
      
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Image src="/Images/logo1.png" width={30} height={30} alt="logo1" />
        <Image src="/Images/logo2.png" width={90} height={90} alt="logo2" />
      </div> 
      
      
      {/* User Section */}
      <div className="flex items-center gap-3">

        <SignedIn>
          <UserButton />
        </SignedIn>
        
      </div>
      </ThemeProvider>
    </header>
  );
}
