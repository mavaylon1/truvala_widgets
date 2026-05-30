# Truvala Widgets

Buyer intelligence and engagement widgets for realtor listing pages. Provides a preview/demo environment and the source for all embeddable widgets.

## Widgets

| Widget | Description |
|---|---|
| Street View | Google Street View embed with property details |
| School Snapshot | Nearby schools with ratings and distances |
| Monthly Costs | Mortgage calculator with solar and HOA toggles |
| Lifestyle & Neighborhood | Nearby places (gyms, parks, grocery, cuisine, libraries, airports) via Google Places |
| Ask Truvala Concierge | AI chat guide powered by GPT-4o, aware of all listing context |

## Quick start

```bash
cp .env.example .env
# fill in your API keys in .env

npm install
npm run dev
```

The preview app runs at `http://localhost:5173`. It loads real data from the Google Places API and connects to OpenAI for the Concierge.

## Environment variables

```
VITE_GOOGLE_MAPS_EMBED_KEY   Google Maps key with Maps Embed API + Places API (New) enabled
VITE_OPENAI_API_KEY          OpenAI key for the Concierge (GPT-4o)
```

Both keys are exposed in the browser bundle. For production, the OpenAI key should be proxied through a backend endpoint. The Google Maps key is intended for browser use — restrict it by HTTP referrer in Google Cloud Console.

## Project structure

```
src/
├── components/
│   ├── shared/          # Cross-theme widgets (Concierge, LifestyleWidget, shared charts)
│   └── themes/          # Design system variants of Map, School, and Cost widgets
│       ├── ios/
│       ├── bauhaus/
│       ├── luxe/
│       ├── minimal/
│       ├── material/
│       └── dashboard/
├── data/
│   ├── designs.js       # Design system color configs
│   └── fixtures/        # Fake listing data used when USE_API = false
├── hooks/
│   └── useListingContext.js   # Assembles all data sources in parallel
└── services/            # One file per data source — flip USE_API to connect real APIs
    ├── listing.js
    ├── schools.js
    ├── lifestyle.js      # Google Places API (New)
    ├── demographics.js
    ├── insurance.js
    └── solar.js
```

## Swapping fixture data for real APIs

Each service file has a `USE_API` flag at the top:

```js
// src/services/schools.js
const USE_API = false   // set to true and implement the fetch below
```

Set it to `true` and replace the `TODO` fetch with the real API call. The widget layer receives the same data shape either way — nothing else needs to change.

## Embed delivery

The same React app supports two delivery methods for vendor sites:

**iframe** (recommended for pilots)
```html
<iframe src="https://widgets.truvala.com/listing?id=123" width="100%" height="800"></iframe>
```

**Script tag** (better long-term integration)
```html
<script src="https://widgets.truvala.com/v1/bundle.js"></script>
<div id="truvala-widget"></div>
```

## Design themes

Six design systems are available — switch between them in the preview using the control bar at the top. Each theme has its own `Map`, `School`, and `Cost` variant under `src/components/themes/`. The `Lifestyle` and `Concierge` widgets are shared across all themes.

## Adding a new widget

1. Create `src/services/mywidget.js` with a `fetchMyWidget` function and `USE_API` flag
2. Add the data to `src/data/fixtures/mywidget.json`
3. Add `fetchMyWidget` to `src/hooks/useListingContext.js` inside the `Promise.all`
4. Build the component in `src/components/shared/` or per-theme if it needs design variants
5. Add it to `App.jsx`
