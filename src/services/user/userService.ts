import { readAuthSession } from '@/services/auth/authSession'
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '@/services/supabase/client'
import type { AuthUser } from '@/types/auth'

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

function normalizePerfil(perfil: UsuarioRow['perfil']): PerfilRow | null {
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

async function getAuthenticatedClient() {
  if (!isSupabaseConfigured) {
    return null
  }

  const supabase = await getSupabaseClient()

  if (!supabase) {
    return null
  }

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return {
    authUser: data.user,
    supabase,
  }
}

export async function fetchCurrentUserAccount(): Promise<AuthUser | null> {
  const authenticatedClient = await getAuthenticatedClient()

  if (!authenticatedClient) {
    return readAuthSession()
  }

  const { authUser, supabase } = authenticatedClient

  const { data, error } = await supabase
    .from('usuario')
    .select(
      'id_usuario, auth_user_id, nome, data_nascimento, CPF, email, telefone, endereco, id_perfil, perfil(id_perfil, descricao)',
    )
    .eq('auth_user_id', authUser.id)
    .maybeSingle()

  if (error) {
    throw new Error(
      'Nao foi possivel carregar os dados mais recentes da conta.',
    )
  }

  const row = data as UsuarioRow | null

  if (!row) {
    return null
  }

  return mapUsuarioRow(row)
}

export async function fetchProfiles(): Promise<ProfileOption[]> {
  const supabase = await getSupabaseClient()

  if (!isSupabaseConfigured || !supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('perfil')
    .select('id_perfil, descricao')
    .order('descricao', { ascending: true })

  if (error) {
    throw new Error('Nao foi possivel carregar os perfis disponiveis.')
  }

  return ((data as PerfilRow[] | null) ?? []).map((perfil) => ({
    id: perfil.id_perfil,
    description: perfil.descricao,
  }))
}

export async function updateCurrentUserAccount(
  payload: UpdateUserAccountPayload,
): Promise<AuthUser> {
  const authenticatedClient = await getAuthenticatedClient()

  if (!authenticatedClient) {
    throw new Error('Atualizacao indisponivel sem autenticacao ativa.')
  }

  const { authUser, supabase } = authenticatedClient

  const { error: authUpdateError } = await supabase.auth.updateUser({
    ...(payload.email !== authUser.email ? { email: payload.email } : {}),
    data: {
      address: payload.address,
      birth_date: payload.birthDate,
      cpf: payload.cpf,
      name: payload.name,
      phone: payload.phone,
      profile_id: payload.profileId,
    },
  })

  if (authUpdateError) {
    throw new Error(authUpdateError.message)
  }

  const { error } = await supabase
    .from('usuario')
    .update({
      CPF: payload.cpf,
      data_nascimento: payload.birthDate || null,
      email: payload.email,
      endereco: payload.address,
      id_perfil: payload.profileId ?? null,
      nome: payload.name,
      telefone: payload.phone,
    })
    .eq('auth_user_id', authUser.id)

  if (error) {
    throw new Error('Nao foi possivel atualizar os dados da conta.')
  }

  const updatedUser = await fetchCurrentUserAccount()

  if (!updatedUser) {
    throw new Error('Nao foi possivel recarregar os dados apos a atualizacao.')
  }

  return updatedUser
}
