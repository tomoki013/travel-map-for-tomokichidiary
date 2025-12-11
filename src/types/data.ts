export interface Spot {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  regionSlug: string;
  coordinates: [number, number]; // [lng, lat]
  
  // Camera settings for Scrollytelling
  camera: {
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

export interface Region {
  id: string;
  name: string;
  description?: string;
  center: [number, number];
  zoom: number; // default zoom for this region
  spots: string[]; // List of Spot IDs
}

export interface Country {
  id: string;
  name: string;
  description?: string;
  center: [number, number];
  zoom: number; // default zoom for this country
  regions: string[]; // List of Region IDs
}

export interface Trip {
  id: string;
  title: string;
  date: string; // e.g., "2024.11"
  thumbnail?: string;
  spots: string[]; // Ordered list of Spot IDs
  itineraries?: {
    title: string;
    spots: string[]; // List of Spot IDs for this specific itinerary/day
  }[];
}

// Source Types for hierarchical definition
export interface CountrySource {
  id: string;
  name: string;
  description?: string;
  center: [number, number];
  zoom: number;
}

export interface RegionSource {
  id: string;
  name: string;
  description?: string;
  center: [number, number];
  zoom: number;
  country: CountrySource;
}

export interface SpotSource extends Omit<Spot, 'id'> {
  id: string;
  region: RegionSource;
}

export interface ItinerarySource {
  title: string;
  spots: SpotSource[];
}

export interface TripSource extends Omit<Trip, 'spots' | 'itineraries'> {
  itineraries: ItinerarySource[];
}
