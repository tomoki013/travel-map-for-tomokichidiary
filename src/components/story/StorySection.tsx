"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Spot } from "@/types/data";

interface StorySectionProps {
  spot: Spot;
  isActive: boolean;
  onActivate: (spotId: string) => void;
}

export function StorySection({ spot, isActive, onActivate }: StorySectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      onActivate(spot.id);
    }
  }, [inView, spot.id, onActivate]);

  return (
    <div
      ref={ref}
      className="h-screen flex items-center justify-center p-6 snap-start"
    >
      <div
        className={`bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl transition-all duration-500 border border-white/10 max-w-md ${
          isActive
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-40 translate-y-10 scale-95"
        }`}
      >
        <h3 className="font-serif text-2xl font-bold mb-3 text-white">{spot.name}</h3>
        <p className="text-gray-200 leading-relaxed font-sans">{spot.description}</p>
        <div className="mt-4 text-xs text-gray-500 font-mono">
          Lat: {spot.coordinates[1].toFixed(4)} / Lng: {spot.coordinates[0].toFixed(4)}
        </div>
      </div>
    </div>
  );
}
