"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ViewMode = "region" | "trip";

interface MapContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  selectedCountryId: string | null;
  setSelectedCountryId: (id: string | null) => void;

  selectedRegionId: string | null;
  setSelectedRegionId: (id: string | null) => void;

  activeSpotId: string | null;
  setActiveSpotId: (id: string | null) => void;

  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;

  resetSelection: () => void;
  goBack: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("region");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    // Reset selection on mode switch
    setSelectedCountryId(null);
    setSelectedRegionId(null);
    setActiveSpotId(null);
    setSelectedTripId(null);
  };

  const resetSelection = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
    setActiveSpotId(null);
    setSelectedTripId(null);
  };

  const goBack = () => {
    if (viewMode === "trip") {
      if (activeSpotId) {
        setActiveSpotId(null);
        return;
      }

      if (selectedTripId) {
        setSelectedTripId(null);
      }
      return;
    }

    if (activeSpotId) {
      setActiveSpotId(null);
      return;
    }

    if (selectedRegionId) {
      setSelectedRegionId(null);
      return;
    }

    if (selectedCountryId) {
      setSelectedCountryId(null);
    }
  };

  return (
    <MapContext.Provider
      value={{
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
        resetSelection,
        goBack,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
