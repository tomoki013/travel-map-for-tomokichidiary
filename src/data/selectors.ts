import { Country, Region, Spot, Trip } from "@/types/data";
import {
  countries,
  regions,
  spots,
  trips,
} from "@/data/travelIndex";

export const getCountryById = (countryId: string | null | undefined) => {
  return countryId ? countries[countryId] ?? null : null;
};

export const getCountryByIsoAlpha2 = (isoAlpha2: string | null | undefined) => {
  if (!isoAlpha2) return null;

  return (
    Object.values(countries).find(
      (country) => country.isoAlpha2 === isoAlpha2,
    ) ?? null
  );
};

export const getRegionById = (regionId: string | null | undefined) => {
  return regionId ? regions[regionId] ?? null : null;
};

export const getSpotById = (spotId: string | null | undefined) => {
  return spotId ? spots[spotId] ?? null : null;
};

export const getTripById = (tripId: string | null | undefined) => {
  return tripId ? trips[tripId] ?? null : null;
};

export const getListedCountries = (): Country[] => {
  return Object.values(countries).filter((country) => country.isListed);
};

export const getAllCountries = (): Country[] => Object.values(countries);

export const getAllRegions = (): Region[] => Object.values(regions);

export const getListedRegionsByCountry = (countryId: string): Region[] => {
  const country = getCountryById(countryId);
  if (!country) {
    return [];
  }

  return country.regions
    .map((regionId) => regions[regionId])
    .filter((region): region is Region => Boolean(region?.isListed));
};

export const getCountryForRegion = (regionId: string): Country | null => {
  const region = getRegionById(regionId);
  return region ? getCountryById(region.countryId) : null;
};

export const getCountryForSpot = (spotId: string): Country | null => {
  const spot = getSpotById(spotId);
  return spot ? getCountryForRegion(spot.regionSlug) : null;
};

export const getRegionState = (regionId: string) => {
  const region = getRegionById(regionId);
  if (!region) {
    return null;
  }

  return {
    region,
    country: getCountryById(region.countryId),
    spots: region.spots
      .map((spotId) => spots[spotId])
      .filter((spot): spot is Spot => Boolean(spot)),
    isReady: region.status === "ready",
  };
};

export const getTripSpots = (trip: Trip): Spot[] => {
  return trip.spots
    .map((spotId) => spots[spotId])
    .filter((spot): spot is Spot => Boolean(spot));
};

export const getTripSpotIds = (trip: Trip): string[] =>
  trip.itineraries?.flatMap((itinerary) => itinerary.spots) ?? trip.spots;

export const isTripReady = (trip: Trip): boolean => {
  return getTripSpots(trip).length > 0;
};

const getTripSortKey = (trip: Trip): string => {
  return trip.date.split("~")[0] ?? trip.date;
};

export const getTripsSortedByDate = (): Trip[] => {
  return Object.values(trips).sort((a, b) =>
    getTripSortKey(a).localeCompare(getTripSortKey(b)),
  );
};

export const getVisitedCountries = (): Country[] => {
  const seenCountryIds = new Set<string>();

  Object.values(spots).forEach((spot) => {
    const country = getCountryForRegion(spot.regionSlug);
    if (country) {
      seenCountryIds.add(country.id);
    }
  });

  return [...seenCountryIds]
    .map((countryId) => countries[countryId])
    .filter((country): country is Country => Boolean(country));
};

export const getVisitedCountryIsoCodes = (): string[] => {
  return getVisitedCountries().map((country) => country.isoAlpha2);
};

export const getTripCountryIsoCodes = (trip: Trip | null | undefined): string[] => {
  if (!trip) return [];

  const seenIsoCodes = new Set<string>();

  trip.spots.forEach((spotId) => {
    const country = getCountryForSpot(spotId);
    if (country) {
      seenIsoCodes.add(country.isoAlpha2);
    }
  });

  return [...seenIsoCodes];
};

export const getRegionCountryIsoCodes = (
  selectedCountryId: string | null | undefined,
  selectedRegionId: string | null | undefined,
): string[] => {
  if (selectedRegionId) {
    return [];
  }

  if (selectedCountryId) {
    const country = getCountryById(selectedCountryId);
    return country ? [country.isoAlpha2] : [];
  }

  return getVisitedCountryIsoCodes();
};

export const getAllSpotsGeoJSON = (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
  type: "FeatureCollection",
  features: Object.values(spots).map((spot) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: spot.coordinates,
    },
    properties: {
      id: spot.id,
      name: spot.name,
      description: spot.description,
      regionId: spot.regionSlug,
      isRegionVisible: spot.isRegionVisible ?? true,
      camera: spot.camera,
    },
  })),
});

export const getTripLineGeoJSON = (
  trip: Trip | null | undefined,
): GeoJSON.Feature<GeoJSON.LineString> | null => {
  if (!trip) {
    return null;
  }

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: trip.spots
        .map((spotId) => spots[spotId]?.coordinates)
        .filter((value): value is [number, number] => Boolean(value)),
    },
  };
};
