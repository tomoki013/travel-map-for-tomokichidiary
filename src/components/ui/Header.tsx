"use client";

import Link from "next/link";
import { useMapContext } from "@/contexts/MapContext";

import { ShareButton } from "./ShareButton";

export function Header() {
  const { viewMode } = useMapContext();
  
  return (
    <header className="absolute top-0 left-0 w-full z-20 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <Link href="/" className="font-serif text-xl md:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Tomokichi <span className="text-gray-400 font-light">Globe</span>
        </Link>
      </div>
      <nav 
        className={`pointer-events-auto flex gap-4 text-sm font-medium items-center transition-all duration-300 ${
          viewMode === 'trip' ? 'md:mr-[42%]' : ''
        }`}
      >
        <ShareButton 
          className="px-3 py-1.5 md:px-3 md:py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white" 
          variant="icon"
        />
        <a 
          href="https://travel.tomokichidiary.com/" 
          className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] text-xs md:text-sm"
        >
          <span>ともきちの旅行日記 →</span>
        </a>
      </nav>
    </header>
  );
}
