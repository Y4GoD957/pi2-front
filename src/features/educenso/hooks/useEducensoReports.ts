import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  buildReportFilterOptions,
  fetchUserReports,
} from '@/services/educenso/reportService'
import type { EducensoAnalysisFilters, ReportListItem } from '@/types/educenso'

export function useEducensoReports() {
  const { isAuthReady, user } = useAuth()
  const [filters, setFilters] = useState<EducensoAnalysisFilters>({})
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthReady || !user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const nextReports = await fetchUserReports(Number(user.id), filters)
      setReports(nextReports)
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel carregar os relatorios.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [filters, isAuthReady, user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const filterOptions = useMemo(() => buildReportFilterOptions(reports), [reports])

  return {
    error,
    filterOptions,
    filters,
    isLoading,
    refresh,
    reports,
    setFilters,
  }
}
