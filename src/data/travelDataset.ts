import { destinationCatalog } from "../../content/data/catalog";
import { COORDINATES } from "../../content/data/coordinates";
import { SPOTS_SOURCE, TRIPS_SOURCE } from "../../content/data/tripData";
import { RawCoordinateEntry, RawTravelDataset } from "@/types/rawData";

const assert = (condition: unknown, message: string): asserts condition => {
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
    assert(continent.id, "continent id is required");
    assert(continent.name, `continent ${continent.id} is missing name`);

    continent.countries.forEach((country) => {
      assert(country.id, "country id is required");
      assert(!countryIds.has(country.id), `duplicate country id "${country.id}"`);
      assert(/^[A-Z]{2}$/.test(country.isoAlpha2), `country ${country.id} has invalid isoAlpha2`);
      assert(
        isCoordinateEntry(dataset.coordinates[country.id]),
        `country ${country.id} is missing coordinates`,
      );
      countryIds.add(country.id);

      country.regions.forEach((region) => {
        assert(region.id, `country ${country.id} has region without id`);
        assert(!regionIds.has(region.id), `duplicate region id "${region.id}"`);
        assert(
          isCoordinateEntry(dataset.coordinates[region.id]),
          `region ${region.id} is missing coordinates`,
        );
        regionIds.add(region.id);
      });
    });
  });

  Object.entries(dataset.spots).forEach(([spotId, spot]) => {
    assert(spot.id === spotId, `spot key/id mismatch for "${spotId}"`);
    assert(!spotIds.has(spotId), `duplicate spot id "${spotId}"`);
    assert(regionIds.has(spot.regionSlug), `spot ${spotId} references unknown region "${spot.regionSlug}"`);
    assert(
      Array.isArray(spot.coordinates) &&
        spot.coordinates.length === 2 &&
        spot.coordinates.every((item) => typeof item === "number"),
      `spot ${spotId} has invalid coordinates`,
    );
    assert(
      typeof spot.camera.zoom === "number" &&
        typeof spot.camera.pitch === "number" &&
        typeof spot.camera.bearing === "number",
      `spot ${spotId} has invalid camera settings`,
    );
    spotIds.add(spotId);
  });

  dataset.trips.forEach((trip) => {
    assert(trip.id, "trip id is required");
    assert(!tripIds.has(trip.id), `duplicate trip id "${trip.id}"`);
    assert(Array.isArray(trip.itineraries), `trip ${trip.id} itineraries must be an array`);

    trip.itineraries.forEach((itinerary, index) => {
      assert(itinerary.title, `trip ${trip.id} itinerary ${index} is missing title`);
      itinerary.spots.forEach((spotId) => {
        assert(dataset.spots[spotId], `trip ${trip.id} references unknown spot "${spotId}"`);
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
