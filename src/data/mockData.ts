import { Spot, Trip, Region, Country } from '@/types/data';

export interface RegionItem {
  slug: string;
  name: string;
  imageURL: string;
}

export interface CountryItem {
  slug: string;
  name: string;
  imageURL: string;
  children: RegionItem[];
}

export interface ContinentData {
  slug: string;
  name: string;
  countries: CountryItem[];
}

export const regionData: ContinentData[] = [
  {
    slug: "asia",
    name: "アジア",
    countries: [
      {
        slug: "japan",
        name: "日本",
        imageURL: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
        children: [
          {
            slug: "kyoto",
            name: "京都",
            imageURL: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
          },
          { slug: "osaka", name: "大阪", imageURL: "/images/Osaka/" },
          {
            slug: "hokkaido",
            name: "北海道",
            imageURL: "/images/Hokkaido/otaru-canal.jpg",
          },
        ],
      },
      {
        slug: "south korea",
        name: "韓国",
        imageURL: "/images/Korea/monument.jpg",
        children: [
          {
            slug: "soul",
            name: "ソウル",
            imageURL: "/images/Korea/monument.jpg",
          },
          {
            slug: "incheon",
            name: "仁川",
            imageURL: "/images/Korea/monument.jpg", // Using placeholder
          },
        ],
      },
      {
        slug: "china",
        name: "中国",
        imageURL: "/images/China/shanghai.jpg", // Placeholder
        children: [
          {
            slug: "shanghai",
            name: "上海",
            imageURL: "/images/China/shanghai.jpg", // Placeholder
          },
        ],
      },
      {
        slug: "india",
        name: "インド",
        imageURL: "/images/India/tajmahal.jpg",
        children: [
          {
            slug: "new-delhi",
            name: "ニューデリー",
            imageURL: "/images/India/indian-gate-at-noon.jpg",
          },
          {
            slug: "agra",
            name: "アグラ",
            imageURL: "/images/India/tajmahal.jpg",
          },
          {
            slug: "jaipur",
            name: "ジャイプル",
            imageURL: "/images/India/hawa-mahal.jpg",
          },
          {
            slug: "varanasi",
            name: "バラナシ",
            imageURL: "/images/India/festival-of-ganga3.jpg",
          },
        ],
      },
      {
        slug: "thailand",
        name: "タイ",
        imageURL: "/images/Thai/emotional-wat-arun.jpg",
        children: [
          {
            slug: "bangkok",
            name: "バンコク",
            imageURL: "/images/Thai/ceiling-at-wat-pak-nam.jpg",
          },
        ],
      },
      {
        slug: "vietnam",
        name: "ベトナム",
        imageURL: "/images/Vietnam/vietnam-old-town2.jpg",
        children: [
          {
            slug: "hanoi",
            name: "ハノイ",
            imageURL: "/images/Vietnam/vietnam-old-town2.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "europe",
    name: "ヨーロッパ",
    countries: [
      {
        slug: "france",
        name: "フランス",
        imageURL: "/images/France/eiffel-tower-and-sunset.jpg",
        children: [
          {
            slug: "paris",
            name: "パリ",
            imageURL: "/images/France/louvre-museum1.jpg",
          },
        ],
      },
      {
        slug: "spain",
        name: "スペイン",
        imageURL: "/images/Spain/las-ventas-bullring.jpg",
        children: [
          {
            slug: "barcelona",
            name: "バルセロナ",
            imageURL: "/images/Spain/sagrada-familia.jpg",
          },
          {
            slug: "madrid",
            name: "マドリード",
            imageURL: "/images/Spain/plaza-de-mayor.jpg",
          },
          {
            slug: "toledo",
            name: "トレド",
            imageURL: "/images/Spain/toledo-view.jpg",
          },
        ],
      },
      {
        slug: "belgium",
        name: "ベルギー",
        imageURL: "/images/Belgium/galeries-royales-saint-hubert.jpg",
        children: [
          {
            slug: "brussels",
            name: "ブリュッセル",
            imageURL: "/images/Belgium/galeries-royales-saint-hubert.jpg",
          },
        ],
      },
      {
        slug: "greece",
        name: "ギリシャ",
        imageURL: "/images/Greece/oia-castle-sunset-view.jpg",
        children: [
          {
            slug: "santorini",
            name: "サントリーニ",
            imageURL: "/images/Greece/santorini-view.jpg",
          },
          {
            slug: "athens",
            name: "アテネ",
            imageURL: "/images/Greece/parthenon.jpg",
          },
        ],
      },
      {
        slug: "turkey",
        name: "トルコ",
        imageURL: "/images/Turkey/balloons-in-cappadocia.jpg",
        children: [
          {
            slug: "cappadocia",
            name: "カッパドキア",
            imageURL: "/images/Turkey/balloons-in-cappadocia.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "africa",
    name: "アフリカ",
    countries: [
      {
        slug: "egypt",
        name: "エジプト",
        imageURL:
          "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
        children: [
          {
            slug: "cairo",
            name: "カイロ",
            imageURL:
              "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
          },
          {
            slug: "giza",
            name: "ギザ",
            imageURL:
              "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
          },
          {
            slug: "abu-simbel",
            name: "アブシンベル",
            imageURL: "/images/Egypt/abusimbel-temple.jpg",
          },
          {
            slug: "aswan",
            name: "アスワン",
            imageURL: "/images/Egypt/aswan-view.jpg",
          },
        ],
      },
    ],
  },
];

// Coordinate Mapping (Approximate centers)
const COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  // Countries
  "japan": { center: [138, 36], zoom: 4 },
  "south korea": { center: [127.7669, 35.9078], zoom: 6 },
  "china": { center: [104.1954, 35.8617], zoom: 4 },
  "india": { center: [78.9629, 20.5937], zoom: 4 },
  "thailand": { center: [100.9925, 15.8700], zoom: 5 },
  "vietnam": { center: [108.2772, 14.0583], zoom: 5 },
  "france": { center: [2.2137, 46.2276], zoom: 5 },
  "spain": { center: [-3.7492, 40.4637], zoom: 5 },
  "belgium": { center: [4.4699, 50.5039], zoom: 7 },
  "greece": { center: [21.8243, 39.0742], zoom: 6 },
  "turkey": { center: [35.2433, 38.9637], zoom: 5 },
  "egypt": { center: [30.8025, 26.8206], zoom: 5 },

  // Regions/Cities
  "kyoto": { center: [135.7681, 35.0116], zoom: 10 },
  "osaka": { center: [135.5023, 34.6937], zoom: 10 },
  "hokkaido": { center: [141.3545, 43.0618], zoom: 6 }, // Sapporo/Otaru area
  "soul": { center: [126.9780, 37.5665], zoom: 10 },
  "incheon": { center: [126.7052, 37.4563], zoom: 11 },
  "shanghai": { center: [121.4737, 31.2304], zoom: 10 },
  "new-delhi": { center: [77.2090, 28.6139], zoom: 10 },
  "agra": { center: [78.0081, 27.1767], zoom: 11 },
  "jaipur": { center: [75.7873, 26.9124], zoom: 11 },
  "varanasi": { center: [82.9739, 25.3176], zoom: 11 },
  "bangkok": { center: [100.5018, 13.7563], zoom: 10 },
  "hanoi": { center: [105.8342, 21.0278], zoom: 11 },
  "paris": { center: [2.3522, 48.8566], zoom: 11 },
  "barcelona": { center: [2.1686, 41.3874], zoom: 11 },
  "madrid": { center: [-3.7038, 40.4168], zoom: 11 },
  "toledo": { center: [-4.0273, 39.8628], zoom: 12 },
  "brussels": { center: [4.3517, 50.8503], zoom: 11 },
  "santorini": { center: [25.4317, 36.3932], zoom: 11 },
  "athens": { center: [23.7275, 37.9838], zoom: 11 },
  "cappadocia": { center: [34.8435, 38.6431], zoom: 9 }, // Göreme area
  "cairo": { center: [31.2357, 30.0444], zoom: 10 },
  "giza": { center: [31.1303, 29.9792], zoom: 11 },
  "abu-simbel": { center: [31.6255, 22.3372], zoom: 13 },
  "aswan": { center: [32.8998, 24.0889], zoom: 11 },
};

const getCoordinates = (slug: string) => {
  return COORDINATES[slug] || { center: [0, 0], zoom: 1 };
};

// Trip Data Definition
interface TripData {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  itineraries: {
    title: string;
    spots: {
      id: string;
      name: string;
      description: string;
      coordinates: [number, number];
      regionSlug: string;
      camera: { zoom: number; pitch: number; bearing: number };
    }[];
  }[];
}

const TRIPS_DATA: TripData[] = [
  {
    id: "bangkok-trip-2024",
    title: "タイ・バンコク2泊4日の旅程と総費用を大公開！",
    date: "2024.03",
    thumbnail: "/images/Thai/emotional-wat-arun.jpg",
    itineraries: [
      {
        title: "2024年3月1日（金）【バンコク着・観光】",
        spots: [
          {
            id: "suvarnabhumi-airport",
            name: "スワンナプーム国際空港",
            description: "タイの玄関口。ここから旅が始まります。",
            coordinates: [100.7501, 13.6900],
            regionSlug: "bangkok",
            camera: { zoom: 13, pitch: 45, bearing: 0 },
          },
          {
            id: "royal-river-hotel",
            name: "The Royal River Hotel",
            description: "チャオプラヤ川沿いのホテル。リバービューが楽しめます。",
            coordinates: [100.4950, 13.7850],
            regionSlug: "bangkok",
            camera: { zoom: 15, pitch: 60, bearing: 90 },
          },
        ],
      },
      {
        title: "2024年3月2日（土）【バンコク観光】",
        spots: [
          {
            id: "taling-chan-floating-market",
            name: "タリンチャン水上マーケット",
            description: "ローカルな雰囲気が楽しめる水上マーケット。",
            coordinates: [100.4564, 13.7764],
            regionSlug: "bangkok",
            camera: { zoom: 16, pitch: 50, bearing: 0 },
          },
          {
            id: "wat-arun",
            name: "ワット・アルン",
            description: "「暁の寺」として知られる、美しい仏塔が特徴の寺院。",
            coordinates: [100.4889, 13.7436],
            regionSlug: "bangkok",
            camera: { zoom: 17, pitch: 60, bearing: -45 },
          },
          {
            id: "khao-san-road",
            name: "カオサンロード",
            description: "バックパッカーの聖地。夜は賑やかな屋台街になります。",
            coordinates: [100.4972, 13.7589],
            regionSlug: "bangkok",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2024年3月3日（日）【観光】",
        spots: [
          {
            id: "wat-phra-kaew",
            name: "ワット・プラ・ケオ",
            description: "王宮の敷地内にある、エメラルド仏を祀る寺院。",
            coordinates: [100.4925, 13.7514],
            regionSlug: "bangkok",
            camera: { zoom: 16, pitch: 60, bearing: 0 },
          },
          {
            id: "wat-pho",
            name: "ワット・ポー",
            description: "巨大な寝釈迦仏で有名な、バンコク最古の寺院。",
            coordinates: [100.4936, 13.7464],
            regionSlug: "bangkok",
            camera: { zoom: 16, pitch: 50, bearing: 180 },
          },
          {
            id: "chatuchak-market",
            name: "チャトゥチャック市場",
            description: "週末限定の巨大マーケット。お土産探しに最適。",
            coordinates: [100.5508, 13.8005],
            regionSlug: "bangkok",
            camera: { zoom: 15, pitch: 40, bearing: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "europe-trip-2025",
    title: "ヨーロッパ13泊15日の旅程と総費用を大公開！",
    date: "2025.02",
    thumbnail: "/images/France/louvre-museum1.jpg",
    itineraries: [
      {
        title: "2025年2月13日（木）：韓国で乗り継ぎの一泊",
        spots: [
          {
            id: "incheon-airport",
            name: "仁川国際空港",
            description: "ソウルへの玄関口。",
            coordinates: [126.4406, 37.4602],
            regionSlug: "incheon",
            camera: { zoom: 12, pitch: 0, bearing: 0 },
          },
          {
            id: "stellar-hotel-yeongjong",
            name: "Stellar-Formerly International Hotel",
            description: "乗り継ぎのために宿泊したホテル。",
            coordinates: [126.494, 37.492], // Approx
            regionSlug: "incheon",
            camera: { zoom: 14, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年2月14日（金）：パリ到着",
        spots: [
          {
            id: "cdg-airport",
            name: "シャルル・ド・ゴール国際空港",
            description: "パリのメイン空港。",
            coordinates: [2.5479, 49.0097],
            regionSlug: "paris",
            camera: { zoom: 12, pitch: 0, bearing: 0 },
          },
          {
            id: "hotel-andre-latin",
            name: "Hotel Andre Latin",
            description: "カルチエ・ラタンにあるホテル。",
            coordinates: [2.3412, 48.8460],
            regionSlug: "paris",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "eiffel-tower",
            name: "エッフェル塔",
            description: "パリの象徴。",
            coordinates: [2.2945, 48.8584],
            regionSlug: "paris",
            camera: { zoom: 15, pitch: 60, bearing: 45 },
          },
        ],
      },
      {
        title: "2025年2月15日（土）：パリ市内観光",
        spots: [
          {
            id: "notre-dame-cathedral",
            name: "ノートルダム大聖堂",
            description: "ゴシック建築の最高傑作。",
            coordinates: [2.3499, 48.8530],
            regionSlug: "paris",
            camera: { zoom: 16, pitch: 45, bearing: -30 },
          },
          {
            id: "louvre-museum",
            name: "ルーブル美術館",
            description: "世界最大級の美術館。",
            coordinates: [2.3376, 48.8606],
            regionSlug: "paris",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "arc-de-triomphe",
            name: "凱旋門",
            description: "シャンゼリゼ通りの西端に位置する。",
            coordinates: [2.2950, 48.8738],
            regionSlug: "paris",
            camera: { zoom: 16, pitch: 60, bearing: 180 },
          },
        ],
      },
      {
        title: "2025年2月16日（日）：ベルサイユ宮殿",
        spots: [
          {
            id: "versailles-palace",
            name: "ベルサイユ宮殿",
            description: "豪華絢爛な宮殿と庭園。",
            coordinates: [2.1204, 48.8049],
            regionSlug: "paris", // Using Paris region for now
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年2月18日（火）：バルセロナへ移動",
        spots: [
          {
            id: "bcn-airport",
            name: "バルセロナ国際空港",
            description: "バルセロナへの空の玄関口。",
            coordinates: [2.0833, 41.2974],
            regionSlug: "barcelona",
            camera: { zoom: 12, pitch: 0, bearing: 0 },
          },
          {
            id: "best-western-dante",
            name: "Best Western Premier Hotel Dante",
            description: "アシャンプラ地区のホテル。",
            coordinates: [2.1550, 41.3900], // Approx
            regionSlug: "barcelona",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "casa-batllo",
            name: "カサ・バトリョ",
            description: "ガウディの代表作の一つ。",
            coordinates: [2.1649, 41.3917],
            regionSlug: "barcelona",
            camera: { zoom: 17, pitch: 60, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年2月19日（水）：サグラダ・ファミリア",
        spots: [
          {
            id: "sagrada-familia",
            name: "サグラダ・ファミリア",
            description: "未完の傑作聖堂。",
            coordinates: [2.1744, 41.4036],
            regionSlug: "barcelona",
            camera: { zoom: 16, pitch: 60, bearing: -45 },
          },
          {
            id: "barceloneta-beach",
            name: "バルセロネータビーチ",
            description: "地中海を感じるビーチ。",
            coordinates: [2.1930, 41.3784],
            regionSlug: "barcelona",
            camera: { zoom: 15, pitch: 30, bearing: 90 },
          },
        ],
      },
      {
        title: "2025年2月20日（木）：マドリードへ移動",
        spots: [
          {
            id: "sants-station",
            name: "バルセロナ・サンツ駅",
            description: "高速列車の発着駅。",
            coordinates: [2.1394, 41.3789],
            regionSlug: "barcelona",
            camera: { zoom: 15, pitch: 0, bearing: 0 },
          },
          {
            id: "atocha-station",
            name: "マドリード・アトーチャ駅",
            description: "植物園のような駅舎が特徴。",
            coordinates: [-3.6908, 40.4065],
            regionSlug: "madrid",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "petit-hostel-palacio-real",
            name: "Petit Hostel Palacio Real",
            description: "王宮近くのホステル。",
            coordinates: [-3.7140, 40.4200], // Approx
            regionSlug: "madrid",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年2月21日（金）：マドリード散策",
        spots: [
          {
            id: "prado-museum",
            name: "プラド美術館",
            description: "スペイン王家のコレクションを展示。",
            coordinates: [-3.6921, 40.4138],
            regionSlug: "madrid",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "retiro-park",
            name: "レティーロ公園",
            description: "広大な都市公園。",
            coordinates: [-3.6830, 40.4153],
            regionSlug: "madrid",
            camera: { zoom: 15, pitch: 30, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年2月22日（土）：マドリードの市場",
        spots: [
          {
            id: "san-miguel-market",
            name: "サン・ミゲル市場",
            description: "タパスが楽しめるおしゃれな市場。",
            coordinates: [-3.7088, 40.4154],
            regionSlug: "madrid",
            camera: { zoom: 17, pitch: 45, bearing: 0 },
          },
          {
            id: "royal-palace-madrid",
            name: "マドリード王宮",
            description: "ヨーロッパ最大級の王宮。",
            coordinates: [-3.7143, 40.4179],
            regionSlug: "madrid",
            camera: { zoom: 16, pitch: 45, bearing: 90 },
          },
        ],
      },
      {
        title: "2025年2月24日（月）：トレド日帰り",
        spots: [
          {
            id: "toledo-cathedral",
            name: "トレド大聖堂",
            description: "スペイン・カトリックの総本山。",
            coordinates: [-4.0245, 39.8571],
            regionSlug: "toledo",
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "mirador-del-valle",
            name: "ミラドール・デル・バイエ",
            description: "トレドの街を一望できる展望台。",
            coordinates: [-4.0150, 39.8480],
            regionSlug: "toledo",
            camera: { zoom: 15, pitch: 30, bearing: -45 },
          },
        ],
      },
      {
        title: "2025年2月25日（火）：ブリュッセルへ",
        spots: [
          {
            id: "brussels-airport",
            name: "ブリュッセル空港",
            description: "ベルギーの空の玄関。",
            coordinates: [4.4855, 50.9009],
            regionSlug: "brussels",
            camera: { zoom: 12, pitch: 0, bearing: 0 },
          },
          {
            id: "grand-place",
            name: "グラン・プラス",
            description: "世界で最も美しい広場の一つ。",
            coordinates: [4.3524, 50.8467],
            regionSlug: "brussels",
            camera: { zoom: 17, pitch: 45, bearing: 0 },
          },
        ],
      },
    ],
  },
];

const generateData = () => {
  const regionsMock: Record<string, Region> = {};
  const countriesMock: Record<string, Country> = {};
  const spotsMock: Record<string, Spot> = {};
  const tripsMock: Record<string, Trip> = {};
  
  // 1. Generate Regions and Countries from regionData
  regionData.forEach(continent => {
    continent.countries.forEach(country => {
      const countryCoords = getCoordinates(country.slug);
      
      const regionIds: string[] = [];
      
      country.children.forEach(region => {
        const regionCoords = getCoordinates(region.slug);
        
        regionIds.push(region.slug);
        
        regionsMock[region.slug] = {
          id: region.slug,
          name: region.name,
          center: regionCoords.center,
          zoom: regionCoords.zoom,
          spots: [] // Will be populated by trips
        };
      });

      countriesMock[country.slug] = {
        id: country.slug,
        name: country.name,
        center: countryCoords.center,
        zoom: countryCoords.zoom,
        regions: regionIds
      };
    });
  });

  // 2. Generate Spots and Trips from TRIPS_DATA
  TRIPS_DATA.forEach(tripSource => {
    const tripSpotIds: string[] = [];
    const tripItineraries: { title: string; spots: string[] }[] = [];

    tripSource.itineraries.forEach(itinerary => {
      const daySpotIds: string[] = [];

      itinerary.spots.forEach(sourceSpot => {
        // Add Spot
        spotsMock[sourceSpot.id] = {
            id: sourceSpot.id,
            name: sourceSpot.name,
            description: sourceSpot.description,
            coordinates: sourceSpot.coordinates,
            regionSlug: sourceSpot.regionSlug,
            camera: sourceSpot.camera
        };
        daySpotIds.push(sourceSpot.id);
        tripSpotIds.push(sourceSpot.id);

        // Link Spot to Region
        const regionSlug = sourceSpot.regionSlug;
        if (regionsMock[regionSlug]) {
            if (!regionsMock[regionSlug].spots.includes(sourceSpot.id)) {
                regionsMock[regionSlug].spots.push(sourceSpot.id);
            }
        } else {
            console.warn(`Region ${regionSlug} not found for spot ${sourceSpot.id}`);
        }
      });

      tripItineraries.push({
        title: itinerary.title,
        spots: daySpotIds,
      });
    });

    // Add Trip
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
