import { useCallback, useEffect, useState } from 'react'

import { fetchDfCharts } from '@/services/educenso/educensoDataService'
import type { DfChartsResponse } from '@/types/educenso'

interface UseDfChartsParams {
  indicator?: string
  source?: string
  year?: number
}

export function useDfCharts(params: UseDfChartsParams) {
  const [data, setData] = useState<DfChartsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    let isMounted = true

    try {
      const response = await fetchDfCharts(params)
      if (isMounted) {
        setData(response)
        setError(null)
      }
    } catch (nextError) {
      if (isMounted) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar os graficos do DF.',
        )
      }
    } finally {
      if (isMounted) {
        setIsLoading(false)
      }
    }

    return () => {
      isMounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.year, params.indicator, params.source])

  useEffect(() => {
    let cleanup: (() => void) | undefined

    void refresh().then((nextCleanup) => {
      cleanup = nextCleanup
    })

    return () => {
      cleanup?.()
    }
  }, [refresh])

  return { data, error, isLoading }
}
