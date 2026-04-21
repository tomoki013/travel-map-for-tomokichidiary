import { describe, expect, it } from "vitest";

import { destinationCatalog } from "@/data/catalog";
import {
  MOCK_COUNTRIES,
  MOCK_REGIONS,
  MOCK_SPOTS,
  MOCK_TRIPS,
} from "@/data/mockData";
import {
  getCountryByIsoAlpha2,
  getRegionCountryIsoCodes,
  getTripCountryIsoCodes,
  getVisitedCountryIsoCodes,
} from "@/data/selectors";

const catalogCountryIds = new Set(
  destinationCatalog.flatMap((continent) =>
    continent.countries.map((country) => country.id),
  ),
);

const catalogRegionIds = new Set(
  destinationCatalog.flatMap((continent) =>
    continent.countries.flatMap((country) =>
      country.regions.map((region) => region.id),
    ),
  ),
);

describe("mock travel data", () => {
  it("maps all trip spots to canonical spot definitions", () => {
    Object.values(MOCK_TRIPS).forEach((trip) => {
      trip.spots.forEach((spotId) => {
        expect(MOCK_SPOTS[spotId], `${trip.id} -> ${spotId}`).toBeDefined();
      });

      trip.itineraries?.forEach((itinerary) => {
        itinerary.spots.forEach((spotId) => {
          expect(MOCK_SPOTS[spotId], `${trip.id} -> ${itinerary.title} -> ${spotId}`).toBeDefined();
        });
      });
    });
  });

  it("keeps every spot attached to a defined region and remote image", () => {
    Object.values(MOCK_SPOTS).forEach((spot) => {
      expect(catalogRegionIds.has(spot.regionSlug), spot.id).toBe(true);
      expect(MOCK_REGIONS[spot.regionSlug], spot.id).toBeDefined();
      expect(spot.imageUrl, spot.id).toMatch(/^https:\/\/tomokichidiary\.com\/images\//);
    });
  });

  it("keeps country and region catalogs in sync with generated data", () => {
    Object.values(MOCK_COUNTRIES).forEach((country) => {
      expect(catalogCountryIds.has(country.id), country.id).toBe(true);
      expect(country.isoAlpha2, country.id).toMatch(/^[A-Z]{2}$/);
      country.regions.forEach((regionId) => {
        expect(MOCK_REGIONS[regionId], `${country.id} -> ${regionId}`).toBeDefined();
      });
    });
  });

  it("reuses canonical spots across trips", () => {
    expect(MOCK_SPOTS["wat-arun"]).toBeDefined();
    expect(MOCK_SPOTS["wat-arun-transit"]).toBeUndefined();

    const bangkokTrip = MOCK_TRIPS["bangkok-trip-2024"];
    const transcontinentalTrip = MOCK_TRIPS["transcontinental-trip-2025"];

    expect(bangkokTrip.spots).toContain("wat-pho");
    expect(transcontinentalTrip.spots).toContain("wat-pho");
  });

  it("surfaces newly populated regions in the region catalog", () => {
    expect(MOCK_REGIONS.istanbul.isListed).toBe(true);
    expect(MOCK_REGIONS.incheon.isListed).toBe(true);
    expect(MOCK_REGIONS.istanbul.spots.length).toBeGreaterThan(0);
    expect(MOCK_REGIONS.incheon.spots.length).toBeGreaterThan(0);
  });

  it("derives visited and trip country ISO codes for polygon highlighting", () => {
    const visitedCountryIsoCodes = getVisitedCountryIsoCodes();
    expect(visitedCountryIsoCodes).toContain("TH");
    expect(visitedCountryIsoCodes).toContain("FR");
    expect(visitedCountryIsoCodes).toContain("EG");

    const tripCountryIsoCodes = getTripCountryIsoCodes(
      MOCK_TRIPS["transcontinental-trip-2025"],
    );

    expect(tripCountryIsoCodes).toEqual(
      expect.arrayContaining(["TH", "TR", "EG", "GR"]),
    );
    expect(new Set(tripCountryIsoCodes).size).toBe(tripCountryIsoCodes.length);
  });

  it("supports region mode country highlighting lookups", () => {
    expect(getCountryByIsoAlpha2("TH")?.id).toBe("thailand");
    expect(getCountryByIsoAlpha2("FR")?.id).toBe("france");
    expect(getCountryByIsoAlpha2("XX")).toBeNull();

    expect(getRegionCountryIsoCodes(null, null)).toEqual(
      expect.arrayContaining(["TH", "FR", "EG"]),
    );
    expect(getRegionCountryIsoCodes("thailand", null)).toEqual(["TH"]);
    expect(getRegionCountryIsoCodes("thailand", "bangkok")).toEqual([]);
  });
});
