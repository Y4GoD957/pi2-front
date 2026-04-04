import type { LoginPayload, LoginResponse } from '@/types/auth'

const MOCK_CREDENTIALS = {
  email: 'admin@educenso.dev',
  password: '123456',
}

export async function loginWithMock(
  payload: LoginPayload,
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (
    payload.email.toLowerCase() !== MOCK_CREDENTIALS.email ||
    payload.password !== MOCK_CREDENTIALS.password
  ) {
    throw new Error('E-mail ou senha incorretos.')
  }

  return {
    token: 'mock-jwt-token',
    user: {
      id: '1',
      email: MOCK_CREDENTIALS.email,
      name: 'Administrador EduCenso',
    },
  }
}
