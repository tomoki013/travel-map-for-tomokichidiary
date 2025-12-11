"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Map, { Marker, MapRef, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Spot, Region, Country, Trip } from "@/types/data";

interface GlobeProps {
  viewMode: "region" | "trip";
  spots: Spot[];
  regions: Region[];
  countries: Country[];
  selectedCountryId: string | null;
  selectedRegionId: string | null;
  activeSpotId: string | null;
  selectedTrip: Trip | null;
  onCountrySelect: (id: string) => void;
  onRegionSelect: (id: string) => void;
  onSpotSelect: (id: string) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function Globe({ 
  viewMode, 
  spots, 
  regions, 
  countries,
  selectedCountryId, 
  selectedRegionId, 
  activeSpotId,
  selectedTrip,
  onCountrySelect, 
  onRegionSelect, 
  onSpotSelect
}: GlobeProps) {
  const mapRef = useRef<MapRef>(null);
  
  // Rotation State
  const requestRef = useRef<number | null>(null);
  const [userInteracting, setUserInteracting] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const spinEnabled = !activeSpotId && !selectedRegionId && !selectedCountryId && !selectedTrip;

  const rotateCamera = useCallback(() => {
    if (!mapRef.current || userInteracting || !spinEnabled || !isMapLoaded) return;

    const secondsPerRevolution = 120;
    const maxSpinZoom = 3;

    const zoom = mapRef.current.getZoom();
    if (zoom > maxSpinZoom) return;

    const distancePerSecond = 360 / secondsPerRevolution;
    const center = mapRef.current.getCenter();
    center.lng -= distancePerSecond / 60; // 60 FPS assumption
    
    // Smoothly rotate
    mapRef.current.easeTo({ 
        center, 
        duration: 0, 
        easing: (t) => t 
    });
    
    requestRef.current = requestAnimationFrame(rotateCamera);
  }, [userInteracting, spinEnabled, isMapLoaded]);

  useEffect(() => {
    if (spinEnabled && !userInteracting && isMapLoaded) {
        requestRef.current = requestAnimationFrame(rotateCamera);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinEnabled, userInteracting, isMapLoaded]); 


  // Update map camera based on state
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // 1. Spot Selected (Highest Priority)
    if (activeSpotId) {
      const spot = spots.find((s) => s.id === activeSpotId);
      if (spot) {
        map.flyTo({
          center: spot.coordinates,
          zoom: spot.camera.zoom,
          pitch: spot.camera.pitch,
          bearing: spot.camera.bearing,
          duration: 2000,
        });
        return;
      }
    }

    // 2. Region Selected
    if (viewMode === 'region' && selectedRegionId) {
      const region = regions.find(r => r.id === selectedRegionId);
      if (region) {
         map.flyTo({
          center: region.center,
          zoom: region.zoom,
          pitch: 0,
          bearing: 0,
          duration: 1500,
        });
        return;
      }
    }

    // 3. Country Selected
    if (viewMode === 'region' && selectedCountryId) {
      const country = countries.find(c => c.id === selectedCountryId);
      if (country) {
         map.flyTo({
          center: country.center,
          zoom: country.zoom,
          pitch: 0,
          bearing: 0,
          duration: 1500,
        });
        return;
      }
    }

    // 4. Trip Mode Selected (Specific Trip)
    if (viewMode === 'trip' && selectedTrip) {
       if (selectedTrip.spots.length > 0) {
         const firstSpot = spots.find(s => s.id === selectedTrip?.spots[0]);
         if (firstSpot) {
            map.flyTo({
              center: firstSpot.coordinates,
              zoom: 12,
              pitch: 45, // Angled view for trips
              bearing: 0,
              duration: 2000
            });
         }
       }
       return;
    }

    // 5. Default / Reset (Global View)
    // Applies when:
    // - Region mode and nothing selected
    // - Trip mode and NO trip selected (All Trips view)
    const isDefaultView = 
      (viewMode === 'region' && !selectedCountryId && !selectedRegionId && !activeSpotId) ||
      (viewMode === 'trip' && !selectedTrip);

    if (isDefaultView) {
      map.flyTo({
        center: [138, 36], // Default center, maybe should be 0,0 for full globe?
        zoom: 1.5, // Zoomed out for globe
        pitch: 0,
        bearing: 0,
        duration: 2000,
      });
    }

  }, [viewMode, selectedCountryId, selectedRegionId, activeSpotId, selectedTrip, spots, regions, countries]);

