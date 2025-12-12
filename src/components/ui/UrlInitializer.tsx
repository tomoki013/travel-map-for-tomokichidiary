"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMapContext } from "@/contexts/MapContext";
import { MOCK_TRIPS, MOCK_SPOTS, MOCK_REGIONS, MOCK_COUNTRIES } from "@/data/mockData";

export function UrlInitializer() {
  const { 
    setViewMode,
    setSelectedCountryId,
    setSelectedRegionId,
    setActiveSpotId,
    setSelectedTripId
  } = useMapContext();

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const tripId = searchParams.get('trip');
    const countryId = searchParams.get('country');
    const regionId = searchParams.get('region');
    const spotId = searchParams.get('spot');

    // If no params, do nothing
    if (!tripId && !countryId && !regionId && !spotId) return;

    // Helper to find country for a region
    const getCountryForRegion = (rId: string) => {
      return Object.values(MOCK_COUNTRIES).find(c => c.regions.includes(rId))?.id;
    };

    // Apply logic with validation
    if (tripId) {
       // Validate Trip ID
       if (MOCK_TRIPS[tripId]) {
         setViewMode('trip');
         setSelectedTripId(tripId);
         
         // Validate Spot ID if present
         if (spotId && MOCK_SPOTS[spotId]) {
           // Ensure the spot belongs to the trip? 
           // Optional strictness, but let's just valid existence for now
           setActiveSpotId(spotId);
         }
       }
       // If tripId is invalid, we do nothing (fall back to default state)
       // Initializer doesn't explicitly clear state because default is cleared, but we should make sure we don't leave mess?
       // Actually, the app starts with cleared state.
    } else {
       // Region mode default
       
       let targetCountryId: string | null = null;
       let targetRegionId: string | null = null;
       let targetSpotId: string | null = null;

       // 1. Resolve from Spot (Most specific)
       if (spotId && MOCK_SPOTS[spotId]) {
         targetSpotId = spotId;
         // Infer region
         const spot = MOCK_SPOTS[spotId];
         if (spot.regionSlug && MOCK_REGIONS[spot.regionSlug]) {
           targetRegionId = spot.regionSlug;
         }
       }

       // 2. Resolve from Region (if not already set or override if explicit mismatch? No, implicit should win if we want partial URLs to work)
       // If we visited ?spot=X, we expect parent region of X. 
       // If param ?region=Y is also provided but mismatch, we should probably prefer Spot's parent or fail?
       // Let's prioritize the most specific VALID param.
       
       if (!targetRegionId && regionId && MOCK_REGIONS[regionId]) {
         targetRegionId = regionId;
       }

       // 3. Resolve Country
       if (targetRegionId) {
         const parentCountry = getCountryForRegion(targetRegionId);
         if (parentCountry) targetCountryId = parentCountry;
       } else if (countryId && MOCK_COUNTRIES[countryId]) {
         targetCountryId = countryId;
       }

       // Apply State
       if (targetCountryId || targetRegionId || targetSpotId) {
         setViewMode('region');
         if (targetCountryId) setSelectedCountryId(targetCountryId);
         if (targetRegionId) setSelectedRegionId(targetRegionId);
         if (targetSpotId) setActiveSpotId(targetSpotId);
       }
    }

    // Clear URL params
    router.replace('/');
  }, [searchParams, router, setViewMode, setSelectedTripId, setActiveSpotId, setSelectedCountryId, setSelectedRegionId]);

  return null;
}
