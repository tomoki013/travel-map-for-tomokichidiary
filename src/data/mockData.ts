import { destinationCatalog } from "@/data/catalog";
import { getCoordinates } from "@/data/coordinates";
import { Country, Region, Spot, Trip } from "@/types/data";

interface RawTripData {
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
      isRegionVisible?: boolean;
      camera: { zoom: number; pitch: number; bearing: number };
    }[];
  }[];
}

interface TripSourceData {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  itineraries: {
    title: string;
    spots: string[];
  }[];
}

const RAW_TRIPS_DATA: RawTripData[] = [
  {
    id: "bangkok-trip-2024",
    title: "アジアの熱気を感じて",
    date: "2024.03.01~03.04",
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
    title: "西欧 芸術と美食の周遊",
    date: "2025.02.13~02.28",
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
  {
    id: "hokkaido-trip-2024",
    title: "北海道の食を堪能する旅",
    date: "2024.02.26~02.28",
    thumbnail: "/images/Hokkaido/otaru-canal.jpg",
    itineraries: [
      {
        title: "2024年2月26日（月）：小樽散策",
        spots: [
          {
            id: "new-chitose-airport",
            name: "新千歳空港",
            description: "北海道旅のスタート地点。",
            coordinates: [141.6923, 42.7752],
            regionSlug: "hokkaido",
            isRegionVisible: false,
            camera: { zoom: 11, pitch: 0, bearing: 0 },
          },
          {
            id: "otaru-canal",
            name: "小樽運河",
            description: "北海道の旅情を感じる定番スポット。",
            coordinates: [140.9947, 43.1974],
            regionSlug: "hokkaido",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2024年2月27日（火）：札幌グルメ巡り",
        spots: [
          {
            id: "nijo-market-sapporo",
            name: "二条市場",
            description: "北海道グルメをまとめて味わえる市場。",
            coordinates: [141.3573, 43.0588],
            regionSlug: "hokkaido",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "susukino",
            name: "すすきの",
            description: "夜の札幌を象徴する繁華街。",
            coordinates: [141.3545, 43.0554],
            regionSlug: "hokkaido",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 45 },
          },
        ],
      },
    ],
  },
  {
    id: "india-trip-2024",
    title: "インド 混沌と祈りの旅",
    date: "2024.09.21~09.30",
    thumbnail: "/images/India/tajmahal.jpg",
    itineraries: [
      {
        title: "2024年9月21日（土）：ニューデリー到着",
        spots: [
          {
            id: "india-gate",
            name: "インド門",
            description: "首都ニューデリーを象徴する記念碑。",
            coordinates: [77.2295, 28.6129],
            regionSlug: "new-delhi",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "jama-masjid",
            name: "ジャーマー・マスジド",
            description: "旧市街の熱気を感じる巨大モスク。",
            coordinates: [77.2334, 28.6507],
            regionSlug: "new-delhi",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2024年9月23日（月）：アグラとジャイプル",
        spots: [
          {
            id: "taj-mahal",
            name: "タージ・マハル",
            description: "白亜の霊廟が旅の象徴になる名所。",
            coordinates: [78.0421, 27.1751],
            regionSlug: "agra",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "hawa-mahal",
            name: "ハワー・マハル",
            description: "ジャイプルの街を代表する宮殿建築。",
            coordinates: [75.8267, 26.9239],
            regionSlug: "jaipur",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2024年9月27日（金）：バラナシの祈り",
        spots: [
          {
            id: "dashashwamedh-ghat",
            name: "ダシャーシュワメード・ガート",
            description: "ガンジス川沿いの祈りが集まる場所。",
            coordinates: [83.0105, 25.3064],
            regionSlug: "varanasi",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 90 },
          },
        ],
      },
    ],
  },
  {
    id: "transcontinental-trip-2025",
    title: "大陸横断 古代文明を巡る冒険",
    date: "2025.06.10~06.30",
    thumbnail:
      "/images/Egypt/the-three-great-pyramids-of-giza-with-sunset.jpg",
    itineraries: [
      {
        title: "2025年6月10日（火）：バンコク出発",
        spots: [
          {
            id: "wat-arun-transit",
            name: "ワット・アルン",
            description: "大陸横断の出発点として立ち寄った寺院。",
            coordinates: [100.4889, 13.7436],
            regionSlug: "bangkok",
            isRegionVisible: false,
            camera: { zoom: 17, pitch: 60, bearing: -45 },
          },
        ],
      },
      {
        title: "2025年6月18日（水）：カッパドキアの奇岩群",
        spots: [
          {
            id: "goreme-open-air-museum",
            name: "ギョレメ野外博物館",
            description: "岩窟教会が並ぶ世界遺産エリア。",
            coordinates: [34.8455, 38.6406],
            regionSlug: "cappadocia",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年6月23日（月）：エジプトの古代遺跡",
        spots: [
          {
            id: "giza-pyramids",
            name: "ギザの三大ピラミッド",
            description: "古代文明の壮大さを体感できる定番スポット。",
            coordinates: [31.1342, 29.9792],
            regionSlug: "giza",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
          {
            id: "abu-simbel-temple",
            name: "アブシンベル大神殿",
            description: "ラムセス2世の巨大岩窟神殿。",
            coordinates: [31.6258, 22.3372],
            regionSlug: "abu-simbel",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2025年6月29日（日）：サントリーニの夕景",
        spots: [
          {
            id: "oia-castle",
            name: "イア城跡",
            description: "サントリーニの夕景で有名な展望スポット。",
            coordinates: [25.3753, 36.4618],
            regionSlug: "santorini",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: -45 },
          },
        ],
      },
    ],
  },
  {
    id: "shanghai-trip-2025",
    title: "上海 新旧が交錯する魔都",
    date: "2025.11.29~12.02",
    thumbnail: "/images/China/shanghai-airport-food.jpg",
    itineraries: [
      {
        title: "2025年11月29日（土）：浦東と外灘",
        spots: [
          {
            id: "shanghai-pudong-airport",
            name: "上海浦東国際空港",
            description: "上海旅のスタート地点。",
            coordinates: [121.8052, 31.1443],
            regionSlug: "shanghai",
            isRegionVisible: false,
            camera: { zoom: 11, pitch: 0, bearing: 0 },
          },
          {
            id: "the-bund",
            name: "外灘",
            description: "歴史的建築群と夜景が魅力の代表スポット。",
            coordinates: [121.4905, 31.2417],
            regionSlug: "shanghai",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 90 },
          },
        ],
      },
      {
        title: "2025年11月30日（日）：旧市街散策",
        spots: [
          {
            id: "yu-garden",
            name: "豫園",
            description: "旧市街に残る江南庭園の名所。",
            coordinates: [121.4924, 31.2273],
            regionSlug: "shanghai",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "southeast-asia-trip-2026",
    title: "東南アジアをつないで巡る食と街歩きの旅",
    thumbnail:
      "/images/Singapore/changi-international-airport-lounge-plaza-premium-lounge.jpg",
    date: "2026.03.12~03.20",
    itineraries: [
      {
        title: "2026年3月12日（木）：クアラルンプール到着",
        spots: [
          {
            id: "petronas-towers",
            name: "ペトロナスツインタワー",
            description: "クアラルンプールの象徴的な高層ビル。",
            coordinates: [101.7114, 3.1579],
            regionSlug: "kuala-lumpur",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 50, bearing: 0 },
          },
          {
            id: "batu-caves",
            name: "バトゥ洞窟",
            description: "クアラルンプール近郊の定番観光地。",
            coordinates: [101.6839, 3.2379],
            regionSlug: "kuala-lumpur",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2026年3月14日（土）：プトラジャヤとチャンギ",
        spots: [
          {
            id: "putra-mosque",
            name: "プトラモスク",
            description: "湖畔に建つプトラジャヤの代表スポット。",
            coordinates: [101.6939, 2.9345],
            regionSlug: "putrajaya",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
          {
            id: "jewel-changi",
            name: "ジュエル・チャンギ",
            description: "チャンギ空港で象徴的な複合施設。",
            coordinates: [103.9894, 1.3603],
            regionSlug: "changi",
            isRegionVisible: false,
            camera: { zoom: 16, pitch: 45, bearing: 0 },
          },
        ],
      },
      {
        title: "2026年3月16日（月）：シンガポール市内とセントーサ島",
        spots: [
          {
            id: "marina-bay",
            name: "マリーナベイ",
            description: "シンガポール市内を代表するウォーターフロント。",
            coordinates: [103.8607, 1.2834],
            regionSlug: "singapore-city",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
          {
            id: "sentosa-beach",
            name: "セントーサ島",
            description: "リゾート感を味わえる南部の離島。",
            coordinates: [103.8198, 1.2494],
            regionSlug: "sentosa",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 35, bearing: 90 },
          },
        ],
      },
      {
        title: "2026年3月18日（水）：インドネシアへ",
        spots: [
          {
            id: "seminyak-beach",
            name: "スミニャックビーチ",
            description: "バリ南部を代表するサンセットスポット。",
            coordinates: [115.1568, -8.6927],
            regionSlug: "seminyak",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 35, bearing: 90 },
          },
          {
            id: "prambanan",
            name: "プランバナン寺院群",
            description: "ジョグジャカルタ近郊の世界遺産。",
            coordinates: [110.4915, -7.752],
            regionSlug: "yogyakarta",
            isRegionVisible: false,
            camera: { zoom: 15, pitch: 45, bearing: 0 },
          },
        ],
      },
    ],
  },
];

const buildSources = (rawTrips: RawTripData[]) => {
  const spotsSource: Record<string, Spot> = {};
  const tripsSource: TripSourceData[] = rawTrips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    date: trip.date,
    thumbnail: trip.thumbnail,
    itineraries: trip.itineraries.map((itinerary) => ({
      title: itinerary.title,
      spots: itinerary.spots.map((spot) => {
        spotsSource[spot.id] = {
          id: spot.id,
          name: spot.name,
          description: spot.description,
          coordinates: spot.coordinates,
          regionSlug: spot.regionSlug,
          isRegionVisible: spot.isRegionVisible ?? true,
          camera: spot.camera,
        };

        return spot.id;
      }),
    })),
  }));

  return { spotsSource, tripsSource };
};

const { spotsSource: SPOTS_SOURCE, tripsSource: TRIPS_SOURCE } =
  buildSources(RAW_TRIPS_DATA);

const generateData = () => {
  const regionsMock: Record<string, Region> = {};
  const countriesMock: Record<string, Country> = {};
  const spotsMock: Record<string, Spot> = { ...SPOTS_SOURCE };
  const tripsMock: Record<string, Trip> = {};

  destinationCatalog.forEach((continent) => {
    continent.countries.forEach((country) => {
      const countryCoords = getCoordinates(country.id);
      const regionIds: string[] = [];

      country.regions.forEach((region) => {
        const regionCoords = getCoordinates(region.id);
        regionIds.push(region.id);

        regionsMock[region.id] = {
          id: region.id,
          name: region.name,
          countryId: country.id,
          center: regionCoords.center,
          zoom: regionCoords.zoom,
          spots: [],
          status: "coming-soon",
          isListed: region.isListed,
        };
      });

      countriesMock[country.id] = {
        id: country.id,
        name: country.name,
        continentId: continent.id,
        center: countryCoords.center,
        zoom: countryCoords.zoom,
        regions: regionIds,
        isListed: country.isListed,
      };
    });
  });

  TRIPS_SOURCE.forEach((tripSource) => {
    const tripSpotIds: string[] = [];
    const tripItineraries: { title: string; spots: string[] }[] = [];

    tripSource.itineraries.forEach((itinerary) => {
      const daySpotIds: string[] = [];

      itinerary.spots.forEach((spotId) => {
        const sourceSpot = SPOTS_SOURCE[spotId];
        if (!sourceSpot) {
          console.warn(`Spot ${spotId} not found for trip ${tripSource.id}`);
          return;
        }

        daySpotIds.push(spotId);
        tripSpotIds.push(spotId);

        const regionSlug = sourceSpot.regionSlug;
        if (!regionsMock[regionSlug]) {
          console.warn(`Region ${regionSlug} not found for spot ${spotId}`);
        } else if (sourceSpot.isRegionVisible ?? true) {
          if (!regionsMock[regionSlug].spots.includes(spotId)) {
            regionsMock[regionSlug].spots.push(spotId);
            regionsMock[regionSlug].status = "ready";
          }
        }
      });

      tripItineraries.push({
        title: itinerary.title,
        spots: daySpotIds,
      });
    });

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
