"use client";

import { Country, Region } from "@/types/data";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface MobileRegionSelectorProps {
  countries: Country[];
  regions: Region[];
  selectedCountryId: string | null;
  selectedRegionId: string | null;
  onSelectCountry: (id: string | null) => void;
  onSelectRegion: (id: string | null) => void;
}

export function MobileRegionSelector({
  countries,
  regions,
  selectedCountryId,
  selectedRegionId,
  onSelectCountry,
  onSelectRegion,
}: MobileRegionSelectorProps) {
  // If a country is selected, show its regions (if any) or info
  if (selectedCountryId) {
    const country = countries.find((c) => c.id === selectedCountryId);
    if (!country) return null;

    const countryRegions = regions.filter((r) =>
      country.regions.includes(r.id)
    );

    return (
      <div className="flex flex-col gap-4 text-white pb-20">
        <div className="sticky top-0 bg-black/80 backdrop-blur-md py-2 z-10 flex items-center gap-2">
          <button
            onClick={() => {
              onSelectRegion(null);
              onSelectCountry(null);
            }}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-xl font-serif">{country.name}</h2>
        </div>

        <div className="text-sm text-gray-400">
          Select a region to explore spots.
        </div>

        {countryRegions.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {countryRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => onSelectRegion(region.id)}
                className={`flex items-center justify-between p-4 rounded-xl border border-white/10 transition-all ${
                  selectedRegionId === region.id
                    ? "bg-blue-500/20 border-blue-500/50"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="font-medium">{region.name}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-white/5 rounded-xl text-center text-gray-500">
            No specific regions defined. Zoom in on the map to see spots.
          </div>
        )}
      </div>
    );
  }

  // Default: Show List of Countries
  return (
    <div className="flex flex-col gap-4 text-white pb-20">
      <h2 className="text-xl font-serif sticky top-0 bg-black/80 backdrop-blur-md py-2 z-10">
        Explore Regions
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => onSelectCountry(country.id)}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <span className="text-lg font-serif">{country.name}</span>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span>{country.regions.length} Regions</span>
              <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
