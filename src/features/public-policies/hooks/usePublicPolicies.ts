import { useCallback, useEffect, useState } from 'react'

import { fetchPublicPolicies } from '@/services/publicPolicies/publicPolicyService'
import type { PublicPolicySummary } from '@/types/publicPolicy'

export function usePublicPolicies() {
  const [items, setItems] = useState<PublicPolicySummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchPublicPolicies()
      setItems(response.items)
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel carregar as politicas publicas.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    items,
    isLoading,
    error,
    refresh,
  }
}
