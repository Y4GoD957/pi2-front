import { createContext } from 'react'

import type { AuthUser } from '@/types/auth'

export interface AuthContextValue {
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)
