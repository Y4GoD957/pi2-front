import { useEffect, useState } from 'react'

import {
  fetchProfiles,
  type ProfileOption,
} from '@/services/user/userService'

export function useProfiles() {
  const [profiles, setProfiles] = useState<ProfileOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    void fetchProfiles()
      .then((nextProfiles) => {
        if (!isMounted) {
          return
        }

        setProfiles(nextProfiles)
        setError(null)
      })
      .catch((nextError) => {
        if (!isMounted) {
          return
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel carregar os perfis.',
        )
      })
      .finally(() => {
        if (!isMounted) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    error,
    isLoading,
    profiles,
  }
}
