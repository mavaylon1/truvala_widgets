import { useState, useEffect } from 'react'
import { fetchListing } from '@/services/listing'
import { fetchSchools } from '@/services/schools'
import { fetchLifestyle } from '@/services/lifestyle'
import { fetchDemographics } from '@/services/demographics'
import { fetchInsurance } from '@/services/insurance'
import { fetchSolar } from '@/services/solar'

export function useListingContext(listingId) {
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const listing = await fetchListing(listingId)
        const { lat, lng } = listing

        const [schools, lifestyle, demographics, insurance, solar] = await Promise.all([
          fetchSchools({ lat, lng }),
          fetchLifestyle({ lat, lng }),
          fetchDemographics({ lat, lng }),
          fetchInsurance({ lat, lng }),
          fetchSolar({ lat, lng }),
        ])

        if (!cancelled) {
          setContext({ listing, schools, lifestyle, demographics, insurance, solar })
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [listingId])

  return { context, loading, error }
}
