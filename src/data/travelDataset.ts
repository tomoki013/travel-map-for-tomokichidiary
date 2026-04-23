import { destinationCatalog } from "../../content/data/catalog";
import { COORDINATES } from "../../content/data/coordinates";
import { SPOTS_SOURCE, TRIPS_SOURCE } from "../../content/data/tripData";
import { RawCoordinateEntry, RawTravelDataset } from "@/types/rawData";

const invariant = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(`Travel dataset validation failed: ${message}`);
  }
};

const isCoordinateEntry = (value: unknown): value is RawCoordinateEntry => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<RawCoordinateEntry>;
  return (
    Array.isArray(entry.center) &&
    entry.center.length === 2 &&
    entry.center.every((item) => typeof item === "number") &&
    typeof entry.zoom === "number"
  );
};

const validateDataset = (dataset: RawTravelDataset) => {
  const countryIds = new Set<string>();
  const regionIds = new Set<string>();
  const spotIds = new Set<string>();
  const tripIds = new Set<string>();

  dataset.catalog.forEach((continent) => {
    invariant(continent.id, "continent id is required");
    invariant(continent.name, `continent ${continent.id} is missing name`);

    continent.countries.forEach((country) => {
      invariant(country.id, "country id is required");
      invariant(!countryIds.has(country.id), `duplicate country id "${country.id}"`);
      invariant(/^[A-Z]{2}$/.test(country.isoAlpha2), `country ${country.id} has invalid isoAlpha2`);
      invariant(
        isCoordinateEntry(dataset.coordinates[country.id]),
        `country ${country.id} is missing coordinates`,
      );
      countryIds.add(country.id);

      country.regions.forEach((region) => {
        invariant(region.id, `country ${country.id} has region without id`);
        invariant(!regionIds.has(region.id), `duplicate region id "${region.id}"`);
        invariant(
          isCoordinateEntry(dataset.coordinates[region.id]),
          `region ${region.id} is missing coordinates`,
        );
        regionIds.add(region.id);
      });
    });
  });

  Object.entries(dataset.spots).forEach(([spotId, spot]) => {
    invariant(spot.id === spotId, `spot key/id mismatch for "${spotId}"`);
    invariant(!spotIds.has(spotId), `duplicate spot id "${spotId}"`);
    invariant(regionIds.has(spot.regionSlug), `spot ${spotId} references unknown region "${spot.regionSlug}"`);
    invariant(
      Array.isArray(spot.coordinates) &&
        spot.coordinates.length === 2 &&
        spot.coordinates.every((item) => typeof item === "number"),
      `spot ${spotId} has invalid coordinates`,
    );
    invariant(
      typeof spot.camera.zoom === "number" &&
        typeof spot.camera.pitch === "number" &&
        typeof spot.camera.bearing === "number",
      `spot ${spotId} has invalid camera settings`,
    );
    spotIds.add(spotId);
  });

  dataset.trips.forEach((trip) => {
    invariant(trip.id, "trip id is required");
    invariant(!tripIds.has(trip.id), `duplicate trip id "${trip.id}"`);
    invariant(Array.isArray(trip.itineraries), `trip ${trip.id} itineraries must be an array`);

    trip.itineraries.forEach((itinerary, index) => {
      invariant(itinerary.title, `trip ${trip.id} itinerary ${index} is missing title`);
      itinerary.spots.forEach((spotId) => {
        invariant(dataset.spots[spotId], `trip ${trip.id} references unknown spot "${spotId}"`);
      });
    });

    tripIds.add(trip.id);
  });
};

export const travelDataset: RawTravelDataset = {
  catalog: destinationCatalog,
  coordinates: COORDINATES,
  spots: SPOTS_SOURCE,
  trips: TRIPS_SOURCE,
};

validateDataset(travelDataset);
