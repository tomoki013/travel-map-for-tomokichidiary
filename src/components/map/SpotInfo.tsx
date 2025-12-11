import { Spot } from "@/types/data";
import { X } from "lucide-react";

interface SpotInfoProps {
  spot: Spot;
  onClose: () => void;
}

export function SpotInfo({ spot, onClose }: SpotInfoProps) {
  return (
    <div className="absolute bottom-8 right-8 z-20 w-80 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto">
      <div className="relative h-48 bg-gray-800">
        {spot.imageUrl ? (
          <img 
            src={spot.imageUrl} 
            alt={spot.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900">
            No Image
          </div>
        )}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-serif text-white mb-2">{spot.name}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{spot.description}</p>
        
        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2 text-xs text-blue-300">
          <span>{spot.coordinates[1].toFixed(4)}° N</span>
          <span>{spot.coordinates[0].toFixed(4)}° E</span>
        </div>
      </div>
    </div>
  );
}
