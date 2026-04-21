import { clearAuthSession, readAuthSessionData } from '@/services/auth/authSession'

const apiBaseUrl = import.meta.env.VITE_EDUCENSO_API_BASE_URL?.trim()

interface RequestOptions {
  body?: BodyInit | null
  headers?: HeadersInit
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  query?: Record<string, number | string | undefined>
  requiresAuth?: boolean
}

function buildUrl(
  path: string,
  query?: Record<string, number | string | undefined>,
) {
  if (!apiBaseUrl) {
    throw new Error('VITE_EDUCENSO_API_BASE_URL nao configurada no frontend.')
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${apiBaseUrl}${normalizedPath}`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        return
      }

      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return null as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null as T
  }

  return (await response.json()) as T
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (options.requiresAuth) {
    const token = readAuthSessionData()?.token

    if (!token) {
      throw new Error('Sessao expirada. Faca login novamente.')
    }

    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers,
    body: options.body ?? null,
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession()
    }

    const errorBody = await parseResponse<{ detail?: string | Array<{ msg?: string }> }>(
      response,
    ).catch(() => null)

    if (typeof errorBody?.detail === 'string') {
      throw new Error(errorBody.detail)
    }

    if (Array.isArray(errorBody?.detail) && errorBody.detail[0]?.msg) {
      throw new Error(errorBody.detail[0].msg ?? 'Requisicao invalida.')
    }

    throw new Error('Nao foi possivel concluir a requisicao.')
  }

  return parseResponse<T>(response)
}
