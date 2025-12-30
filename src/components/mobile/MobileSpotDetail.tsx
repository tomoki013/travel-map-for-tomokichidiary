"use client";

import { Spot } from "@/types/data";
import { X, ExternalLink } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

interface MobileSpotDetailProps {
  spot: Spot;
  onClose: () => void;
}

export function MobileSpotDetail({ spot, onClose }: MobileSpotDetailProps) {
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex justify-between items-start mb-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 py-2">
        <h2 className="text-xl font-serif pr-8 leading-tight">{spot.name}</h2>
        <div className="flex gap-2">
          <ShareButton className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" />
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4 shrink-0">
        {spot.imageUrl ? (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-4 pb-20">
        <p className="text-sm leading-relaxed text-gray-200">
          {spot.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-blue-300 pt-4 border-t border-white/10">
          <div>
            <span className="block text-gray-500">Latitude</span>
            {spot.coordinates[1].toFixed(5)}° N
          </div>
          <div>
            <span className="block text-gray-500">Longitude</span>
            {spot.coordinates[0].toFixed(5)}° E
          </div>
        </div>

        {/* Example Action Buttons */}
        <div className="pt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
                <ExternalLink size={14} />
                Google Maps
            </button>
             {/* Future: Add more actions like "Add to Plan" etc. */}
        </div>
      </div>
    </div>
  );
}
