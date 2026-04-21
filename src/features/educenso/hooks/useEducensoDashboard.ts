import { useCallback, useEffect, useState } from 'react'

import { fetchEducensoDashboard } from '@/services/educenso/analyticsService'
import type {
  EducensoAnalysisFilters,
  EducensoDashboardResponse,
} from '@/types/educenso'

const INITIAL_FILTERS: EducensoAnalysisFilters = {}

export function useEducensoDashboard() {
  const [filters, setFilters] = useState<EducensoAnalysisFilters>(INITIAL_FILTERS)
  const [data, setData] = useState<EducensoDashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (nextFilters: EducensoAnalysisFilters) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchEducensoDashboard(nextFilters)
      setData(response)
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel carregar o dashboard analitico.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(filters)
  }, [filters, refresh])

  return {
    data,
    error,
    filters,
    isLoading,
    refresh: () => refresh(filters),
    setFilters,
  }
}
