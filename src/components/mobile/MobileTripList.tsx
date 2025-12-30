"use client";

import { Trip } from "@/types/data";

interface MobileTripListProps {
  trips: Trip[];
  onSelect: (tripId: string) => void;
}

export function MobileTripList({ trips, onSelect }: MobileTripListProps) {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <h2 className="text-xl font-serif text-white sticky top-0 bg-black/80 backdrop-blur-md py-2 z-10">
        All Trips
      </h2>
      {trips.map((trip) => (
        <div
          key={trip.id}
          onClick={() => onSelect(trip.id)}
          className="group cursor-pointer border border-white/10 rounded-xl overflow-hidden hover:border-white/40 transition-all bg-black/40 flex flex-col"
        >
          <div className="h-40 w-full bg-gray-800 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              {trip.thumbnail ? (
                <img
                  src={trip.thumbnail}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                "No Image"
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
              <h3 className="text-lg font-bold text-white leading-tight">
                {trip.title}
              </h3>
            </div>
          </div>
          <div className="p-3 flex justify-between items-center bg-white/5">
            <span className="text-xs text-gray-400">{trip.date}</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-blue-300">
              {trip.spots.length} Spots
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
