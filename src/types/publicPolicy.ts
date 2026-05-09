export interface PublicPolicyObjective {
  id: number
  ordem: number
  descricao: string
}

export interface PublicPolicyNamedRelation {
  id: number
  nome: string
}

export interface PublicPolicySummary {
  id: number
  titulo: string
  objetivo_geral: string
  indicador_chave?: string | null
  id_dim_localidade?: number | null
  id_relatorio?: number | null
  data_criacao?: string | null
  data_atualizacao?: string | null
  instituicoes_responsaveis: PublicPolicyNamedRelation[]
  beneficiarios: PublicPolicyNamedRelation[]
  objetivos_especificos: PublicPolicyObjective[]
}

export interface PublicPolicyDetail extends PublicPolicySummary {
  id_usuario_criador: number
  localidade_nome?: string | null
  localidade_uf?: string | null
  relatorio_resumo?: string | null
}

export interface PublicPolicyListResponse {
  items: PublicPolicySummary[]
}

export interface PublicPolicyDeleteResponse {
  message: string
}

export interface PublicPolicyFormLocalityOption {
  id: number
  nome: string
  uf: string
  codigo_ibge?: number | null
}

export interface PublicPolicyIndicatorOption {
  chave: string
  nome: string
}

export interface PublicPolicyReportOption {
  id: number
  titulo: string
  data_criacao?: string | null
}

export interface PublicPolicyFormOptions {
  localidades: PublicPolicyFormLocalityOption[]
  indicadores_disponiveis: PublicPolicyIndicatorOption[]
  relatorios: PublicPolicyReportOption[]
}

export interface PublicPolicyObjectivePayload {
  descricao: string
}

export interface PublicPolicyPayload {
  titulo: string
  objetivo_geral: string
  objetivos_especificos: PublicPolicyObjectivePayload[]
  instituicoes_responsaveis: string[]
  beneficiarios: string[]
  id_dim_localidade?: number | null
  indicador_chave?: string | null
  id_relatorio?: number | null
}

export interface PublicPolicyFormData {
  titulo: string
  objetivo_geral: string
  objetivos_especificos: string[]
  instituicoes_responsaveis: string[]
  beneficiarios: string[]
  id_dim_localidade: string
  indicador_chave: string
  id_relatorio: string
}

export interface PublicPolicyFormErrors {
  titulo?: string
  objetivo_geral?: string
  objetivos_especificos?: string
  instituicoes_responsaveis?: string
  beneficiarios?: string
}
