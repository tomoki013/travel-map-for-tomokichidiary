import { Country, Region, Spot, Trip } from "@/types/data";
import { travelDataset } from "@/data/travelDataset";

export interface TravelIndex {
  countries: Record<string, Country>;
  regions: Record<string, Region>;
  spots: Record<string, Spot>;
  trips: Record<string, Trip>;
}

const buildTravelIndex = (): TravelIndex => {
  const countries: Record<string, Country> = {};
  const regions: Record<string, Region> = {};
  const spots: Record<string, Spot> = { ...travelDataset.spots };
  const trips: Record<string, Trip> = {};

  travelDataset.catalog.forEach((continent) => {
    continent.countries.forEach((country) => {
      const regionIds = country.regions.map((region) => region.id);

      countries[country.id] = {
        id: country.id,
        name: country.name,
        isoAlpha2: country.isoAlpha2,
        description: undefined,
        continentId: continent.id,
        center: travelDataset.coordinates[country.id].center,
        zoom: travelDataset.coordinates[country.id].zoom,
        regions: regionIds,
        isListed: country.isListed,
      };

      country.regions.forEach((region) => {
        regions[region.id] = {
          id: region.id,
          name: region.name,
          description: undefined,
          countryId: country.id,
          center: travelDataset.coordinates[region.id].center,
          zoom: travelDataset.coordinates[region.id].zoom,
          spots: [],
          status: "coming-soon",
          isListed: region.isListed,
        };
      });
    });
  });

  travelDataset.trips.forEach((tripSource) => {
    const tripSpotIds: string[] = [];
    const itineraries = tripSource.itineraries.map((itinerary) => {
      const daySpotIds: string[] = [];

      itinerary.spots.forEach((spotId) => {
        if (!daySpotIds.includes(spotId)) {
          daySpotIds.push(spotId);
        }

        if (!tripSpotIds.includes(spotId)) {
          tripSpotIds.push(spotId);
        }

        const region = regions[spots[spotId].regionSlug];
        if (!region.spots.includes(spotId)) {
          region.spots.push(spotId);
          region.status = "ready";
        }
      });

      return {
        title: itinerary.title,
        spots: daySpotIds,
      };
    });

    trips[tripSource.id] = {
      id: tripSource.id,
      title: tripSource.title,
      date: tripSource.date,
      thumbnail: tripSource.thumbnail,
      spots: tripSpotIds,
      itineraries,
    };
  });

  return { countries, regions, spots, trips };
};

export const travelIndex = buildTravelIndex();
export const { countries, regions, spots, trips } = travelIndex;
