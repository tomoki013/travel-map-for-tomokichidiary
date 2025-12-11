import { Spot, Trip, Region, Country, SpotSource, RegionSource, CountrySource, TripSource } from '@/types/data';

// --- Source Data Definitions ---

const JAPAN: CountrySource = {
  id: 'japan',
  name: 'Japan',
  description: 'Land of the rising sun.',
  center: [138, 36],
  zoom: 4,
};

const FRANCE: CountrySource = {
  id: 'france',
  name: 'France',
  description: 'Art, culture, and cuisine.',
  center: [2.2137, 46.2276],
  zoom: 5,
};

const KYOTO_PREF: RegionSource = {
  id: 'kyoto-pref',
  name: 'Kyoto',
  description: 'The cultural capital of Japan.',
  center: [135.7556, 35.0211],
  zoom: 10,
  country: JAPAN,
};

const NARA_PREF: RegionSource = {
  id: 'nara-pref',
  name: 'Nara',
  description: 'Ancient capital with deer and temples.',
  center: [135.8398, 34.6850], // Near Todai-ji
  zoom: 11,
  country: JAPAN,
};

// Data is described for each itinerary, adding places, and putting region and country info there.
const TRIPS_SOURCE: TripSource[] = [
  {
    id: 'kyoto-2024',
    title: 'Autumn in Kyoto',
    date: '2024.11',
    thumbnail: '/images/kyoto-thumb.jpg',
    itineraries: [
      {
        title: "Day 1: Historic Temples",
        spots: [
          {
            id: 'kiyomizu-dera',
            name: 'Kiyomizu-dera',
            description: 'A historic temple known for its wooden stage and cherry blossoms.',
            coordinates: [135.7850, 34.9949],
            camera: { zoom: 16, pitch: 60, bearing: 45 },
            region: KYOTO_PREF,
          },
          {
            id: 'kinkaku-ji',
            name: 'Kinkaku-ji',
            description: 'The Golden Pavilion, a Zen temple covered in gold leaf.',
            coordinates: [135.7292, 35.0394],
            camera: { zoom: 16, pitch: 50, bearing: -30 },
            region: KYOTO_PREF,
          }
        ]
      },
      {
        title: "Day 2: Shrine Walk",
        spots: [
          {
            id: 'fushimi-inari',
            name: 'Fushimi Inari Taisha',
            description: 'Famous for its thousands of vermilion torii gates.',
            coordinates: [135.7727, 34.9671],
            camera: { zoom: 16, pitch: 55, bearing: 90 },
            region: KYOTO_PREF,
          },
          {
            id: 'arashiyama',
            name: 'Arashiyama Bamboo Grove',
            description: 'A mesmerizing grove of towering bamboo stalks.',
            coordinates: [135.6720, 35.0094],
            camera: { zoom: 16, pitch: 45, bearing: 0 },
            region: KYOTO_PREF,
          }
        ]
      }
    ]
  },
  {
    id: 'nara-day-trip',
    title: 'Day Trip to Nara',
    date: '2024.11',
    thumbnail: '/images/nara-thumb.jpg',
    itineraries: [
      {
        title: "Day 1",
        spots: [
          {
            id: 'todai-ji',
            name: 'Todai-ji',
            description: 'A large temple complex with the Great Buddha Hall.',
            coordinates: [135.8398, 34.6889],
            camera: { zoom: 16, pitch: 60, bearing: 180 },
            region: NARA_PREF,
          },
          {
            id: 'nara-park',
            name: 'Nara Park',
            description: 'A park famous for its free-roaming deer.',
            coordinates: [135.8430, 34.6850], // Center for Park
            camera: { zoom: 15, pitch: 30, bearing: 0 },
            region: NARA_PREF,
          }
        ]
      }
    ]
  }
];


// --- Generator Logic ---

const generateData = () => {
  const spotsMock: Record<string, Spot> = {};
  const regionsMock: Record<string, Region> = {};
  const countriesMock: Record<string, Country> = {};
  const tripsMock: Record<string, Trip> = {};

  // Initialize with known countries (even if no spots yet, e.g. France)
  // Since we only generate from trips, if France is not in any trip, it won't be generated automatically
  // unless we explicitly add it. The original mock had France empty.
  // We can add it manually to the regions/countries maps if needed, 
  // or simple ensure 'countriesMock' is pre-populated if we want 'France' there.
  // For now, let's rely on the requested "generate from place data" logic.
  // But to preserve 'France' which has no spots:
  countriesMock[FRANCE.id] = { ...FRANCE, regions: [] };

  TRIPS_SOURCE.forEach(tripSource => {
    const tripSpotIds: string[] = [];
    const tripItineraries: { title: string; spots: string[] }[] = [];

    tripSource.itineraries.forEach(itinerary => {
      const daySpotIds: string[] = [];

      itinerary.spots.forEach(sourceSpot => {
        // 1. Add Spot
        const { region, ...spotData } = sourceSpot;
        spotsMock[sourceSpot.id] = spotData;
        daySpotIds.push(sourceSpot.id);
        tripSpotIds.push(sourceSpot.id);

        // 2. Add Region
        const regionSource = sourceSpot.region;
        if (!regionsMock[regionSource.id]) {
          regionsMock[regionSource.id] = {
            id: regionSource.id,
            name: regionSource.name,
            description: regionSource.description,
            center: regionSource.center,
            zoom: regionSource.zoom,
            spots: [],
          };
        }
        // Add spot to region if not already present
        if (!regionsMock[regionSource.id].spots.includes(sourceSpot.id)) {
          regionsMock[regionSource.id].spots.push(sourceSpot.id);
        }

        // 3. Add Country
        const countrySource = regionSource.country;
        if (!countriesMock[countrySource.id]) {
          countriesMock[countrySource.id] = {
            id: countrySource.id,
            name: countrySource.name,
            description: countrySource.description,
            center: countrySource.center,
            zoom: countrySource.zoom,
            regions: [],
          };
        }
        // Add region to country if not already present
        if (!countriesMock[countrySource.id].regions.includes(regionSource.id)) {
          countriesMock[countrySource.id].regions.push(regionSource.id);
        }
      });

      tripItineraries.push({
        title: itinerary.title,
        spots: daySpotIds,
      });
    });

    // 4. Add Trip
    tripsMock[tripSource.id] = {
      id: tripSource.id,
      title: tripSource.title,
      date: tripSource.date,
      thumbnail: tripSource.thumbnail,
      spots: tripSpotIds,
      itineraries: tripItineraries,
    };
  });

  return { spotsMock, regionsMock, countriesMock, tripsMock };
};

const { spotsMock, regionsMock, countriesMock, tripsMock } = generateData();

export const MOCK_SPOTS = spotsMock;
export const MOCK_REGIONS = regionsMock;
export const MOCK_COUNTRIES = countriesMock;
export const MOCK_TRIPS = tripsMock;
