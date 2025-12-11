"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/ui/Header";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { StoryPanel } from "@/components/story/StoryPanel";
import { MOCK_SPOTS, MOCK_TRIPS, MOCK_REGIONS, MOCK_COUNTRIES } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";

const Globe = dynamic(() => import("@/components/map/Globe").then((mod) => mod.Globe), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black/90" />,
});

export default function Home() {
  const [viewMode, setViewMode] = useState<"region" | "trip">("region");
  
  // Region Mode State
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);

  // Trip Mode State
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Derived Data
  const currentTrip = selectedTripId ? MOCK_TRIPS[selectedTripId] : null;

  const handleBack = () => {
    if (activeSpotId) {
      setActiveSpotId(null);
    } else if (selectedRegionId) {
      setSelectedRegionId(null);
    } else if (selectedCountryId) {
      setSelectedCountryId(null);
    }
  };

  const handleTripSelect = (tripId: string) => {
    setSelectedTripId(tripId);
    setActiveSpotId(null);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden text-white">
      <Header />
      
      <Globe 
        viewMode={viewMode}
        
        // Data
        spots={Object.values(MOCK_SPOTS)}
        regions={Object.values(MOCK_REGIONS)}
        countries={Object.values(MOCK_COUNTRIES)}
        
        // State
        selectedCountryId={selectedCountryId}
        selectedRegionId={selectedRegionId}
        activeSpotId={activeSpotId}
        selectedTrip={currentTrip}
        
        // Handlers
        onCountrySelect={setSelectedCountryId}
        onRegionSelect={setSelectedRegionId}
        onSpotSelect={setActiveSpotId}
      />
      
      {/* Back Button for Region Mode */}
      {viewMode === "region" && (selectedCountryId || selectedRegionId || activeSpotId) && (
        <button 
          onClick={handleBack}
          className="absolute top-24 left-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      {/* Trip Selection & Story Panel */}
      {viewMode === "trip" && (
        selectedTripId && currentTrip ? (
          <>
            <button 
              onClick={() => setSelectedTripId(null)}
              className="absolute top-24 left-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>All Trips</span>
            </button>
            <StoryPanel
              trip={currentTrip}
              spots={Object.values(MOCK_SPOTS)}
              activeSpotId={activeSpotId}
              onSpotChange={setActiveSpotId}
            />
          </>
        ) : (
          <div className="absolute top-0 right-0 w-full md:w-[40%] h-full bg-black/80 backdrop-blur p-10 flex flex-col gap-6 pt-32 z-10">
            <h2 className="text-3xl font-serif">Select a Trip</h2>
            <div className="grid gap-4">
              {Object.values(MOCK_TRIPS).map(trip => (
                <div 
                  key={trip.id}
                  onClick={() => handleTripSelect(trip.id)}
                  className="group cursor-pointer border border-white/10 rounded-xl overflow-hidden hover:border-white/40 transition-all bg-black/40"
                >
                  <div className="h-32 bg-gray-800 relative">
                     {/* Thumbnail placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                       {trip.thumbnail ? <img src={trip.thumbnail} alt={trip.title} className="w-full h-full object-cover" /> : "No Image"}
                     </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-medium group-hover:text-blue-400 transition-colors">{trip.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{trip.date} • {trip.spots.length} spots</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <ModeToggle 
        mode={viewMode} 
        onChange={(mode) => {
          setViewMode(mode);
          // Clear all selection state on mode switch including trips
          setSelectedCountryId(null);
          setSelectedRegionId(null);
          setActiveSpotId(null);
          setSelectedTripId(null);
        }} 
      />
    </main>
  );
}
