import { useCallback, useEffect, useState } from 'react'

import {
  deletePublicPolicy,
  fetchPublicPolicyById,
} from '@/services/publicPolicies/publicPolicyService'
import type { PublicPolicyDetail } from '@/types/publicPolicy'

export function usePublicPolicyDetail(policyId: number | null) {
  const [data, setData] = useState<PublicPolicyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!policyId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchPublicPolicyById(policyId)
      setData(response)
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel carregar a politica publica.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [policyId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const remove = useCallback(async () => {
    if (!policyId) {
      throw new Error('Politica publica invalida para exclusao.')
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await deletePublicPolicy(policyId)
      return response
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel excluir a politica publica.'

      setError(message)
      throw new Error(message)
    } finally {
      setIsDeleting(false)
    }
  }, [policyId])

  return {
    data,
    error,
    isDeleting,
    isLoading,
    refresh,
    remove,
  }
}
