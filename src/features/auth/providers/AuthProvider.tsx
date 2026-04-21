import { useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/contexts/AuthContext'
import { persistAuthSession } from '@/services/auth/authSession'
import {
  getCurrentAuthUser,
  isSupabaseConfigured,
  logout as logoutAuth,
  onAuthStateChange,
} from '@/services/auth/authService'
import type { AuthUser } from '@/types/auth'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    void getCurrentAuthUser().then((nextUser) => {
      if (!isMounted) {
        return
      }

      setUser(nextUser)
      setIsAuthReady(true)
    })

    const unsubscribe = onAuthStateChange((nextUser) => {
      if (!isMounted) {
        return
      }

      setUser(nextUser)
      setIsAuthReady(true)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthReady,
      isAuthenticated: user !== null,
      login: (nextUser) => {
        if (!isSupabaseConfigured) {
          persistAuthSession(nextUser)
        }

        setUser(nextUser)
      },
      logout: async () => {
        await logoutAuth()
        setUser(null)
      },
      user,
    }),
    [isAuthReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
