import { useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/contexts/AuthContext'
import {
  persistAuthSession,
  readAuthSessionData,
} from '@/services/auth/authSession'
import {
  getCurrentAuthUser,
  logout as logoutAuth,
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

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthReady,
      isAuthenticated: user !== null,
      login: (nextUser) => {
        const sessionData = readAuthSessionData()
        if (sessionData?.token) {
          persistAuthSession({
            token: sessionData.token,
            user: nextUser,
          })
        }

        setUser(nextUser)
      },
      updateUser: (nextUser) => {
        const sessionData = readAuthSessionData()
        if (sessionData?.token) {
          persistAuthSession({
            token: sessionData.token,
            user: nextUser,
          })
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
