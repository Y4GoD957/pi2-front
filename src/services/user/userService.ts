import {
  persistAuthSession,
  readAuthSessionData,
} from '@/services/auth/authSession'
import { apiRequest } from '@/services/api/client'
import type { AuthUser } from '@/types/auth'

export interface ProfileOption {
  id: number
  description: string
}

export interface UpdateUserAccountPayload {
  address: string
  birthDate: string
  cpf: string
  email: string
  name: string
  phone: string
  profileId?: number
}

export async function fetchCurrentUserAccount(): Promise<AuthUser | null> {
  return apiRequest<AuthUser | null>('/users/me', {
    requiresAuth: true,
  })
}

export async function fetchProfiles(): Promise<ProfileOption[]> {
  return apiRequest<ProfileOption[]>('/profiles')
}

export async function updateCurrentUserAccount(
  payload: UpdateUserAccountPayload,
): Promise<AuthUser> {
  const updatedUser = await apiRequest<AuthUser>('/users/me', {
    method: 'PUT',
    requiresAuth: true,
    body: JSON.stringify(payload),
  })

  const sessionData = readAuthSessionData()
  if (sessionData?.token) {
    persistAuthSession({
      token: sessionData.token,
      user: updatedUser,
    })
  }

  return updatedUser
}
