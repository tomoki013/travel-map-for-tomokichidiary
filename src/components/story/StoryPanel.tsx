"use client";

import { Trip, Spot } from "@/types/data";
import { StorySection } from "./StorySection";
import { ShareButton } from "../ui/ShareButton";

interface StoryPanelProps {
  trip: Trip;
  spots: Spot[];
  activeSpotId: string | null;
  onSpotChange: (spotId: string) => void;
  onClose: () => void;
}

export function StoryPanel({ trip, spots, activeSpotId, onSpotChange, onClose }: StoryPanelProps) {
  // Filter spots that belong to this trip, maintaining order
  const tripSpots = trip.spots
    .map((id) => spots.find((s) => s.id === id))
    .filter((s): s is Spot => s !== undefined);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[45vh] md:absolute md:top-0 md:right-0 md:left-auto md:w-[40%] md:h-screen overflow-y-scroll snap-y snap-mandatory z-10 no-scrollbar pb-[50vh] pointer-events-auto rounded-t-3xl md:rounded-none border-t border-white/20 md:border-t-0 md:border-l md:border-white/10 bg-black/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none transition-all duration-300">
      
      {/* All Trips Back Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-xs md:text-sm"
      >
        <span>← All Trips</span>
      </button>

      <div className="absolute top-4 right-4 z-50">
        <ShareButton 
          className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-white/10 text-white" 
        />
      </div>

      <div className="h-[45vh] md:h-[50vh] flex flex-col items-center justify-center relative snap-start">
        <div className="bg-black/50 text-white p-6 rounded-xl backdrop-blur-sm text-center border border-white/10 shadow-2xl mx-4 md:mx-0">
          <h2 className="text-2xl md:text-3xl font-serif mb-2">{trip.title}</h2>
          <p className="text-sm opacity-80 text-gray-300">Scroll to explore</p>
        </div>
        <div className="absolute bottom-10 animate-bounce text-white opacity-50">
          ↓
        </div>
      </div>
      
      {trip.itineraries ? (
        trip.itineraries.map((itinerary, index) => (
          <div key={index}>
             <div className="py-10 md:py-20 flex justify-center snap-start">
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-serif text-lg md:text-xl">
                 {itinerary.title}
               </div>
             </div>
             {itinerary.spots.map((spotId) => {
               const spot = spots.find(s => s.id === spotId);
               if (!spot) return null;
               return (
                 <StorySection
                    key={spot.id}
                    spot={spot}
                    isActive={activeSpotId === spot.id}
                    onActivate={onSpotChange}
                  />
               );
             })}
          </div>
        ))
      ) : (
        tripSpots.map((spot) => (
          <StorySection
            key={spot.id}
            spot={spot}
            isActive={activeSpotId === spot.id}
            onActivate={onSpotChange}
          />
        ))
      )}

      <div className="h-[45vh] md:h-[50vh]" />
    </div>
  );
}
