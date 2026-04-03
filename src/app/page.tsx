"use client";

import Image from "next/image";
import { Header } from "@/components/ui/Header";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { StoryPanel } from "@/components/story/StoryPanel";
import { SpotInfo } from "@/components/map/SpotInfo";
import { ArrowLeft } from "lucide-react";
import { useMapContext } from "@/contexts/MapContext";
import { Suspense } from "react";
import { UrlInitializer } from "@/components/ui/UrlInitializer";
import {
  getRegionState,
  getSpotById,
  getTripById,
  getTripSpots,
  getTripsSortedByDate,
} from "@/data/selectors";
import { MobileOverlay } from "@/components/mobile/MobileOverlay";

export default function Home() {
  const {
    viewMode,
    setViewMode,
    selectedCountryId,
    selectedRegionId,
    activeSpotId,
    setActiveSpotId,
    selectedTripId,
    setSelectedTripId,
    goBack,
  } = useMapContext();

  const currentTrip = getTripById(selectedTripId);
  const activeSpot = getSpotById(activeSpotId);
  const selectedRegionState = selectedRegionId
    ? getRegionState(selectedRegionId)
    : null;

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
              onClick={goBack}
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
                spots={getTripSpots(currentTrip)}
                activeSpotId={activeSpotId}
                onSpotChange={setActiveSpotId}
                onClose={() => setSelectedTripId(null)}
              />
            </>
          ) : (
            <div className="pointer-events-auto absolute top-0 right-0 left-auto w-[40%] h-full bg-black/80 backdrop-blur p-10 flex flex-col gap-6 pt-32 z-10 overflow-y-auto border-l border-white/20">
              <h2 className="text-3xl font-serif">Select a Trip</h2>
              <div className="grid gap-4">
                {getTripsSortedByDate().map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => handleTripSelect(trip.id)}
                    className="group cursor-pointer border border-white/10 rounded-xl overflow-hidden hover:border-white/40 transition-all bg-black/40 block"
                  >
                    <div className="h-32 w-full bg-gray-800 relative shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        {trip.thumbnail ? (
                          <Image
                            src={trip.thumbnail}
                            alt={trip.title}
                            fill
                            sizes="40vw"
                            className="object-cover"
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

        {viewMode === "region" &&
          selectedRegionState &&
          !selectedRegionState.isReady &&
          !activeSpot && (
            <div className="pointer-events-auto fixed bottom-0 left-0 w-full rounded-t-3xl border-t border-white/20 bg-black/80 p-6 backdrop-blur md:absolute md:bottom-8 md:right-8 md:left-auto md:w-96 md:rounded-2xl md:border md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-300">
                Coming Soon
              </p>
              <h2 className="mt-3 text-2xl font-serif text-white">
                {selectedRegionState.region.name}
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-300">
                {selectedRegionState.country?.name} のこの地域は、地図上の詳細スポットを準備中です。
                先にほかの地域や Trip モードを見られる状態は維持します。
              </p>
            </div>
          )}

        {viewMode === "region" && activeSpot && (
          <SpotInfo spot={activeSpot} onClose={() => setActiveSpotId(null)} />
        )}

        <ModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* --- MOBILE UI (Hidden on Desktop) --- */}
      <div className="md:hidden relative w-full h-[100dvh] text-white pointer-events-none">
        <MobileOverlay />
      </div>
    </>
  );
}
