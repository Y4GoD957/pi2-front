export interface Perfil {
  idPerfil: number
  descricao: string
  dataCriacao?: string | null
}

export interface Usuario {
  idUsuario: number
  nome: string
  dataNascimento?: string | null
  cpf?: string | null
  email: string
  telefone?: string | null
  endereco?: string | null
  dataCriacao?: string | null
  idPerfil?: number | null
}

export interface Localidade {
  idLocalidade: number
  codigoIbge: number
  uf: string
  municipio: string
  setorCensitario?: string | null
  dataCriacao?: string | null
}

export interface FatoEducacao {
  idFatoEducacao: number
  ano: number
  taxaMatricula: number
  taxaFrequenciaEscolar: number
  taxaAnalfabetismo: number
  dataCriacao?: string | null
}

export interface FatoSocioeconomico {
  idFatoSocioeconomico: number
  ano: number
  rendaPerCapita: number | null
  acessoInternetPerc: number | null
  acessoSaneamentoPerc: number | null
  dataCriacao?: string | null
}

export interface Relatorio {
  idRelatorio: number
  tipo: number
  likertEducacao: number
  likertSocioeconomico: number
  avaliacao: string
  filtrosAplicados?: string | null
  politicaPublica: string
  dataCriacao?: string | null
  idUsuario: number
  idFatoEducacao: number
  idFatoSocioeconomico: number
  idDimLocalidade: number
  localidade?: Localidade | null
  fatoEducacao?: FatoEducacao | null
  fatoSocioeconomico?: FatoSocioeconomico | null
}

export interface EducensoAnalysisFilters {
  year?: number
  uf?: string
  municipality?: string
  censusSector?: string
  reportType?: number
}

export interface EducensoFilterOptions {
  years: number[]
  ufs: string[]
  municipalities: string[]
  censusSectors: string[]
  reportTypes: number[]
}

export interface AnalysisRecord {
  report: Relatorio
  localidade: Localidade
  fatoEducacao: FatoEducacao
  fatoSocioeconomico: FatoSocioeconomico
}

export interface DashboardIndicator {
  id:
    | 'taxaMatricula'
    | 'taxaFrequenciaEscolar'
    | 'taxaAnalfabetismo'
    | 'rendaPerCapita'
    | 'acessoInternetPerc'
    | 'acessoSaneamentoPerc'
  label: string
  value: number | null
  unit: '%' | 'R$'
  description: string
}

export interface DashboardTrendPoint {
  year: number
  taxaMatricula: number | null
  taxaFrequenciaEscolar: number | null
  taxaAnalfabetismo: number | null
  rendaPerCapita: number | null
  acessoInternetPerc: number | null
  acessoSaneamentoPerc: number | null
}

export interface IndicatorComparisonPoint {
  id: string
  label: string
  taxaMatricula: number | null
  taxaFrequenciaEscolar: number | null
  taxaAnalfabetismo: number | null
  rendaPerCapita: number | null
  acessoInternetPerc: number | null
  acessoSaneamentoPerc: number | null
}

export interface AnalyticalTableRow {
  id: string
  year: number
  reportType: number
  reportTypeLabel: string
  locationLabel: string
  uf: string
  municipality: string
  censusSector?: string | null
  enrollmentRate: number | null
  schoolAttendanceRate: number | null
  illiteracyRate: number | null
  perCapitaIncome: number | null
  internetAccess: number | null
  sanitationAccess: number | null
  likertEducacao: number
  likertSocioeconomico: number
  recommendationSummary: string
}

export interface PublicPolicyRecommendation {
  id: string
  title: string
  summary: string
  rationale: string
  emphasis: 'education' | 'socioeconomic' | 'intersectoral'
}

export interface LikertInterpretation {
  numericValue: number
  label: string
  level: 'baixo' | 'moderado' | 'alto'
  description: string
  colorClassName: string
}

export interface DashboardLikertSummary {
  educacao: LikertInterpretation
  socioeconomico: LikertInterpretation
}

export interface DfHeatMapArea {
  id: string
  label: string
  metricLabel: string
  metricValue: number
  normalizedValue: number
  reportCount: number
  year?: number
  svgPath?: string
  source: 'backend-fallback' | 'ibge-fastapi'
}

export interface DfHeatMapData {
  title: string
  subtitle: string
  areas: DfHeatMapArea[]
  sourceLabel: string
  geometryStatus: 'real' | 'fallback'
  notes: string[]
}

export interface EducensoDashboardResponse {
  filters: EducensoAnalysisFilters
  filterOptions: EducensoFilterOptions
  indicators: DashboardIndicator[]
  trend: DashboardTrendPoint[]
  comparisons: IndicatorComparisonPoint[]
  tableRows: AnalyticalTableRow[]
  recommendations: PublicPolicyRecommendation[]
  likertSummary: DashboardLikertSummary
  heatMap: DfHeatMapData
  totalRecords: number
  futureIndicators: string[]
  modelNotice?: string
}

export interface ReportListItem {
  report: Relatorio
  reportTypeLabel: string
  locationLabel: string
  recommendation: PublicPolicyRecommendation
}

export interface CreateReportPayload {
  year: number
  localidadeId: number
  tipo: number
  avaliacao: string
  politicaPublica?: string
  filtrosAplicados?: string
}

export interface CreateReportFormData {
  year: string
  localidadeId: string
  tipo: string
  avaliacao: string
  politicaPublica: string
}

export interface CreateReportFormErrors {
  year?: string
  localidadeId?: string
  tipo?: string
  avaliacao?: string
  politicaPublica?: string
}

export interface ReportFormOptions {
  years: number[]
  localities: Localidade[]
}
