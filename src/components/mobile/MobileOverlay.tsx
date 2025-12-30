"use client";

import { useEffect, useState } from "react";
import { useMapContext } from "@/contexts/MapContext";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { MobileTripList } from "./MobileTripList";
import { MobileSpotDetail } from "./MobileSpotDetail";
import { MobileRegionSelector } from "./MobileRegionSelector";
import { MOCK_TRIPS, MOCK_SPOTS, MOCK_COUNTRIES, MOCK_REGIONS } from "@/data/mockData";
import { Map, BookOpen, Layers, Play } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "../ui/ShareButton";

export function MobileOverlay() {
  const {
    viewMode,
    setViewMode,
    selectedTripId,
    setSelectedTripId,
    activeSpotId,
    setActiveSpotId,
    selectedCountryId,
    setSelectedCountryId,
    selectedRegionId,
    setSelectedRegionId,
  } = useMapContext();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Auto-open sheet when state changes that requires attention
  useEffect(() => {
    if (activeSpotId) {
      setIsSheetOpen(true);
    } else if (selectedTripId) {
       // When trip is selected, we might want to show the list of spots or just the trip overview?
       // Current MobileTripList just selects the trip ID on click.
       // Maybe we need a MobileTripDetail view? For now let's assume selecting a trip just zooms to it
       // and maybe we keep the sheet closed or partial to show "Trip Selected" info?
       // Let's keep it simple: If trip selected, maybe minimize to let user see map, unless they want details.
       setIsSheetOpen(false); // Let user explore map first
    } else if (selectedRegionId) {
       setIsSheetOpen(false);
    }
  }, [activeSpotId, selectedTripId, selectedRegionId]);

  // Determine Sheet Content
  const renderSheetContent = () => {
    // Determine context for navigation if a trip is selected
    let navigationProps = {};
    if (selectedTripId && MOCK_TRIPS[selectedTripId]) {
      const trip = MOCK_TRIPS[selectedTripId];
      // Flatten spots from trip
      const tripSpotIds = trip.itineraries
        ? trip.itineraries.flatMap((it) => it.spots)
        : trip.spots;

      const currentIndex = activeSpotId ? tripSpotIds.indexOf(activeSpotId) : -1;

      if (currentIndex !== -1) {
         navigationProps = {
             currentIndex,
             totalSpots: tripSpotIds.length,
             hasPrev: currentIndex > 0,
             hasNext: currentIndex < tripSpotIds.length - 1,
             onPrev: () => setActiveSpotId(tripSpotIds[currentIndex - 1]),
             onNext: () => setActiveSpotId(tripSpotIds[currentIndex + 1]),
         }
      }
    }

    if (activeSpotId && MOCK_SPOTS[activeSpotId]) {
      return (
        <MobileSpotDetail
          spot={MOCK_SPOTS[activeSpotId]}
          onClose={() => setActiveSpotId(null)}
          {...navigationProps}
        />
      );
    }

    if (viewMode === "trip") {
        // If a trip is actively selected and we are viewing it?
        // The current data model separates "Trip List" (no ID selected) vs "Trip Active" (ID selected).
        // However, user might want to go back to list.
        // For MVP, if trip is selected, we might want to show a "Trip Details" or "Stop List".
        // Re-using MobileTripList for now, but maybe filtered?
        // Actually, if a trip is selected, we should probably show a list of spots in that trip inside the sheet.
        // But let's stick to the Trip List for switching trips first.
        return (
            <MobileTripList
                trips={Object.values(MOCK_TRIPS)}
                onSelect={(id) => {
                    setSelectedTripId(id);
                    setIsSheetOpen(false); // Close to show map animation
                }}
            />
        );
    }

    if (viewMode === "region") {
      return (
        <MobileRegionSelector
          countries={Object.values(MOCK_COUNTRIES)}
          regions={Object.values(MOCK_REGIONS)}
          selectedCountryId={selectedCountryId}
          selectedRegionId={selectedRegionId}
          onSelectCountry={setSelectedCountryId}
          onSelectRegion={(id) => {
              setSelectedRegionId(id);
              setIsSheetOpen(false);
          }}
        />
      );
    }

    return null;
  };

  const getSheetTitle = () => {
    if (activeSpotId) return "Spot Details";
    if (viewMode === "trip") return "Trips";
    if (viewMode === "region") return "Regions";
    return "";
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="pointer-events-auto p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <Link href="/" className="text-white font-serif text-xl font-bold drop-shadow-md">
          Tomokichi <span className="font-light opacity-80">Globe</span>
        </Link>

        {/* Mode Switcher - Compact */}
        <div className="flex gap-2">
            <button
                onClick={() => {
                    setViewMode("region");
                    setIsSheetOpen(true);
                }}
                className={`p-2 rounded-full border border-white/20 backdrop-blur-md transition-all ${viewMode === "region" ? "bg-white text-black" : "bg-black/40 text-white"}`}
            >
                <Map size={20} />
            </button>
            <button
                onClick={() => {
                    setViewMode("trip");
                    setIsSheetOpen(true);
                }}
                className={`p-2 rounded-full border border-white/20 backdrop-blur-md transition-all ${viewMode === "trip" ? "bg-white text-black" : "bg-black/40 text-white"}`}
            >
                <BookOpen size={20} />
            </button>
        </div>
      </div>

      {/* Center Area - Mostly empty for Map Interaction */}
      <div className="flex-1" />

      {/* Bottom Sheet Trigger / Status Bar when closed */}
      {!isSheetOpen && !activeSpotId && !selectedTripId && (
        <div className="pointer-events-auto pb-8 px-4 flex justify-center">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full shadow-lg animate-bounce"
          >
            <Layers size={16} />
            <span className="font-serif">
              {viewMode === "trip" ? "Select Trip" : "Select Region"}
            </span>
          </button>
        </div>
      )}

      {/* Trip Control Bar (When Trip Selected but No Spot Active) */}
      {selectedTripId &&
        MOCK_TRIPS[selectedTripId] &&
        !activeSpotId &&
        !isSheetOpen && (
          <div className="pointer-events-auto absolute bottom-[calc(2rem_+_env(safe-area-inset-bottom))] left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
            <div className="flex-1">
              <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">
                Active Trip
              </p>
              <h3 className="text-lg font-serif text-white leading-tight">
                {MOCK_TRIPS[selectedTripId].title}
              </h3>
            </div>
            <button
              onClick={() => {
                // Start with the first spot
                const trip = MOCK_TRIPS[selectedTripId];
                const firstSpotId = trip.itineraries
                  ? trip.itineraries[0]?.spots[0]
                  : trip.spots[0];
                if (firstSpotId) setActiveSpotId(firstSpotId);
              }}
              className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors shadow-lg animate-pulse"
            >
              <Play size={18} fill="currentColor" />
              Start Tour
            </button>
          </div>
        )}

      {/* Back Button / Context Info Floating (Only when NOT in Trip Active mode, or to exit Trip Active) */}
      {(selectedTripId || selectedRegionId || selectedCountryId) &&
        !isSheetOpen &&
        !activeSpotId && (
          <div className={`absolute left-4 pointer-events-auto ${selectedTripId ? "bottom-32" : "bottom-24"}`}>
            <button
              onClick={() => {
                if (selectedTripId) setSelectedTripId(null);
                if (selectedRegionId) setSelectedRegionId(null);
                if (selectedCountryId) setSelectedCountryId(null);
              }}
              className="bg-black/60 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/10 shadow-md"
            >
              ← Back to Overview
            </button>
          </div>
        )}


      {/* Bottom Sheet */}
      <MobileBottomSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={getSheetTitle()}
        maxHeight={activeSpotId ? "40vh" : "50vh"}
        minHeight="0px" // Hidden when closed, managed by parent logic primarily or use isOpen
      >
        {renderSheetContent()}
      </MobileBottomSheet>
    </div>
  );
}
