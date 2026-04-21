import { resolveDiaryImageTree } from "@/data/imageUtils";

export interface RegionCatalogEntry {
  id: string;
  name: string;
  imageUrl?: string;
  isListed: boolean;
}

export interface CountryCatalogEntry {
  id: string;
  name: string;
  isoAlpha2: string;
  imageUrl?: string;
  isListed: boolean;
  regions: RegionCatalogEntry[];
}

export interface ContinentCatalogEntry {
  id: string;
  name: string;
  countries: CountryCatalogEntry[];
}

const rawDestinationCatalog: ContinentCatalogEntry[] = [
  {
    id: "asia",
    name: "アジア",
    countries: [
      {
        id: "japan",
        name: "日本",
        isoAlpha2: "JP",
        imageUrl: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
        isListed: true,
        regions: [
          {
            id: "kyoto",
            name: "京都",
            imageUrl: "/images/Kyoto/kiyomizu-temple-autumn-leaves-lightup.jpg",
            isListed: true,
          },
          {
            id: "osaka",
            name: "大阪",
            imageUrl: "/images/Osaka/kansai-airport.jpg",
            isListed: true,
          },
          {
            id: "hokkaido",
            name: "北海道",
            imageUrl: "/images/Hokkaido/otaru-canal.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "south-korea",
        name: "韓国",
        isoAlpha2: "KR",
        imageUrl: "/images/Korea/monument.jpg",
        isListed: true,
        regions: [
          {
            id: "seoul",
            name: "ソウル",
            imageUrl: "/images/Korea/monument.jpg",
            isListed: true,
          },
          {
            id: "incheon",
            name: "仁川",
            imageUrl: "/images/Korea/monument.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "china",
        name: "中国",
        isoAlpha2: "CN",
        imageUrl: "/images/China/shanghai-airport-food.jpg",
        isListed: true,
        regions: [
          {
            id: "shanghai",
            name: "上海",
            imageUrl: "/images/China/shanghai-airport-food.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "india",
        name: "インド",
        isoAlpha2: "IN",
        imageUrl: "/images/India/tajmahal.jpg",
        isListed: true,
        regions: [
          {
            id: "new-delhi",
            name: "ニューデリー",
            imageUrl: "/images/India/indian-gate-at-noon.jpg",
            isListed: true,
          },
          {
            id: "agra",
            name: "アグラ",
            imageUrl: "/images/India/tajmahal.jpg",
            isListed: true,
          },
          {
            id: "jaipur",
            name: "ジャイプル",
            imageUrl: "/images/India/hawa-mahal.jpg",
            isListed: true,
          },
          {
            id: "varanasi",
            name: "バラナシ",
            imageUrl: "/images/India/festival-of-ganga3.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "thailand",
        name: "タイ",
        isoAlpha2: "TH",
        imageUrl: "/images/Thai/emotional-wat-arun.jpg",
        isListed: true,
        regions: [
          {
            id: "bangkok",
            name: "バンコク",
            imageUrl: "/images/Thai/ceiling-at-wat-pak-nam.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "vietnam",
        name: "ベトナム",
        isoAlpha2: "VN",
        imageUrl: "/images/Vietnam/vietnam-old-town2.jpg",
        isListed: true,
        regions: [
          {
            id: "hanoi",
            name: "ハノイ",
            imageUrl: "/images/Vietnam/vietnam-old-town2.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "malaysia",
        name: "マレーシア",
        isoAlpha2: "MY",
        imageUrl: "/images/Malaysia/petronas-twin-towers.jpg",
        isListed: true,
        regions: [
          {
            id: "kuala-lumpur",
            name: "クアラルンプール",
            imageUrl: "/images/Malaysia/petronas-twin-towers.jpg",
            isListed: true,
          },
          {
            id: "putrajaya",
            name: "プトラジャヤ",
            imageUrl: "/images/Malaysia/exterior-of-the-putra-mosque.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "singapore",
        name: "シンガポール",
        isoAlpha2: "SG",
        imageUrl:
          "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
        isListed: true,
        regions: [
          {
            id: "singapore-city",
            name: "シンガポール市内",
            imageUrl:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
            isListed: true,
          },
          {
            id: "sentosa",
            name: "セントーサ島",
            imageUrl:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
            isListed: true,
          },
          {
            id: "changi",
            name: "チャンギ",
            imageUrl:
              "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "indonesia",
        name: "インドネシア",
        isoAlpha2: "ID",
        imageUrl: "/images/Indonesia/seminyak-beach-at-night.jpg",
        isListed: true,
        regions: [
          {
            id: "seminyak",
            name: "スミニャック",
            imageUrl: "/images/Indonesia/seminyak-beach-at-night.jpg",
            isListed: true,
          },
          {
            id: "yogyakarta",
            name: "ジョグジャカルタ",
            imageUrl: "/images/Indonesia/malioboro-street.jpg",
            isListed: true,
          },
        ],
      },
    ],
  },
  {
    id: "europe",
    name: "ヨーロッパ",
    countries: [
      {
        id: "france",
        name: "フランス",
        isoAlpha2: "FR",
        imageUrl: "/images/France/eiffel-tower-and-sunset.jpg",
        isListed: true,
        regions: [
          {
            id: "paris",
            name: "パリ",
            imageUrl: "/images/France/louvre-museum1.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "spain",
        name: "スペイン",
        isoAlpha2: "ES",
        imageUrl: "/images/Spain/las-ventas-bullring.jpg",
        isListed: true,
        regions: [
          {
            id: "barcelona",
            name: "バルセロナ",
            imageUrl: "/images/Spain/sagrada-familia.jpg",
            isListed: true,
          },
          {
            id: "madrid",
            name: "マドリード",
            imageUrl: "/images/Spain/plaza-de-mayor.jpg",
            isListed: true,
          },
          {
            id: "toledo",
            name: "トレド",
            imageUrl: "/images/Spain/toledo-view.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "belgium",
        name: "ベルギー",
        isoAlpha2: "BE",
        imageUrl: "/images/Belgium/galeries-royales-saint-hubert.jpg",
        isListed: true,
        regions: [
          {
            id: "brussels",
            name: "ブリュッセル",
            imageUrl: "/images/Belgium/galeries-royales-saint-hubert.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "greece",
        name: "ギリシャ",
        isoAlpha2: "GR",
        imageUrl: "/images/Greece/oia-castle-sunset-view.jpg",
        isListed: true,
        regions: [
          {
            id: "santorini",
            name: "サントリーニ",
            imageUrl: "/images/Greece/santorini-view.jpg",
            isListed: true,
          },
          {
            id: "athens",
            name: "アテネ",
            imageUrl: "/images/Greece/parthenon.jpg",
            isListed: true,
          },
        ],
      },
      {
        id: "turkey",
        name: "トルコ",
        isoAlpha2: "TR",
        imageUrl: "/images/Turkey/balloons-in-cappadocia.jpg",
        isListed: true,
        regions: [
          {
            id: "istanbul",
            name: "イスタンブール",
            imageUrl: "/images/Turkey/meidens-tower.jpg",
            isListed: true,
          },
          {
            id: "cappadocia",
            name: "カッパドキア",
            imageUrl: "/images/Turkey/balloons-in-cappadocia.jpg",
            isListed: true,
          },
        ],
      },
    ],
  },
  {
    id: "africa",
    name: "アフリカ",
    countries: [
      {
        id: "egypt",
        name: "エジプト",
        isoAlpha2: "EG",
        imageUrl:
          "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
        isListed: true,
        regions: [
          {
            id: "cairo",
            name: "カイロ",
            imageUrl:
              "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
            isListed: true,
          },
          {
            id: "giza",
            name: "ギザ",
            imageUrl:
              "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
            isListed: true,
          },
          {
            id: "abu-simbel",
            name: "アブシンベル",
            imageUrl: "/images/Egypt/abusimbel-temple.jpg",
            isListed: true,
          },
          {
            id: "aswan",
            name: "アスワン",
            imageUrl: "/images/Egypt/aswan-view.jpg",
            isListed: true,
          },
        ],
      },
    ],
  },
];

export const destinationCatalog: ContinentCatalogEntry[] =
  resolveDiaryImageTree(rawDestinationCatalog);
