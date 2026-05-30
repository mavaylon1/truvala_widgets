# Truvala Widgets

Embeddable buyer intelligence widgets for realtor listing pages. React + Vite app that serves as both the widget source and the preview/demo environment.

## Running the dev server

```bash
npm install
npm run dev   # http://localhost:5173
```

Requires a `.env` file — copy `.env.example` and fill in the keys.

## Architecture

**Two delivery methods, one codebase.** The same React app is served as an iframe embed or a JS bundle script tag on vendor (realtor) sites.

**Six design themes.** Each theme has its own `Map`, `School`, and `Cost` widget variants under `src/components/themes/`. The `Lifestyle` and `Concierge` widgets in `src/components/shared/` are shared across all themes.

**Modular data layer.** Each `src/services/*.js` file has a `USE_API` flag at the top. `false` returns fixture data from `src/data/fixtures/`. `true` calls the real API. Flipping the flag is the only change needed to go live — the widget layer is unaffected.

**`useListingContext`** assembles all data sources in parallel via `Promise.all` and passes the result down to every widget and the Concierge.

**Path alias.** `@` resolves to `src/`. Use `@/hooks/...`, `@/services/...`, etc. instead of relative paths.

## Key files

| File | Purpose |
|---|---|
| `src/App.jsx` | Preview shell — design switcher, color picker, renders all widgets |
| `src/hooks/useListingContext.js` | Fetches and assembles all listing data |
| `src/services/lifestyle.js` | Google Places API (New) — Nearby Search for all lifestyle categories |
| `src/components/shared/Concierge.jsx` | AI chat widget — GPT-4o via OpenAI Responses API with web search |
| `src/components/shared/LifestyleWidget.jsx` | Lifestyle widget with animated category panel and SVG animations |
| `src/data/designs.js` | Color configs for all six design systems |
| `src/data/fixtures/` | Fake listing data used when `USE_API = false` |

## Adding a new widget

1. Add `src/services/mywidget.js` with `fetchMyWidget` and `USE_API = false`
2. Add `src/data/fixtures/mywidget.json` with fake data
3. Add `fetchMyWidget` to `useListingContext.js` inside the `Promise.all`
4. Build the component in `src/components/shared/` or per-theme if it needs design variants
5. Wire it into `App.jsx`

## APIs

| API | Used for | Key env var |
|---|---|---|
| Google Places API (New) | Lifestyle widget — gyms, parks, grocery, cuisine, libraries, airports | `VITE_GOOGLE_MAPS_EMBED_KEY` |
| Google Maps Embed API | Street View widget | `VITE_GOOGLE_MAPS_EMBED_KEY` |
| OpenAI GPT-4o | Concierge chat | `VITE_OPENAI_API_KEY` |

Both keys are browser-exposed via `VITE_` prefix. For production, proxy OpenAI through a backend. Restrict the Google Maps key by HTTP referrer in Google Cloud Console.
