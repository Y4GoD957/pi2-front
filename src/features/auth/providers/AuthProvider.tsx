import { useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/contexts/AuthContext'
import {
  clearAuthSession,
  persistAuthSession,
  readAuthSession,
} from '@/services/auth/authSession'
import type { AuthUser } from '@/types/auth'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => readAuthSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      login: (nextUser) => {
        persistAuthSession(nextUser)
        setUser(nextUser)
      },
      logout: () => {
        clearAuthSession()
        setUser(null)
      },
      user,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
