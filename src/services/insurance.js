import fixtureData from '@/data/fixtures/insurance.json'

// Set USE_API = true to call FEMA flood API and risk data sources via backend
const USE_API = false

export async function fetchInsurance({ lat, lng } = {}) {
  if (!USE_API) return fixtureData

  // TODO: FEMA flood map service + wildfire/earthquake risk APIs
  const response = await fetch(`/api/insurance?lat=${lat}&lng=${lng}`)
  if (!response.ok) throw new Error('Failed to fetch insurance/risk data')
  return response.json()
}
