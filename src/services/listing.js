import fixtureData from '@/data/fixtures/listing.json'

// Set USE_API = true and implement fetchFromAPI() to use a real data source
const USE_API = false

export async function fetchListing(listingId) {
  if (!USE_API) return fixtureData

  // TODO: replace with real MLS/IDX API call
  const response = await fetch(`/api/listing/${listingId}`)
  if (!response.ok) throw new Error('Failed to fetch listing')
  return response.json()
}
