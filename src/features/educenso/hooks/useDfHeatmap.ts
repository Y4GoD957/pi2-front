import { useCallback, useEffect, useState } from 'react'

import { fetchDfHeatmap } from '@/services/educenso/dfHeatmapService'
import type { DfHeatmapResponse } from '@/types/educenso'

interface UseDfHeatmapParams {
  indicator?: string
  source?: string
  year?: number
}

export function useDfHeatmap(params: UseDfHeatmapParams) {
  const [data, setData] = useState<DfHeatmapResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    let isMounted = true

    try {
      const response = await fetchDfHeatmap(params)
      if (isMounted) {
        setData(response)
        setError(null)
      }
    } catch (nextError) {
      if (isMounted) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar o heatmap do DF.',
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
