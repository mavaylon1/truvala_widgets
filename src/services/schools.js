import fixtureData from '@/data/fixtures/schools.json'

// Set USE_API = true and implement the API call to use real school data
const USE_API = false

export async function fetchSchools({ lat, lng } = {}) {
  if (!USE_API) return fixtureData

  // TODO: replace with GreatSchools API or Google Places schools call
  const response = await fetch(`/api/schools?lat=${lat}&lng=${lng}`)
  if (!response.ok) throw new Error('Failed to fetch schools')
  return response.json()
}
