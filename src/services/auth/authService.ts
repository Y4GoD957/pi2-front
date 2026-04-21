import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/auth'
import { clearAuthSession, readAuthSession } from '@/services/auth/authSession'
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '@/services/supabase/client'

const MOCK_CREDENTIALS = {
  email: 'admin@educenso.dev',
  password: '123456',
}

interface PerfilRow {
  id_perfil: number
  descricao: string
}

interface UsuarioRow {
  id_usuario: number
  auth_user_id: string
  nome: string
  data_nascimento: string | null
  CPF: string | null
  email: string
  telefone: string | null
  endereco: string | null
  id_perfil: number | null
  perfil: PerfilRow | PerfilRow[] | null
}

function buildMockUser(): AuthUser {
  return {
    id: '1',
    email: MOCK_CREDENTIALS.email,
    name: 'Administrador EduCenso',
    profileId: 1,
    profileDescription: 'Administrador',
  }
}

function normalizePerfil(
  perfil: UsuarioRow['perfil'],
): PerfilRow | null {
  if (!perfil) {
    return null
  }

  return Array.isArray(perfil) ? (perfil[0] ?? null) : perfil
}

function mapUsuarioRow(row: UsuarioRow): AuthUser {
  const perfil = normalizePerfil(row.perfil)

  return {
    id: String(row.id_usuario),
    email: row.email,
    name: row.nome,
    cpf: row.CPF ?? undefined,
    birthDate: row.data_nascimento ?? undefined,
    phone: row.telefone ?? undefined,
    address: row.endereco ?? undefined,
    profileId: row.id_perfil ?? undefined,
    profileDescription: perfil?.descricao ?? undefined,
  }
}

async function fetchUsuarioByAuthUserId(
  authUserId: string,
): Promise<AuthUser> {
  const supabase = await getSupabaseClient()

  if (!supabase) {
    throw new Error('Servico de autenticacao indisponivel no momento.')
  }

  const { data, error } = await supabase
    .from('usuario')
    .select(
      'id_usuario, auth_user_id, nome, data_nascimento, CPF, email, telefone, endereco, id_perfil, perfil(id_perfil, descricao)',
    )
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (error) {
    throw new Error(
      'Nao foi possivel carregar os dados do usuario no momento.',
    )
  }

  const row = data as UsuarioRow | null

  if (!row) {
    throw new Error('Nao foi possivel localizar os dados da sua conta.')
  }

  return mapUsuarioRow(row)
}

async function loginWithMock(payload: LoginPayload): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (
    payload.email.toLowerCase() !== MOCK_CREDENTIALS.email ||
    payload.password !== MOCK_CREDENTIALS.password
  ) {
    throw new Error('E-mail ou senha incorretos.')
  }

  return {
    token: 'mock-jwt-token',
    user: buildMockUser(),
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (!isSupabaseConfigured) {
    return loginWithMock(payload)
  }

  const supabase = await getSupabaseClient()

  if (!supabase) {
    return loginWithMock(payload)
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error('Nao foi possivel recuperar os dados do usuario.')
  }

  return {
    token: data.session?.access_token ?? null,
    user: await fetchUsuarioByAuthUserId(data.user.id),
  }
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  if (!isSupabaseConfigured) {
    await new Promise((resolve) => setTimeout(resolve, 900))

    return {
      message: `Cadastro recebido para ${payload.email}. Voce podera concluir o acesso assim que a liberacao estiver disponivel.`,
    }
  }

  const supabase = await getSupabaseClient()

  if (!supabase) {
    await new Promise((resolve) => setTimeout(resolve, 900))

    return {
      message: `Cadastro recebido para ${payload.email}. Voce podera concluir o acesso assim que a liberacao estiver disponivel.`,
    }
  }

  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        name: payload.name,
        cpf: payload.cpf,
        birth_date: payload.birthDate,
        phone: payload.phone,
        address: payload.address,
        profile_id: payload.profileId,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    message:
      'Cadastro enviado com sucesso. Verifique seu e-mail para concluir a ativacao da conta, se necessario.',
  }
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) {
    return readAuthSession()
  }

  const supabase = await getSupabaseClient()

  if (!supabase) {
    return readAuthSession()
  }

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return fetchUsuarioByAuthUserId(data.user.id)
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!isSupabaseConfigured) {
    return () => undefined
  }

  let unsubscribe = () => undefined

  void getSupabaseClient().then((supabase) => {
    if (!supabase) {
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        callback(null)
        return
      }

      void fetchUsuarioByAuthUserId(session.user.id)
        .then((user) => callback(user))
        .catch(() => callback(null))
    })

    unsubscribe = () => {
      subscription.unsubscribe()
    }
  })

  return () => {
    unsubscribe()
  }
}

export async function logout() {
  clearAuthSession()

  if (!isSupabaseConfigured) {
    return
  }

  const supabase = await getSupabaseClient()

  if (!supabase) {
    return
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export { isSupabaseConfigured }
