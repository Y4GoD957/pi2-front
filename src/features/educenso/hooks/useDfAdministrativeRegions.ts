import { useEffect, useState } from 'react'

import { fetchDfDistrictsFromIbge } from '@/services/educenso/ibgeDfService'
import type { IbgeAdministrativeRegion } from '@/types/ibge'

export function useDfAdministrativeRegions() {
  const [regions, setRegions] = useState<IbgeAdministrativeRegion[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    void fetchDfDistrictsFromIbge()
      .then((nextRegions) => {
        if (!isMounted) {
          return
        }

        setRegions(nextRegions)
      })
      .catch((nextError) => {
        if (!isMounted) {
          return
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar as referencias administrativas do DF.',
        )
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    error,
    regions,
  }
}
