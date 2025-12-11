"use client";

import { Map as MapIcon, BookOpen } from "lucide-react";

interface ModeToggleProps {
  mode: "region" | "trip";
  onChange: (mode: "region" | "trip") => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex bg-black/80 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/20 pointer-events-auto">
      <button
        onClick={() => onChange("region")}
        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium ${
          mode === "region"
            ? "bg-white text-black shadow-md"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        <MapIcon size={16} />
        By Region
      </button>
      <button
        onClick={() => onChange("trip")}
        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium ${
          mode === "trip"
            ? "bg-white text-black shadow-md"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        <BookOpen size={16} />
        By Trip
      </button>
    </div>
  );
}
