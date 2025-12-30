"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Map, { Marker, MapRef, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MOCK_SPOTS,
  MOCK_REGIONS,
  MOCK_COUNTRIES,
  MOCK_TRIPS,
} from "@/data/mockData";
import { useMapContext } from "@/contexts/MapContext";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function GlobalMap() {
  const mapRef = useRef<MapRef>(null);

  // Read State from Context
  const {
    viewMode,
    selectedCountryId,
    selectedRegionId,
    activeSpotId,
    selectedTripId,
    setActiveSpotId,
    setSelectedCountryId,
    setSelectedRegionId,
  } = useMapContext();

  const selectedTrip = selectedTripId ? MOCK_TRIPS[selectedTripId] : null;

  // Rotation State
  const [userInteracting, setUserInteracting] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const spinEnabled =
    !activeSpotId && !selectedRegionId && !selectedCountryId && !selectedTripId;

  useEffect(() => {
    if (!spinEnabled || userInteracting || !isMapLoaded) return;

    let animationFrameId: number;

    const rotate = () => {
      if (!mapRef.current) return;
      const secondsPerRevolution = 120;
      const maxSpinZoom = 3;
      const zoom = mapRef.current.getZoom();
      if (zoom > maxSpinZoom) {
        animationFrameId = requestAnimationFrame(rotate);
        return;
      }

      const distancePerSecond = 360 / secondsPerRevolution;
      const center = mapRef.current.getCenter();
      center.lng -= distancePerSecond / 60;
      mapRef.current.easeTo({ center, duration: 0, easing: (t) => t });

      animationFrameId = requestAnimationFrame(rotate);
    };

    animationFrameId = requestAnimationFrame(rotate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [spinEnabled, userInteracting, isMapLoaded]);

  // Update map camera based on context state
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    const map = mapRef.current;

    // 1. Spot Selected (Highest Priority)
    if (activeSpotId) {
      const spot = MOCK_SPOTS[activeSpotId];
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
    if (viewMode === "region" && selectedRegionId) {
      const region = MOCK_REGIONS[selectedRegionId];
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
    if (viewMode === "region" && selectedCountryId) {
      const country = MOCK_COUNTRIES[selectedCountryId];
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
    if (viewMode === "trip" && selectedTrip) {
      if (selectedTrip.spots.length > 0) {
        const firstSpot = MOCK_SPOTS[selectedTrip.spots[0]];
        if (firstSpot) {
          map.flyTo({
            center: firstSpot.coordinates,
            zoom: 12,
            pitch: 45, // Angled view for trips
            bearing: 0,
            duration: 2000,
          });
        }
      }
      return;
    }

    // 5. Default / Reset (Global View)
    const isDefaultView =
      (viewMode === "region" &&
        !selectedCountryId &&
        !selectedRegionId &&
        !activeSpotId) ||
      (viewMode === "trip" && !selectedTrip);

    if (isDefaultView) {
      map.flyTo({
        center: [138, 36],
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
        duration: 2000,
      });
    }
  }, [
    viewMode,
    selectedCountryId,
    selectedRegionId,
    activeSpotId,
    selectedTripId,
    selectedTrip,
    isMapLoaded,
  ]);

  // Generate Trip Line GeoJSON
  const tripLineGeoJSON = useMemo(() => {
    return selectedTrip
      ? {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: selectedTrip.spots
              .map((id) => MOCK_SPOTS[id]?.coordinates)
              .filter(Boolean) as [number, number][],
          },
        }
      : null;
  }, [selectedTrip]);

  // Generate Spots GeoJSON from MOCK_SPOTS
  const spotsGeoJSON = useMemo(() => {
    const features = Object.values(MOCK_SPOTS).map((spot) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: spot.coordinates,
      },
      properties: {
        id: spot.id,
        name: spot.name,
        description: spot.description,
        regionId: spot.regionSlug, // mapping regionSlug to regionId for layer filter consistency
        camera: spot.camera,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
    };
  }, []);

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
        onClick={(e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            if (
              feature.layer?.id === "spots-hit-layer" ||
              feature.layer?.id === "spots-layer"
            ) {
              const spotId = feature.properties?.id;
              if (spotId) {
                setActiveSpotId(spotId);
                e.originalEvent.stopPropagation();
                return;
              }
            }
          }
          // If clicked on empty space (no features handled above), clear active spot
          // This allows "tapping the globe" to dismiss details
          setActiveSpotId(null);
        }}
        interactiveLayerIds={["spots-hit-layer", "spots-layer"]}
      >
        {/* Load GeoJSON derived from MOCK_SPOTS */}
        <Source id="local-spots" type="geojson" data={spotsGeoJSON as any}>
          <Layer
            id="spots-layer"
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": [
                "case",
                ["==", ["get", "id"], activeSpotId || ""],
                "#60a5fa",
                "#ffffff",
              ],
              "circle-stroke-width": 2,
              "circle-stroke-color": [
                "case",
                ["==", ["get", "id"], activeSpotId || ""],
                "#ffffff",
                "#60a5fa",
              ],
              "circle-opacity": 0.8,
            }}
            filter={[
              "any",
              // If Trip Mode + Selected Trip: Show spots in trip
              [
                "all",
                ["==", ["literal", viewMode], "trip"],
                [
                  "in",
                  ["get", "id"],
                  ["literal", selectedTrip ? selectedTrip.spots : []],
                ],
              ],
              // If Region Mode + Selected Region: Show spots in region
              [
                "all",
                ["==", ["literal", viewMode], "region"],
                ["==", ["get", "regionId"], selectedRegionId || ""],
              ],
            ]}
          />
          <Layer
            id="spots-hit-layer"
            type="circle"
            paint={{ "circle-radius": 20, "circle-opacity": 0 }}
            filter={[
              "any",
              [
                "all",
                ["==", ["literal", viewMode], "trip"],
                [
                  "in",
                  ["get", "id"],
                  ["literal", selectedTrip ? selectedTrip.spots : []],
                ],
              ],
              [
                "all",
                ["==", ["literal", viewMode], "region"],
                ["==", ["get", "regionId"], selectedRegionId || ""],
              ],
            ]}
          />
          <Layer
            id="spots-label-layer"
            type="symbol"
            layout={{
              "text-field": ["get", "name"],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 12,
              "text-offset": [0, 1.5],
              "text-anchor": "top",
              "text-allow-overlap": false,
            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1.5,
            }}
            filter={[
              "any",
              [
                "all",
                ["==", ["literal", viewMode], "trip"],
                [
                  "in",
                  ["get", "id"],
                  ["literal", selectedTrip ? selectedTrip.spots : []],
                ],
              ],
              [
                "all",
                ["==", ["literal", viewMode], "region"],
                ["==", ["get", "regionId"], selectedRegionId || ""],
              ],
            ]}
          />
        </Source>

        {/* VIEW MODE: REGION - Countries & Regions markers */}
        {viewMode === "region" && (
          <>
            {/* Level 0: Countries */}
            {!selectedCountryId &&
              Object.values(MOCK_COUNTRIES).map((country) => (
                <Marker
                  key={country.id}
                  longitude={country.center[0]}
                  latitude={country.center[1]}
                >
                  <button
                    className="group cursor-pointer relative pointer-events-auto z-50 text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCountryId(country.id);
                    }}
                  >
                    <div className="absolute -inset-3 rounded-full bg-transparent z-10" />
                    <div className="bg-black/40 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-white text-base font-serif hover:bg-white/20 hover:scale-110 hover:border-white/60 transition-all flex items-center gap-2 relative z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      {country.name}
                    </div>
                  </button>
                </Marker>
              ))}

            {/* Level 1: Regions */}
            {selectedCountryId &&
              !selectedRegionId &&
              Object.values(MOCK_REGIONS)
                .filter((r) => {
                  const country = MOCK_COUNTRIES[selectedCountryId];
                  return country?.regions.includes(r.id);
                })
                .map((region) => (
                  <Marker
                    key={region.id}
                    longitude={region.center[0]}
                    latitude={region.center[1]}
                  >
                    <button
                      className="group cursor-pointer relative flex flex-col items-center justify-center pointer-events-auto z-50 text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRegionId(region.id);
                      }}
                    >
                      <div className="absolute -inset-3 rounded-full bg-transparent z-10" />
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform z-20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                      </div>
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-md text-white text-sm border border-white/20 shadow-xl">
                          {region.name}
                        </div>
                      </div>
                    </button>
                  </Marker>
                ))}
          </>
        )}

        {/* VIEW MODE: TRIP - Line */}
        {viewMode === "trip" && selectedTrip && tripLineGeoJSON && (
          <Source
            id="trip-line"
            type="geojson"
            data={tripLineGeoJSON as GeoJSON.Feature<GeoJSON.LineString>}
          >
            <Layer
              id="trip-line-layer"
              type="line"
              paint={{
                "line-color": "#60a5fa",
                "line-width": 3,
                "line-opacity": 0.8,
                "line-dasharray": [2, 1],
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
