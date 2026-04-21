import { destinationCatalog } from "@/data/catalog";
import { getCoordinates } from "@/data/coordinates";
import { SPOTS_SOURCE, TRIPS_SOURCE } from "@/data/tripData";
import { Country, Region, Spot, Trip } from "@/types/data";

const generateData = () => {
  const regionsMock: Record<string, Region> = {};
  const countriesMock: Record<string, Country> = {};
  const spotsMock: Record<string, Spot> = { ...SPOTS_SOURCE };
  const tripsMock: Record<string, Trip> = {};

  destinationCatalog.forEach((continent) => {
    continent.countries.forEach((country) => {
      const countryCoords = getCoordinates(country.id);
      const regionIds: string[] = [];

      country.regions.forEach((region) => {
        const regionCoords = getCoordinates(region.id);
        regionIds.push(region.id);

        regionsMock[region.id] = {
          id: region.id,
          name: region.name,
          countryId: country.id,
          center: regionCoords.center,
          zoom: regionCoords.zoom,
          spots: [],
          status: "coming-soon",
          isListed: region.isListed,
        };
      });

      countriesMock[country.id] = {
        id: country.id,
        name: country.name,
        isoAlpha2: country.isoAlpha2,
        continentId: continent.id,
        center: countryCoords.center,
        zoom: countryCoords.zoom,
        regions: regionIds,
        isListed: country.isListed,
      };
    });
  });

  TRIPS_SOURCE.forEach((tripSource) => {
    const tripSpotIds: string[] = [];
    const tripItineraries: { title: string; spots: string[] }[] = [];

    tripSource.itineraries.forEach((itinerary) => {
      const daySpotIds: string[] = [];

      itinerary.spots.forEach((spotId) => {
        const sourceSpot = SPOTS_SOURCE[spotId];
        if (!sourceSpot) {
          console.warn(`Spot ${spotId} not found for trip ${tripSource.id}`);
          return;
        }

        if (!daySpotIds.includes(spotId)) {
          daySpotIds.push(spotId);
        }

        if (!tripSpotIds.includes(spotId)) {
          tripSpotIds.push(spotId);
        }

        const regionSlug = sourceSpot.regionSlug;
        if (!regionsMock[regionSlug]) {
          console.warn(`Region ${regionSlug} not found for spot ${spotId}`);
          return;
        }

        if (!regionsMock[regionSlug].spots.includes(spotId)) {
          regionsMock[regionSlug].spots.push(spotId);
          regionsMock[regionSlug].status = "ready";
        }
      });

      tripItineraries.push({
        title: itinerary.title,
        spots: daySpotIds,
      });
    });

    tripsMock[tripSource.id] = {
      id: tripSource.id,
      title: tripSource.title,
      date: tripSource.date,
      thumbnail: tripSource.thumbnail,
      spots: tripSpotIds,
      itineraries: tripItineraries,
    };
  });

  return { regionsMock, countriesMock, spotsMock, tripsMock };
};

const { regionsMock, countriesMock, spotsMock, tripsMock } = generateData();

export const MOCK_SPOTS = spotsMock;
export const MOCK_REGIONS = regionsMock;
export const MOCK_COUNTRIES = countriesMock;
export const MOCK_TRIPS = tripsMock;
