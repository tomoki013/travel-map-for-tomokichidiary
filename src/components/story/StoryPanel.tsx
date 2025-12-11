"use client";

import { Trip, Spot } from "@/types/data";
import { StorySection } from "./StorySection";

interface StoryPanelProps {
  trip: Trip;
  spots: Spot[];
  activeSpotId: string | null;
  onSpotChange: (spotId: string) => void;
}

export function StoryPanel({ trip, spots, activeSpotId, onSpotChange }: StoryPanelProps) {
  // Filter spots that belong to this trip, maintaining order
  const tripSpots = trip.spots
    .map((id) => spots.find((s) => s.id === id))
    .filter((s): s is Spot => s !== undefined);

  return (
    <div className="absolute top-0 right-0 w-full md:w-[40%] h-screen overflow-y-scroll snap-y snap-mandatory z-10 no-scrollbar pb-[50vh] pointer-events-auto">
      <div className="h-[50vh] flex flex-col items-center justify-center relative">
        <div className="bg-black/50 text-white p-6 rounded-xl backdrop-blur-sm text-center border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-serif mb-2">{trip.title}</h2>
          <p className="text-sm opacity-80 text-gray-300">Scroll to explore</p>
        </div>
        <div className="absolute bottom-10 animate-bounce text-white opacity-50">
          ↓
        </div>
      </div>
      
      {trip.itineraries ? (
        trip.itineraries.map((itinerary, index) => (
          <div key={index}>
             <div className="py-20 flex justify-center snap-start">
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-serif text-xl">
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

      <div className="h-[50vh]" />
    </div>
  );
}
