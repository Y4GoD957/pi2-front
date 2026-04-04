import type { AuthUser } from '@/types/auth'

const AUTH_STORAGE_KEY = 'educenso.auth.session'

interface StoredAuthSession {
  user: AuthUser
}

export function readAuthSession(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const session = JSON.parse(rawValue) as StoredAuthSession

    if (
      !session ||
      typeof session !== 'object' ||
      !session.user ||
      typeof session.user.id !== 'string' ||
      typeof session.user.email !== 'string' ||
      typeof session.user.name !== 'string'
    ) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return session.user
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function persistAuthSession(user: AuthUser) {
  if (typeof window === 'undefined') {
    return
  }

  const session: StoredAuthSession = { user }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
