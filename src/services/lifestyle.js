import fixtureData from '@/data/fixtures/lifestyle.json'

const USE_API = true

const KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY
const BASE = 'https://places.googleapis.com/v1/places:searchNearby'
const FIELD_MASK = 'places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri,places.location'

const CUISINE_TYPES = [
  { key: 'mexican_restaurant',  label: 'Mexican' },
  { key: 'american_restaurant', label: 'American' },
  { key: 'chinese_restaurant',  label: 'Asian' },
  { key: 'italian_restaurant',  label: 'Italian' },
  { key: 'indian_restaurant',   label: 'Indian' },
  { key: 'japanese_restaurant', label: 'Japanese' },
]

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function searchNearby({ lat, lng, types, radius = 2500, maxResults = 5, fieldMask = FIELD_MASK }) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify({
      includedTypes: types,
      maxResultCount: maxResults,
      rankPreference: 'DISTANCE',
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
    }),
  })
  const data = await res.json()
  return (data.places || []).map(p => ({
    name: p.displayName?.text || 'Unknown',
    placeId: p.id || null,
    rating: p.rating ?? null,
    reviewCount: p.userRatingCount ?? 0,
    address: p.formattedAddress || '',
    mapsUri: p.googleMapsUri || '',
    distance: p.location
      ? Math.round(haversineMiles(lat, lng, p.location.latitude, p.location.longitude) * 10) / 10
      : null,
  }))
}

async function fetchCuisineDistribution({ lat, lng }) {
  const counts = await Promise.all(
    CUISINE_TYPES.map(ct =>
      searchNearby({
        lat, lng,
        types: [ct.key],
        radius: 2500,
        maxResults: 20,
        fieldMask: 'places.displayName',
      }).then(r => r.length)
    )
  )
  const total = counts.reduce((s, c) => s + c, 0) || 1
  return CUISINE_TYPES
    .map((ct, i) => ({ label: ct.label, count: counts[i], percentage: Math.round((counts[i] / total) * 100) }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchLifestyle({ lat, lng } = {}) {
  if (!USE_API) return fixtureData

  try {
    const [gyms, parks, grocery, libraries, airports, cuisine_distribution] = await Promise.all([
      searchNearby({ lat, lng, types: ['gym', 'fitness_center'], radius: 3000 }),
      searchNearby({ lat, lng, types: ['park'], radius: 3000 }),
      searchNearby({ lat, lng, types: ['grocery_store', 'supermarket'], radius: 3000 }),
      searchNearby({ lat, lng, types: ['library'], radius: 5000 }),
      searchNearby({ lat, lng, types: ['airport'], radius: 80000, maxResults: 3 }),
      fetchCuisineDistribution({ lat, lng }),
    ])

    return {
      walkability_score: fixtureData.walkability_score,
      walkability_label: fixtureData.walkability_label,
      gyms,
      parks,
      grocery_stores: grocery,
      libraries,
      airports,
      cuisine_distribution,
    }
  } catch (err) {
    console.warn('Places API failed, falling back to fixture:', err)
    return fixtureData
  }
}
