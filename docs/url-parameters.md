# URL Parameters

このアプリは URL パラメータで初期表示状態を指定できます。

## Supported Parameters

- `mode=region`
- `mode=trip`
- `country=<countryId>`
- `region=<regionId>`
- `spot=<spotId>`
- `trip=<tripId>`

## Region Mode

### Supported combinations

- `?mode=region`
  - Region モードのトップを開く
- `?mode=region&country=japan`
  - 国選択済みで開く
- `?mode=region&region=kyoto`
  - 地域選択済みで開く
- `?mode=region&spot=wat-arun`
  - spot から親 region / country を補完して開く
- `?country=japan`
- `?region=kyoto`
- `?spot=wat-arun`
  - `mode` がなくても region 側として解決する

### Resolution priority

- `spot` が最優先
- 次に `region`
- 最後に `country`

## Trip Mode

### Supported combinations

- `?mode=trip`
  - Trip 一覧を開く
- `?mode=trip&trip=bangkok-trip-2024`
  - 対象 trip を開く
- `?mode=trip&trip=bangkok-trip-2024&spot=wat-arun`
  - 対象 trip 内の spot を開く
- `?trip=bangkok-trip-2024`
  - `mode` がなくても trip 側として解決する

### Validation rules

- `trip` が無効なら trip 詳細は開かない
- `spot` は対象 trip に含まれる場合のみ trip モードで有効

## Current IDs

### Modes

- `region`
- `trip`

### Example country IDs

- `japan`
- `south-korea`
- `india`
- `thailand`
- `china`
- `malaysia`
- `singapore`
- `indonesia`
- `france`
- `spain`
- `belgium`
- `greece`
- `turkey`
- `egypt`

### Example region IDs

- `kyoto`
- `osaka`
- `hokkaido`
- `seoul`
- `new-delhi`
- `agra`
- `jaipur`
- `varanasi`
- `bangkok`
- `hanoi`
- `shanghai`
- `kuala-lumpur`
- `putrajaya`
- `singapore-city`
- `sentosa`
- `changi`
- `seminyak`
- `yogyakarta`
- `paris`
- `barcelona`
- `madrid`
- `toledo`
- `brussels`
- `santorini`
- `athens`
- `cappadocia`
- `cairo`
- `giza`
- `abu-simbel`
- `aswan`

### Trip IDs

- `hokkaido-trip-2024`
- `bangkok-trip-2024`
- `india-trip-2024`
- `europe-trip-2025`
- `transcontinental-trip-2025`
- `shanghai-trip-2025`
- `southeast-asia-trip-2026`

## Share URLs

共有ボタンは現在の表示状態に応じて次を生成します。

- Region トップ: `?mode=region`
- Country: `?mode=region&country=...`
- Region: `?mode=region&region=...`
- Spot: `?mode=region&spot=...`
- Trip 一覧: `?mode=trip`
- Trip: `?mode=trip&trip=...`
- Trip spot: `?mode=trip&trip=...&spot=...`
