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
import { MobileOverlay } from "@/components/mobile/MobileOverlay";

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
    setSelectedTripId,
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
    <>
      <Suspense fallback={null}>
        <UrlInitializer />
      </Suspense>

      {/* --- DESKTOP UI (Hidden on Mobile) --- */}
      <div className="hidden md:block relative w-full h-full min-h-screen overflow-hidden text-white pointer-events-none">
        <Header />

        {/* Back Button for Region Mode */}
        {viewMode === "region" &&
          (selectedCountryId || selectedRegionId || activeSpotId) && (
            <button
              onClick={handleBack}
              className="pointer-events-auto absolute top-24 left-8 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

        {/* Trip Selection & Story Panel */}
        {viewMode === "trip" &&
          (selectedTripId && currentTrip ? (
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
            <div className="pointer-events-auto absolute top-0 right-0 left-auto w-[40%] h-full bg-black/80 backdrop-blur p-10 flex flex-col gap-6 pt-32 z-10 overflow-y-auto border-l border-white/20">
              <h2 className="text-3xl font-serif">Select a Trip</h2>
              <div className="grid gap-4">
                {Object.values(MOCK_TRIPS).map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleTripSelect(trip.id)}
                    className="group cursor-pointer border border-white/10 rounded-xl overflow-hidden hover:border-white/40 transition-all bg-black/40 block"
                  >
                    <div className="h-32 w-full bg-gray-800 relative shrink-0">
                      {/* Thumbnail placeholder */}
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
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-medium group-hover:text-blue-400 transition-colors">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {trip.date} • {trip.spots.length} spots
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* Region View: Spot Info */}
        {viewMode === "region" && activeSpotId && MOCK_SPOTS[activeSpotId] && (
          <SpotInfo
            spot={MOCK_SPOTS[activeSpotId]}
            onClose={() => setActiveSpotId(null)}
          />
        )}

        {/* ModeToggle has internal pointer-events-auto */}
        <ModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* --- MOBILE UI (Hidden on Desktop) --- */}
      <div className="md:hidden relative w-full h-screen text-white pointer-events-none">
        <MobileOverlay />
      </div>
    </>
  );
}
