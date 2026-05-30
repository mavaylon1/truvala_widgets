import fixtureData from '@/data/fixtures/solar.json'

// Solar estimate — pure calculation based on location/system size.
// Set USE_API = true to call NREL PVWatts API (free, US gov) via backend.
// Set USE_FIXTURE = false to use the built-in calculation instead.
const USE_API = false
const USE_FIXTURE = true

function calculateSolar({ lat, systemCostDollars = 18000 }) {
  // Rough NREL-style estimate based on latitude band
  // Higher sun hours in southern CA (~5.5 peak hours/day)
  const systemKw = 6
  const peakSunHours = lat < 36 ? 5.5 : lat < 40 ? 4.8 : 4.2
  const annualKwh = Math.round(systemKw * peakSunHours * 365 * 0.8)
  const monthlySavings = Math.round((annualKwh / 12) * 0.22) // ~$0.22/kWh avg CA rate
  const breakEvenYear = Math.round(systemCostDollars / (monthlySavings * 12))

  return {
    annual_production_kwh: annualKwh,
    monthly_savings: monthlySavings,
    system_cost: systemCostDollars,
    offset_pct: Math.min(Math.round((annualKwh / (monthlySavings * 12 / 0.22)) * 100), 100),
    break_even_year: breakEvenYear,
    co2_offset_lbs_per_year: Math.round(annualKwh * 0.8),
  }
}

export async function fetchSolar({ lat, lng, systemCost } = {}) {
  if (USE_API) {
    // TODO: NREL PVWatts API via backend proxy
    const response = await fetch(`/api/solar?lat=${lat}&lng=${lng}`)
    if (!response.ok) throw new Error('Failed to fetch solar data')
    return response.json()
  }

  if (USE_FIXTURE) return fixtureData

  return calculateSolar({ lat, systemCostDollars: systemCost })
}
