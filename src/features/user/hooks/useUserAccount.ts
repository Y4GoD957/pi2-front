import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  fetchCurrentUserAccount,
  type UpdateUserAccountPayload,
  updateCurrentUserAccount,
} from '@/services/user/userService'
import type { AuthUser } from '@/types/auth'

export function useUserAccount() {
  const { isAuthReady, updateUser, user: authUser } = useAuth()
  const [user, setUser] = useState<AuthUser | null>(authUser)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  useEffect(() => {
    setUser((currentUser) => {
      if (!authUser) {
        return null
      }

      if (
        currentUser &&
        currentUser.id === authUser.id &&
        currentUser.name === authUser.name &&
        currentUser.email === authUser.email &&
        currentUser.cpf === authUser.cpf &&
        currentUser.birthDate === authUser.birthDate &&
        currentUser.phone === authUser.phone &&
        currentUser.address === authUser.address &&
        currentUser.profileId === authUser.profileId &&
        currentUser.profileDescription === authUser.profileDescription
      ) {
        return currentUser
      }

      return authUser
    })
  }, [authUser])

  const refresh = useCallback(async () => {
    if (!isAuthReady) {
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const nextUser = await fetchCurrentUserAccount()

      setUser(nextUser)

      if (nextUser) {
        updateUser(nextUser)
      }

      setHasLoadedOnce(true)
      return nextUser
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel carregar a conta.'

      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isAuthReady, updateUser])

  useEffect(() => {
    if (!isAuthReady) {
      return
    }

    if (hasLoadedOnce) {
      return
    }

    void refresh()
  }, [hasLoadedOnce, isAuthReady, refresh])

  const save = useCallback(
    async (payload: UpdateUserAccountPayload) => {
      setIsSaving(true)
      setError(null)

      try {
        const updatedUser = await updateCurrentUserAccount(payload)
        setUser(updatedUser)
        updateUser(updatedUser)
        return updatedUser
      } catch (nextError) {
        const message =
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel salvar as alteracoes.'

        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [updateUser],
  )

  return {
    error,
    hasLoadedOnce,
    isLoading,
    isSaving,
    refresh,
    save,
    user,
  }
}
