"use client";

import { useMapContext } from "@/contexts/MapContext";
import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  className?: string;
  variant?: "icon" | "full";
}

export function ShareButton({ className = "", variant = "icon" }: ShareButtonProps) {
  const { 
    viewMode,
    selectedCountryId,
    selectedRegionId,
    activeSpotId,
    selectedTripId
  } = useMapContext();

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    let url = window.location.origin + '/';
    const params = new URLSearchParams();

    if (viewMode === 'trip' && selectedTripId) {
      params.set('trip', selectedTripId);
      if (activeSpotId) {
        // Find if spot belongs to trip? Assuming yes if active.
        params.set('spot', activeSpotId);
      }
    } else {
      // Region mode
      if (activeSpotId) {
        params.set('spot', activeSpotId);
      } else if (selectedRegionId) {
        params.set('region', selectedRegionId);
      } else if (selectedCountryId) {
        params.set('country', selectedCountryId);
      }
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 transition-colors ${className}`}
      title="Share current view"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {(variant === "full" || copied) && (
        <span className="text-xs md:text-sm font-medium">
          {copied ? "Copied!" : "Share"}
        </span>
      )}
    </button>
  );
}
