export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  cpf: string
  birthDate: string
  phone: string
  address: string
  profileId: number
}

export interface AuthUser {
  id: string
  email: string
  name: string
  cpf?: string
  birthDate?: string
  phone?: string
  address?: string
  profileId?: number
  profileDescription?: string
}

export interface LoginResponse {
  token: string | null
  user: AuthUser
}

export interface RegisterResponse {
  message: string
}
