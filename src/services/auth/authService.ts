import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/auth'
import {
  clearAuthSession,
  persistAuthSession,
  readAuthSessionData,
} from '@/services/auth/authSession'
import { apiRequest } from '@/services/api/client'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.token) {
    throw new Error('Nao foi possivel recuperar o token da sessao.')
  }

  persistAuthSession({
    token: response.token,
    user: response.user,
  })

  return response
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const sessionData = readAuthSessionData()

  if (!sessionData?.token) {
    return null
  }

  try {
    const user = await apiRequest<AuthUser>('/auth/me', {
      requiresAuth: true,
    })

    persistAuthSession({
      token: sessionData.token,
      user,
    })

    return user
  } catch {
    clearAuthSession()
    return null
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return () => {
    callback(null)
  }
}

export async function logout() {
  clearAuthSession()
}
