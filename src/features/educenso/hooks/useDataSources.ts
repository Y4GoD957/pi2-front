import { useEffect, useState } from 'react'

import { fetchDataSources } from '@/services/educenso/educensoDataService'
import type { DataSourcesResponse } from '@/types/educenso'

// Module-level cache — data-sources is static for the session lifetime
let _cache: DataSourcesResponse | null = null

export function useDataSources() {
  const [data, setData] = useState<DataSourcesResponse | null>(_cache)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(_cache === null)

  useEffect(() => {
    if (_cache) return // already cached — no fetch needed

    let isMounted = true

    void fetchDataSources()
      .then((response) => {
        _cache = response
        if (!isMounted) return
        setData(response)
      })
      .catch((nextError) => {
        if (!isMounted) return
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar as fontes de dados.',
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { data, error, isLoading }
}
