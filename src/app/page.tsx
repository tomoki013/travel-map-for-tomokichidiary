"use client";

import { Header } from "@/components/ui/Header";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { StoryPanel } from "@/components/story/StoryPanel";
import { SpotInfo } from "@/components/map/SpotInfo";
import { MOCK_SPOTS, MOCK_TRIPS } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { useMapContext } from "@/contexts/MapContext";
import { Suspense } from "react";
import { UrlInitializer } from "@/components/ui/UrlInitializer";

export default function Home() {
  const { 
    viewMode, 
    setViewMode,
    selectedCountryId, 
    setSelectedCountryId,
    selectedRegionId, 
    setSelectedRegionId,
    activeSpotId,
    setActiveSpotId,
    selectedTripId,
    setSelectedTripId
  } = useMapContext();

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
    <div className="relative w-full h-full min-h-screen overflow-hidden text-white flex flex-col pointer-events-none">
      <Suspense fallback={null}>
        <UrlInitializer />
      </Suspense>
      <Header />
      
      {/* Back Button for Region Mode */}
      {viewMode === "region" && (selectedCountryId || selectedRegionId || activeSpotId) && (
        <button 
          onClick={handleBack}
          className="pointer-events-auto absolute top-20 left-4 md:top-24 md:left-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      )}

      {/* Trip Selection & Story Panel */}
      {viewMode === "trip" && (
        selectedTripId && currentTrip ? (
          <>
            <StoryPanel
                trip={currentTrip}
                spots={Object.values(MOCK_SPOTS)}
                activeSpotId={activeSpotId}
                onSpotChange={setActiveSpotId}
                onClose={() => setSelectedTripId(null)}
            />
          </>
        ) : (
          <div className="pointer-events-auto fixed bottom-0 left-0 w-full h-[45vh] md:absolute md:top-0 md:right-0 md:left-auto md:w-[40%] md:h-full bg-black/80 backdrop-blur p-6 md:p-10 flex flex-col gap-6 pt-10 md:pt-32 z-10 overflow-y-auto rounded-t-3xl md:rounded-none border-t border-white/20 md:border-t-0 md:border-l">
            <h2 className="text-2xl md:text-3xl font-serif">Select a Trip</h2>
            <div className="grid gap-4">
              {Object.values(MOCK_TRIPS).map(trip => (
                <div 
                  key={trip.id}
                  onClick={() => handleTripSelect(trip.id)}
                  className="group cursor-pointer border border-white/10 rounded-xl overflow-hidden hover:border-white/40 transition-all bg-black/40 flex md:block" // Horizontal card on active mobile list? Or kept as stack. Stack is fine for 50vh list.
                >
                  <div className="h-24 w-24 md:h-32 md:w-full bg-gray-800 relative shrink-0">
                     {/* Thumbnail placeholder */}
                     <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                       {trip.thumbnail ? <img src={trip.thumbnail} alt={trip.title} className="w-full h-full object-cover" /> : "No Image"}
                     </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-lg md:text-xl font-medium group-hover:text-blue-400 transition-colors">{trip.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">{trip.date} • {trip.spots.length} spots</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Region View: Spot Info */}
      {viewMode === "region" && activeSpotId && MOCK_SPOTS[activeSpotId] && (
        <SpotInfo 
          spot={MOCK_SPOTS[activeSpotId]} 
          onClose={() => setActiveSpotId(null)} 
        />
      )}

      {/* ModeToggle has internal pointer-events-auto */}
      <ModeToggle 
        mode={viewMode} 
        onChange={setViewMode} 
      />
    </div>
  );
}
