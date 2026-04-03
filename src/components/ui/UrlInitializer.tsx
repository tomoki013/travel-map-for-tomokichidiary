"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMapContext } from "@/contexts/MapContext";
import {
  getCountryById,
  getCountryForRegion,
  getRegionById,
  getSpotById,
  getTripById,
} from "@/data/selectors";

export function UrlInitializer() {
  const {
    setViewMode,
    setSelectedCountryId,
    setSelectedRegionId,
    setActiveSpotId,
    setSelectedTripId,
  } = useMapContext();

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const tripId = searchParams.get("trip");
    const mode = searchParams.get("mode");
    const countryId = searchParams.get("country");
    const regionId = searchParams.get("region");
    const spotId = searchParams.get("spot");

    if (!mode && !tripId && !countryId && !regionId && !spotId) return;

    if (mode === "trip" && !tripId) {
      setViewMode("trip");
    } else if (tripId) {
      const trip = getTripById(tripId);
      if (trip) {
        setViewMode("trip");
        setSelectedTripId(tripId);

        const spot = getSpotById(spotId);
        if (spot && trip.spots.includes(spot.id)) {
          setActiveSpotId(spot.id);
        }
      }
    } else {
      let targetCountryId: string | null = null;
      let targetRegionId: string | null = null;
      let targetSpotId: string | null = null;

      const spot = getSpotById(spotId);
      if (spot) {
        targetSpotId = spot.id;
        targetRegionId = getRegionById(spot.regionSlug)?.id ?? null;
      }

      if (!targetRegionId) {
        targetRegionId = getRegionById(regionId)?.id ?? null;
      }

      if (targetRegionId) {
        targetCountryId = getCountryForRegion(targetRegionId)?.id ?? null;
      } else {
        targetCountryId = getCountryById(countryId)?.id ?? null;
      }

      if (targetCountryId || targetRegionId || targetSpotId) {
        setViewMode("region");
        if (targetCountryId) setSelectedCountryId(targetCountryId);
        if (targetRegionId) setSelectedRegionId(targetRegionId);
        if (targetSpotId) setActiveSpotId(targetSpotId);
      } else if (mode === "region") {
        setViewMode("region");
      }
    }

    router.replace("/");
  }, [
    searchParams,
    router,
    setViewMode,
    setSelectedTripId,
    setActiveSpotId,
    setSelectedCountryId,
    setSelectedRegionId,
  ]);

  return null;
}
