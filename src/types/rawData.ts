export interface RawRegionCatalogEntry {
  id: string;
  name: string;
  imageUrl?: string;
  isListed: boolean;
}

export interface RawCountryCatalogEntry {
  id: string;
  name: string;
  isoAlpha2: string;
  imageUrl?: string;
  isListed: boolean;
  regions: RawRegionCatalogEntry[];
}

export interface RawContinentCatalogEntry {
  id: string;
  name: string;
  countries: RawCountryCatalogEntry[];
}

export interface RawCoordinateEntry {
  center: [number, number];
  zoom: number;
}

export interface RawSpotRecord {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  regionSlug: string;
  coordinates: [number, number];
  isRegionVisible?: boolean;
  camera: {
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

export interface RawTripItinerary {
  title: string;
  spots: string[];
}

export interface RawTripRecord {
  id: string;
  title: string;
  date: string;
  thumbnail?: string;
  itineraries: RawTripItinerary[];
}

export interface RawTravelDataset {
  catalog: RawContinentCatalogEntry[];
  coordinates: Record<string, RawCoordinateEntry>;
  spots: Record<string, RawSpotRecord>;
  trips: RawTripRecord[];
}
