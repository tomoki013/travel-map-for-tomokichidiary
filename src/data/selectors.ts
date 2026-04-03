import { Country, Region, Spot, Trip } from "@/types/data";
import {
  MOCK_COUNTRIES,
  MOCK_REGIONS,
  MOCK_SPOTS,
  MOCK_TRIPS,
} from "@/data/mockData";

export const getCountryById = (countryId: string | null | undefined) => {
  return countryId ? MOCK_COUNTRIES[countryId] ?? null : null;
};

export const getRegionById = (regionId: string | null | undefined) => {
  return regionId ? MOCK_REGIONS[regionId] ?? null : null;
};

export const getSpotById = (spotId: string | null | undefined) => {
  return spotId ? MOCK_SPOTS[spotId] ?? null : null;
};

export const getTripById = (tripId: string | null | undefined) => {
  return tripId ? MOCK_TRIPS[tripId] ?? null : null;
};

export const getListedCountries = (): Country[] => {
  return Object.values(MOCK_COUNTRIES).filter((country) => country.isListed);
};

export const getListedRegionsByCountry = (countryId: string): Region[] => {
  const country = getCountryById(countryId);
  if (!country) {
    return [];
  }

  return country.regions
    .map((regionId) => MOCK_REGIONS[regionId])
    .filter((region): region is Region => Boolean(region?.isListed));
};

export const getCountryForRegion = (regionId: string): Country | null => {
  const region = getRegionById(regionId);
  return region ? getCountryById(region.countryId) : null;
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
      .map((spotId) => MOCK_SPOTS[spotId])
      .filter((spot): spot is Spot => Boolean(spot)),
    isReady: region.status === "ready",
  };
};

export const getTripSpots = (trip: Trip): Spot[] => {
  return trip.spots
    .map((spotId) => MOCK_SPOTS[spotId])
    .filter((spot): spot is Spot => Boolean(spot));
};

export const isTripReady = (trip: Trip): boolean => {
  return getTripSpots(trip).length > 0;
};

const getTripSortKey = (trip: Trip): string => {
  return trip.date.split("~")[0] ?? trip.date;
};

export const getTripsSortedByDate = (): Trip[] => {
  return Object.values(MOCK_TRIPS).sort((a, b) =>
    getTripSortKey(a).localeCompare(getTripSortKey(b)),
  );
};
