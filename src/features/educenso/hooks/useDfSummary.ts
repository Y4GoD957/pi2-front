import { useCallback, useEffect, useState } from 'react'

import { fetchDfSummary } from '@/services/educenso/educensoDataService'
import type { DfSummaryResponse } from '@/types/educenso'

interface UseDfSummaryParams {
  source?: string
  year?: number
}

export function useDfSummary(params: UseDfSummaryParams) {
  const [data, setData] = useState<DfSummaryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    let isMounted = true

    try {
      const response = await fetchDfSummary(params)
      if (isMounted) {
        setData(response)
        setError(null)
      }
    } catch (nextError) {
      if (isMounted) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar o resumo do DF.',
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
  }, [params.year, params.source])

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
