"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  getAllSpotsGeoJSON,
  getCountryById,
  getCountryByIsoAlpha2,
  getCountryForSpot,
  getListedRegionsByCountry,
  getRegionById,
  getSpotById,
  getTripLineGeoJSON,
  getTripById,
  getRegionCountryIsoCodes,
  getVisitedCountryIsoCodes,
} from "@/data/selectors";
import { useMapContext } from "@/contexts/MapContext";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const NO_COUNTRY_MATCH = "__none__";
const JAPAN_WORLDVIEW = "JP";

const COUNTRY_BOUNDARY_CONDITIONS = [
  ["has", "iso_3166_1"],
  ["==", ["get", "disputed"], "false"],
  [
    "any",
    ["==", ["get", "worldview"], "all"],
    ["in", JAPAN_WORLDVIEW, ["get", "worldview"]],
  ],
];

const COUNTRY_BOUNDARY_LAYER_PROPS = {
  source: "visited-countries-source",
  "source-layer": "country_boundaries",
} as const;
const COUNTRY_LABEL_LAYER_IDS = ["country-label"];
const COUNTRY_HINT_TEXT = "国をクリックして地域を見る";

export function GlobalMap() {
  const mapRef = useRef<MapRef>(null);
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

  const selectedTrip = getTripById(selectedTripId);
  const [userInteracting, setUserInteracting] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [countryPulseOn, setCountryPulseOn] = useState(true);

  const spinEnabled =
    !activeSpotId && !selectedRegionId && !selectedCountryId && !selectedTripId;

  const regionCountryIsoCodes = useMemo(
    () => getRegionCountryIsoCodes(selectedCountryId, selectedRegionId),
    [selectedCountryId, selectedRegionId],
  );
  const visitedCountryIsoCodes = useMemo(() => getVisitedCountryIsoCodes(), []);

  const highlightedCountryIsoCode = useMemo(() => {
    if (viewMode !== "region" || selectedRegionId) {
      return null;
    }

    if (activeSpotId) {
      return getCountryForSpot(activeSpotId)?.isoAlpha2 ?? null;
    }

    if (selectedCountryId) {
      return getCountryById(selectedCountryId)?.isoAlpha2 ?? null;
    }

    return null;
  }, [activeSpotId, selectedCountryId, selectedRegionId, viewMode]);

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

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    const map = mapRef.current;

    if (activeSpotId) {
      const spot = getSpotById(activeSpotId);
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

    if (viewMode === "region" && selectedRegionId) {
      const region = getRegionById(selectedRegionId);
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

    if (viewMode === "region" && selectedCountryId) {
      const country = getCountryById(selectedCountryId);
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

    if (viewMode === "trip" && selectedTrip) {
      if (selectedTrip.spots.length > 0) {
        const firstSpot = getSpotById(selectedTrip.spots[0]);
        if (firstSpot) {
          map.flyTo({
            center: firstSpot.coordinates,
            zoom: 12,
            pitch: 45,
            bearing: 0,
            duration: 2000,
          });
        }
      } else {
        map.flyTo({
          center: [138, 36],
          zoom: 1.5,
          pitch: 0,
          bearing: 0,
          duration: 2000,
        });
      }
      return;
    }

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
    selectedTrip,
    isMapLoaded,
  ]);

  const tripLineGeoJSON = useMemo(() => {
    return getTripLineGeoJSON(selectedTrip);
  }, [selectedTrip]);

  const spotsGeoJSON = useMemo(() => getAllSpotsGeoJSON(), []);

  const regionsGeoJSON = useMemo(() => {
    if (viewMode !== "region" || !selectedCountryId || activeSpotId) {
      return {
        type: "FeatureCollection",
        features: [],
      } as GeoJSON.FeatureCollection<GeoJSON.Point>;
    }

    const features = getListedRegionsByCountry(selectedCountryId).map((region) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: region.center,
      },
      properties: {
        id: region.id,
        name: region.name,
        isSelected: region.id === selectedRegionId,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
    } as GeoJSON.FeatureCollection<GeoJSON.Point>;
  }, [activeSpotId, selectedCountryId, selectedRegionId, viewMode]);

  const regionCountriesFilter = useMemo(
    () =>
      [
        "all",
        ...COUNTRY_BOUNDARY_CONDITIONS,
        ["in", ["get", "iso_3166_1"], ["literal", regionCountryIsoCodes]],
      ] as mapboxgl.FilterSpecification,
    [regionCountryIsoCodes],
  );

  const tripCountriesFilter = useMemo(
    () =>
      [
        "all",
        ...COUNTRY_BOUNDARY_CONDITIONS,
        ["in", ["get", "iso_3166_1"], ["literal", visitedCountryIsoCodes]],
      ] as mapboxgl.FilterSpecification,
    [visitedCountryIsoCodes],
  );

  const highlightedCountryFilter = useMemo(
    () =>
      [
        "all",
        ...COUNTRY_BOUNDARY_CONDITIONS,
        [
          "==",
          ["get", "iso_3166_1"],
          highlightedCountryIsoCode ?? NO_COUNTRY_MATCH,
        ],
      ] as mapboxgl.FilterSpecification,
    [highlightedCountryIsoCode],
  );

  const showRegionCountryHighlight =
    viewMode === "region" && !selectedRegionId && regionCountryIsoCodes.length > 0;
  const showTripCountryHighlight =
    viewMode === "trip" && !selectedTrip && !activeSpotId && visitedCountryIsoCodes.length > 0;
  const showCountryBackdrop =
    showRegionCountryHighlight || showTripCountryHighlight;
  const showCountryClickHint =
    viewMode === "region" &&
    !selectedCountryId &&
    !selectedRegionId &&
    !activeSpotId &&
    regionCountryIsoCodes.length > 0;

  useEffect(() => {
    if (!showCountryClickHint) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCountryPulseOn((current) => !current);
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [showCountryClickHint]);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    const map = mapRef.current.getMap();
    const labelVisibility = viewMode === "region" ? "none" : "visible";

    map.getStyle().layers?.forEach((layer) => {
      if (!COUNTRY_LABEL_LAYER_IDS.some((id) => layer.id.includes(id))) {
        return;
      }

      const currentVisibility = map.getLayoutProperty(layer.id, "visibility");
      if (currentVisibility !== labelVisibility) {
        map.setLayoutProperty(layer.id, "visibility", labelVisibility);
      }
    });
  }, [isMapLoaded, viewMode]);

  const regionCountryFillPaint = useMemo(
    () => ({
      "fill-color": selectedCountryId ? "#fff36b" : "#f3ff57",
      "fill-opacity": selectedCountryId ? 0.34 : 0.2,
    }),
    [selectedCountryId],
  );

  const regionCountryGlowPaint = useMemo(
    () => ({
      "fill-color": selectedCountryId ? "#f8ffb0" : "#f6ff9b",
      "fill-opacity": selectedCountryId ? 0.08 : 0.04,
    }),
    [selectedCountryId],
  );

  const regionCountryOutlinePaint = useMemo(
    () => ({
      "line-color": selectedCountryId ? "#fffde1" : "#fbffcc",
      "line-width": selectedCountryId ? 2.5 : 1.8,
      "line-opacity": selectedCountryId ? 0.96 : countryPulseOn ? 0.88 : 0.46,
      "line-blur": selectedCountryId ? 0.12 : countryPulseOn ? 0.28 : 0.08,
    }),
    [countryPulseOn, selectedCountryId],
  );

  const tripCountryFillPaint = {
    "fill-color": "#fff06c",
    "fill-opacity": 0.16,
  };

  const tripCountryGlowPaint = {
    "fill-color": "#fff7a8",
    "fill-opacity": 0.04,
  };

  const tripCountryOutlinePaint = {
    "line-color": "#fff6c0",
    "line-width": 1.9,
    "line-opacity": 0.72,
    "line-blur": 0.12,
  };

  const highlightedCountryFillPaint = {
    "fill-color": "#fff27f",
    "fill-opacity": 0.18,
  };

  const highlightedCountryOutlinePaint = {
    "line-color": "#ffffff",
    "line-width": 2.4,
    "line-opacity": 0.95,
    "line-blur": 0.05,
  };

  return (
    <div className="relative w-full h-full bg-black">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 138,
          latitude: 36,
          zoom: 1.5,
        }}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        projection={{ name: "globe" }}
        dragPan
        dragRotate
        touchZoomRotate
        scrollZoom
        fog={{
          range: [0.5, 10],
          color: "rgb(10, 10, 10)",
          "high-color": "rgb(0, 0, 0)",
          "horizon-blend": 0.05,
          "star-intensity": 0.8,
        }}
        onMouseDown={() => setUserInteracting(true)}
        onMouseUp={() => setUserInteracting(false)}
        onTouchStart={() => setUserInteracting(true)}
        onTouchEnd={() => setUserInteracting(false)}
        onDragStart={() => setUserInteracting(true)}
        onDragEnd={() => setUserInteracting(false)}
        onZoomStart={() => setUserInteracting(true)}
        onZoomEnd={() => setUserInteracting(false)}
        onRotateStart={() => setUserInteracting(true)}
        onRotateEnd={() => setUserInteracting(false)}
        onPitchStart={() => setUserInteracting(true)}
        onPitchEnd={() => setUserInteracting(false)}
        onLoad={() => setIsMapLoaded(true)}
        onMouseMove={(e) => {
          if (!mapRef.current) return;

          const map = mapRef.current.getMap();
          const hoveringClickableCountry = Boolean(
            viewMode === "region" &&
              !selectedCountryId &&
              !selectedRegionId &&
              e.features?.some(
                (feature) =>
                  feature.layer?.id === "region-country-hit" ||
                  feature.layer?.id === "region-country-fill" ||
                  feature.layer?.id === "region-country-outline",
              ),
          );

          map.getCanvas().style.cursor = hoveringClickableCountry ? "pointer" : "";
        }}
        onMouseLeave={() => {
          if (!mapRef.current) return;
          mapRef.current.getMap().getCanvas().style.cursor = "";
        }}
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

            if (
              viewMode === "region" &&
              selectedCountryId &&
              !activeSpotId &&
              feature.layer?.id === "region-hit-layer"
            ) {
              const regionId = feature.properties?.id;
              if (regionId) {
                setSelectedRegionId(regionId);
                e.originalEvent.stopPropagation();
                return;
              }
            }

            if (
              viewMode === "region" &&
              !selectedCountryId &&
              (feature.layer?.id === "region-country-hit" ||
                feature.layer?.id === "region-country-fill" ||
                feature.layer?.id === "region-country-outline")
            ) {
              const isoAlpha2 = feature.properties?.iso_3166_1;
              const country = getCountryByIsoAlpha2(isoAlpha2);
              if (country) {
                setSelectedCountryId(country.id);
                e.originalEvent.stopPropagation();
                return;
              }
            }
          }

          setActiveSpotId(null);
        }}
        interactiveLayerIds={[
          "spots-hit-layer",
          "spots-layer",
          "region-country-hit",
          "region-country-fill",
          "region-country-outline",
          "region-hit-layer",
        ]}
      >
        <Source
          id="visited-countries-source"
          type="vector"
          url="mapbox://mapbox.country-boundaries-v1"
        >
          {showCountryBackdrop && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="country-backdrop-fill"
              type="fill"
              filter={["all", ...COUNTRY_BOUNDARY_CONDITIONS]}
              paint={{
                "fill-color": "#060606",
                "fill-opacity": viewMode === "trip" ? 0.12 : 0.16,
              }}
            />
          )}
          {showRegionCountryHighlight && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="region-country-fill"
              type="fill"
              filter={regionCountriesFilter}
              paint={regionCountryFillPaint}
            />
          )}
          {showRegionCountryHighlight && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="region-country-glow"
              type="fill"
              filter={regionCountriesFilter}
              paint={regionCountryGlowPaint}
            />
          )}
          {showRegionCountryHighlight && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="region-country-outline"
              type="line"
              filter={regionCountriesFilter}
              paint={regionCountryOutlinePaint}
            />
          )}
          {showRegionCountryHighlight && !selectedCountryId && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="region-country-hit"
              type="fill"
              filter={regionCountriesFilter}
              paint={{
                "fill-color": "#000000",
                "fill-opacity": 0.01,
              }}
            />
          )}
          {showTripCountryHighlight && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="trip-country-fill"
              type="fill"
              filter={tripCountriesFilter}
              paint={tripCountryFillPaint}
            />
          )}
          {showTripCountryHighlight && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="trip-country-glow"
              type="fill"
              filter={tripCountriesFilter}
              paint={tripCountryGlowPaint}
            />
          )}
          {showTripCountryHighlight && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="trip-country-outline"
              type="line"
              filter={tripCountriesFilter}
              paint={tripCountryOutlinePaint}
            />
          )}
          {highlightedCountryIsoCode && !selectedRegionId && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="highlighted-country-fill"
              type="fill"
              filter={highlightedCountryFilter}
              paint={highlightedCountryFillPaint}
            />
          )}
          {highlightedCountryIsoCode && !selectedRegionId && (
            <Layer
              {...COUNTRY_BOUNDARY_LAYER_PROPS}
              id="highlighted-country-outline"
              type="line"
              filter={highlightedCountryFilter}
              paint={highlightedCountryOutlinePaint}
            />
          )}
        </Source>

        <Source id="region-centers" type="geojson" data={regionsGeoJSON}>
          {selectedCountryId && !activeSpotId && (
            <>
              <Layer
                id="region-glow-layer"
                type="circle"
                paint={{
                  "circle-radius": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    80,
                    54,
                  ],
                  "circle-color": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    "#ffe65f",
                    "#fff08b",
                  ],
                  "circle-opacity": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    0.22,
                    0.12,
                  ],
                  "circle-blur": 0.9,
                }}
              />
              <Layer
                id="region-core-layer"
                type="circle"
                paint={{
                  "circle-radius": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    20,
                    10,
                  ],
                  "circle-color": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    "#fff6b0",
                    "#fff4c8",
                  ],
                  "circle-stroke-width": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    2.5,
                    1.5,
                  ],
                  "circle-stroke-color": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    "#fffef2",
                    "#fff7dc",
                  ],
                  "circle-opacity": [
                    "case",
                    ["==", ["get", "isSelected"], true],
                    0.92,
                    0.78,
                  ],
                }}
              />
              <Layer
                id="region-hit-layer"
                type="circle"
                paint={{
                  "circle-radius": 26,
                  "circle-opacity": 0,
                }}
              />
              <Layer
                id="region-label-layer"
                type="symbol"
                layout={{
                  "text-field": ["get", "name"],
                  "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                  "text-size": 12,
                  "text-offset": [0, 2.2],
                  "text-anchor": "top",
                  "text-allow-overlap": false,
                }}
                paint={{
                  "text-color": "#fff8d6",
                  "text-halo-color": "#000000",
                  "text-halo-width": 1.5,
                  "text-opacity": 0.96,
                }}
              />
            </>
          )}
        </Source>

        <Source id="local-spots" type="geojson" data={spotsGeoJSON}>
          <Layer
            id="spots-layer"
            type="circle"
            paint={{
              "circle-radius": [
                "case",
                ["==", ["get", "id"], activeSpotId || ""],
                7,
                6,
              ],
              "circle-color": [
                "case",
                ["==", ["get", "id"], activeSpotId || ""],
                "#60a5fa",
                ["==", ["literal", viewMode], "trip"],
                "#a5ff70",
                "#ffffff",
              ],
              "circle-stroke-width": 2,
              "circle-stroke-color": [
                "case",
                ["==", ["get", "id"], activeSpotId || ""],
                "#ffffff",
                ["==", ["literal", viewMode], "trip"],
                "#f4ffe0",
                "#60a5fa",
              ],
              "circle-opacity": 0.9,
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
                ["==", ["get", "isRegionVisible"], true],
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
                ["==", ["get", "isRegionVisible"], true],
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
              "text-color":
                viewMode === "trip" ? "#f7ffe8" : "#ffffff",
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
                ["==", ["get", "isRegionVisible"], true],
              ],
            ]}
          />
        </Source>

        {viewMode === "region" && (
          <>
            {selectedCountryId &&
              !selectedRegionId &&
              getListedRegionsByCountry(selectedCountryId).map((region) => (
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
                    <div className="w-7 h-7 bg-[#ffe866] rounded-full border-2 border-[#fff7c2] shadow-[0_0_18px_rgba(255,232,102,0.7)] group-hover:scale-125 transition-transform z-20 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white rounded-full opacity-70" />
                    </div>
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                      <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md text-[#fff9d2] text-sm border border-[#fff3a0]/40 shadow-xl">
                        {region.name}
                      </div>
                    </div>
                  </button>
                </Marker>
              ))}
          </>
        )}

        {viewMode === "trip" && selectedTrip && tripLineGeoJSON && (
          <Source
            id="trip-line"
            type="geojson"
            data={tripLineGeoJSON as GeoJSON.Feature<GeoJSON.LineString>}
          >
            <Layer
              id="trip-line-glow"
              type="line"
              paint={{
                "line-color": "#cfff8b",
                "line-width": 7,
                "line-opacity": 0.2,
                "line-blur": 2,
              }}
            />
            <Layer
              id="trip-line-layer"
              type="line"
              paint={{
                "line-color": "#9cff6b",
                "line-width": 3.8,
                "line-opacity": 0.95,
                "line-dasharray": [1.5, 1],
              }}
            />
          </Source>
        )}
      </Map>
      {showCountryClickHint && (
        <div className="pointer-events-none absolute left-1/2 bottom-24 z-20 -translate-x-1/2">
          <div className="rounded-full border border-[#f5ff9d]/55 bg-black/58 px-4 py-2 text-sm text-[#f7ffc3] shadow-[0_0_26px_rgba(245,255,157,0.2)] backdrop-blur-md">
            {COUNTRY_HINT_TEXT}
          </div>
        </div>
      )}
    </div>
  );
}
