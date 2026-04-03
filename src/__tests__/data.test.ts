import { describe, expect, test } from "vitest";
import {
  MOCK_COUNTRIES,
  MOCK_REGIONS,
  MOCK_SPOTS,
  MOCK_TRIPS,
} from "@/data/mockData";
import {
  getCountryForRegion,
  getListedCountries,
  getListedRegionsByCountry,
  getRegionState,
  getTripSpots,
  getTripsSortedByDate,
} from "@/data/selectors";

describe("destination catalog", () => {
  test("adds listed regions from tomokichidiary destination", () => {
    expect(MOCK_COUNTRIES.japan).toBeDefined();
    expect(MOCK_COUNTRIES.malaysia).toBeDefined();
    expect(MOCK_COUNTRIES.singapore).toBeDefined();
    expect(MOCK_COUNTRIES.indonesia).toBeDefined();
    expect(MOCK_REGIONS.hokkaido).toBeDefined();
    expect(MOCK_REGIONS.shanghai).toBeDefined();
    expect(MOCK_REGIONS["kuala-lumpur"]).toBeDefined();
    expect(MOCK_REGIONS["singapore-city"]).toBeDefined();
    expect(MOCK_REGIONS.seminyak).toBeDefined();
    expect(MOCK_REGIONS.osaka.status).toBe("coming-soon");
  });

  test("keeps internal trip-only regions hidden from listed navigation", () => {
    const koreaRegions = getListedRegionsByCountry("south-korea").map(
      (region) => region.id,
    );

    expect(MOCK_REGIONS.incheon).toBeDefined();
    expect(MOCK_REGIONS.incheon.isListed).toBe(false);
    expect(koreaRegions).toContain("seoul");
    expect(koreaRegions).not.toContain("incheon");
  });

  test("resolves region to country and exposes ready state for populated regions", () => {
    expect(getCountryForRegion("bangkok")?.id).toBe("thailand");
    expect(getRegionState("bangkok")?.isReady).toBe(true);
    expect(getRegionState("osaka")?.isReady).toBe(false);
  });

  test("keeps current trips available", () => {
    expect(MOCK_TRIPS["bangkok-trip-2024"]).toBeDefined();
    expect(MOCK_TRIPS["europe-trip-2025"]).toBeDefined();
    expect(MOCK_TRIPS["hokkaido-trip-2024"]).toBeDefined();
    expect(MOCK_TRIPS["india-trip-2024"]).toBeDefined();
    expect(MOCK_TRIPS["transcontinental-trip-2025"]).toBeDefined();
    expect(MOCK_TRIPS["shanghai-trip-2025"]).toBeDefined();
    expect(MOCK_TRIPS["southeast-asia-trip-2026"]).toBeDefined();
    expect(Object.keys(MOCK_TRIPS)).toHaveLength(7);
    expect(getListedCountries().some((country) => country.id === "japan")).toBe(
      true,
    );
  });

  test("sorts trips by actual start date", () => {
    expect(getTripsSortedByDate().map((trip) => trip.id)).toEqual([
      "hokkaido-trip-2024",
      "bangkok-trip-2024",
      "india-trip-2024",
      "europe-trip-2025",
      "transcontinental-trip-2025",
      "shanghai-trip-2025",
      "southeast-asia-trip-2026",
    ]);
  });

  test("uses the same spot source for trip and region selectors", () => {
    const bangkokTripSpots = getTripSpots(MOCK_TRIPS["bangkok-trip-2024"]);

    expect(MOCK_SPOTS["wat-arun"]).toBeDefined();
    expect(bangkokTripSpots.some((spot) => spot.id === "wat-arun")).toBe(true);
    expect(MOCK_REGIONS.bangkok.spots).toContain("wat-arun");

    expect(MOCK_SPOTS["petronas-towers"]).toBeDefined();
    expect(MOCK_REGIONS["kuala-lumpur"].spots).not.toContain("petronas-towers");
  });
});
