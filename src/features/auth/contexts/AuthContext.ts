import { createContext } from 'react'

import type { AuthUser } from '@/types/auth'

export interface AuthContextValue {
  isAuthenticated: boolean
  isAuthReady: boolean
  login: (user: AuthUser) => void
  logout: () => Promise<void>
  updateUser: (user: AuthUser) => void
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)
