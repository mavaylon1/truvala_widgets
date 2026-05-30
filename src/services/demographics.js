import fixtureData from '@/data/fixtures/demographics.json'

// Set USE_API = true to call US Census Bureau API via backend
const USE_API = false

export async function fetchDemographics({ lat, lng } = {}) {
  if (!USE_API) return fixtureData

  // TODO: Census Bureau API — ACS 5-year estimates by lat/lng → FIPS tract
  const response = await fetch(`/api/demographics?lat=${lat}&lng=${lng}`)
  if (!response.ok) throw new Error('Failed to fetch demographics')
  return response.json()
}
