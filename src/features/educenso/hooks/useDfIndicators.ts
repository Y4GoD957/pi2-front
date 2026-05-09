import { useCallback, useEffect, useState } from 'react'

import { fetchDfIndicators } from '@/services/educenso/educensoDataService'
import type { DfIndicatorsResponse } from '@/types/educenso'

interface UseDfIndicatorsParams {
  indicator?: string
  source?: string
  theme?: string
  year?: number
}

export function useDfIndicators(params: UseDfIndicatorsParams) {
  const [data, setData] = useState<DfIndicatorsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    let isMounted = true

    try {
      const response = await fetchDfIndicators(params)
      if (isMounted) {
        setData(response)
        setError(null)
      }
    } catch (nextError) {
      if (isMounted) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar os indicadores do DF.',
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
  }, [params.year, params.indicator, params.source, params.theme])

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