  // Generate Trip Line GeoJSON
  const tripLineGeoJSON = selectedTrip ? {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: selectedTrip.spots
        .map(id => spots.find(s => s.id === id)?.coordinates)
        .filter(Boolean) as [number, number][]
    }
  } : null;

  return (
    <div className="w-full h-full bg-black">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 138,
          latitude: 36,
          zoom: 1.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        projection={{ name: "globe" }}
        fog={{
          range: [0.5, 10],
          color: "rgb(10, 10, 10)", 
          "high-color": "rgb(0, 0, 0)", 
          "horizon-blend": 0.05,
          "star-intensity": 0.8, 
        }}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
        onMouseDown={() => setUserInteracting(true)}
        onMouseUp={() => setUserInteracting(false)}
        onDragStart={() => setUserInteracting(true)}
        onDragEnd={() => setUserInteracting(false)}
        onZoomStart={() => setUserInteracting(true)}
        onZoomEnd={() => setUserInteracting(false)}
        onLoad={() => setIsMapLoaded(true)}
      >
        {/* VIEW MODE: REGION */}
        {viewMode === 'region' && (
          <>
            {/* Level 0: Countries */}
            {!selectedCountryId && countries.map(country => (
              <Marker
                key={country.id}
                longitude={country.center[0]}
                latitude={country.center[1]}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  onCountrySelect(country.id);
                }}
              >
                 <div className="group cursor-pointer relative">
                    {/* Extended hit area */}
                    <div className="absolute -inset-3 rounded-full bg-transparent z-10" />
                    
                    <div className="bg-black/40 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-white text-base font-serif hover:bg-white/20 hover:scale-110 hover:border-white/60 transition-all flex items-center gap-2 relative z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      {country.name}
                    </div>
                 </div>
              </Marker>
            ))}

            {/* Level 1: Regions */}
            {selectedCountryId && !selectedRegionId && regions
              .filter(r => {
                 const country = countries.find(c => c.id === selectedCountryId);
                 return country?.regions.includes(r.id);
              })
              .map(region => (
                <Marker
                  key={region.id}
                  longitude={region.center[0]}
                  latitude={region.center[1]}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    onRegionSelect(region.id);
                  }}
                >
                   <div className="group cursor-pointer relative flex flex-col items-center justify-center">
                      {/* Extended hit area */}
                      <div className="absolute -inset-3 rounded-full bg-transparent z-10" />
                      
                      {/* Visual Marker */}
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform z-20 flex items-center justify-center">
                         <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                      </div>
                      
                      {/* Label - visible on hover or maybe always? keeping hover for cleanliness but improving style */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                         <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm border border-white/20 shadow-xl">
                            {region.name}
                         </div>
                      </div>
                   </div>
                </Marker>
            ))}

            {/* Level 2: Spots */}
            {selectedRegionId && spots
              .filter(s => {
                const region = regions.find(r => r.id === selectedRegionId);
                return region?.spots.includes(s.id);
              })
              .map(spot => (
                <Marker
                  key={spot.id}
                  longitude={spot.coordinates[0]}
                  latitude={spot.coordinates[1]}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    onSpotSelect(spot.id);
                  }}
                >
                  <SpotMarker spot={spot} isActive={activeSpotId === spot.id} />
                </Marker>
            ))}
          </>
        )}

        {/* VIEW MODE: TRIP */}
        {viewMode === 'trip' && selectedTrip && (
          <>
             {/* Render Lines */}
             {tripLineGeoJSON && (
                <Source id="trip-line" type="geojson" data={tripLineGeoJSON as unknown as GeoJSON.Feature<GeoJSON.LineString>}>
                  <Layer 
                    id="trip-line-layer"
                    type="line"
                    paint={{
                      'line-color': '#60a5fa', // Blue-400
                      'line-width': 3,
                      'line-opacity': 0.8,
                      'line-dasharray': [2, 1] // Dashed line
                    }}
                  />
                </Source>
             )}

             {/* Render Markers */}
             {spots
              .filter(s => selectedTrip.spots.includes(s.id))
              .map(spot => (
                <Marker
                  key={spot.id}
                  longitude={spot.coordinates[0]}
                  latitude={spot.coordinates[1]}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    onSpotSelect(spot.id);
                  }}
                >
                  <SpotMarker spot={spot} isActive={activeSpotId === spot.id} />
                </Marker>
            ))}
          </>
        )}
      </Map>
    </div>
  );
}

function SpotMarker({ spot, isActive }: { spot: Spot, isActive: boolean }) {
  return (
    <div className={`group relative cursor-pointer ${isActive ? 'z-50' : 'z-0'}`}>
      <div className={`absolute -inset-4 bg-white/20 rounded-full blur-lg transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
      <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 ${isActive ? 'bg-blue-400 scale-125' : 'bg-white'}`} />
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-white text-xs bg-black/50 px-2 py-1 rounded transition-opacity pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {spot.name}
      </div>
    </div>
  );
}
