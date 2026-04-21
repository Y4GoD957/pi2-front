import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { fetchReportById } from '@/services/educenso/reportService'

type ReportDetailState = Awaited<ReturnType<typeof fetchReportById>> | null

export function useEducensoReportDetail(reportId: number | null) {
  const { isAuthReady, user } = useAuth()
  const [data, setData] = useState<ReportDetailState>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthReady || !user || !reportId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const nextData = await fetchReportById(Number(user.id), reportId)
      setData(nextData)
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel carregar o detalhe do relatorio.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [isAuthReady, reportId, user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    data,
    error,
    isLoading,
    refresh,
  }
}
