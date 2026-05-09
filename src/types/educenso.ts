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
  id: string
  label: string
  value: number | null
  unit: string
  description: string
  status?: DataStatus
  sourceName?: string
  severity?: SeverityLevel
  warnings?: string[]
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
  dataStatus?: DataStatus
  sourceName?: string
  warnings?: string[]
}

export interface PublicPolicyRecommendation {
  id: string
  title: string
  summary: string
  rationale: string
  emphasis: 'education' | 'socioeconomic' | 'intersectoral'
  relatedTo?: string[]
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
  source: 'backend-fallback' | 'ibge-fastapi' | 'supabase'
  dataStatus?: DataStatus
  severity?: SeverityLevel
  classificationLabel?: string
  trendDirection?: TrendDirection
  explanation?: string
  sourceReliability?: ReliabilityLevel
}

export interface DfHeatMapData {
  title: string
  subtitle: string
  areas: DfHeatMapArea[]
  sourceLabel: string
  geometryStatus: 'real' | 'fallback'
  notes: string[]
  dataStatus?: DataStatus
  sourceReliability?: ReliabilityLevel
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

export type DataStatus = 'oficial' | 'estimado' | 'indisponivel' | 'simulado'
export type SeverityLevel =
  | 'baixo'
  | 'moderado'
  | 'alto'
  | 'critico'
  | 'indefinido'
export type TrendDirection =
  | 'melhora'
  | 'piora'
  | 'estavel'
  | 'insuficiente'
  | 'indefinido'
export type ReliabilityLevel = 'alta' | 'media' | 'baixa' | 'desconhecida'

export interface SourceMetadata {
  nome: string
  endpoint: string
  url?: string | null
  codigo_tabela?: string | null
  parametros: Record<string, string>
  obtido_em: string
  confiabilidade: ReliabilityLevel
  granularidade?: string | null
  aviso_granularidade?: string | null
}

export interface RecommendationHint {
  titulo: string
  descricao: string
  prioridade: SeverityLevel
  relacionado_a: string[]
}

export interface TrendInterpretation {
  direcao: TrendDirection
  descricao: string
  variacao_absoluta?: number | null
  variacao_percentual?: number | null
}

export interface IndicatorInterpretation {
  resumo: string
  nivel_severidade: SeverityLevel
  score_normalizado?: number | null
  leitura?: string | null
  tendencia?: TrendInterpretation | null
  dicas_recomendacao: RecommendationHint[]
  explicacao?: string | null
}

export interface IndicatorSourceAvailability {
  disponivel: boolean
  motivo?: string | null
  fonte_sugerida?: string | null
  metadados_fonte?: SourceMetadata | null
}

export interface CorrelationContext {
  dimensoes: string[]
  chaves_correlacao: string[]
  pronto_para_ia: boolean
}

export interface IndicatorHistoricalPoint {
  ano: number
  valor?: number | null
  status_dado: DataStatus
}

export interface NormalizedIndicatorValue {
  indicador: string
  rotulo: string
  tema: string
  ano?: number | null
  unidade?: string | null
  valor_bruto?: number | null
  valor_normalizado?: number | null
  status_dado: DataStatus
  interpretacao?: IndicatorInterpretation | null
  metadados_fonte: SourceMetadata
  avisos: string[]
  disponibilidade: IndicatorSourceAvailability
  contexto_correlacao: CorrelationContext
  serie_historica: IndicatorHistoricalPoint[]
}

export interface DataSourceStatus {
  chave: string
  nome: string
  descricao: string
  status: 'integrado' | 'parcial' | 'pendente'
  cobertura: string
  mensagens: string[]
}

export interface DataSourcesResponse {
  fontes: DataSourceStatus[]
  gerado_em: string
}

export interface DfIndicatorsResponse {
  ano?: number | null
  tema?: string | null
  indicador?: string | null
  fonte?: string | null
  indicadores: NormalizedIndicatorValue[]
  avisos: string[]
}

export interface HeatmapAreaInterpretation {
  classificacao?: string | null
  severidade: SeverityLevel
  interpretacao?: string | null
  direcao_tendencia: TrendDirection
  metadados_explicacao?: string | null
  confiabilidade_fonte: ReliabilityLevel
}

export interface DfHeatmapAreaResponse {
  locality_id: string
  locality_name: string
  ibge_code?: string | null
  uf: string
  year?: number | null
  indicator_key: string
  indicator_label: string
  raw_value?: number | null
  normalized_value?: number | null
  unit?: string | null
  classification_level?: string | null
  classification_label?: string | null
  source: string
  source_metadata: SourceMetadata
  status_dado: DataStatus
  interpretacao: HeatmapAreaInterpretation
  warnings: string[]
}

export interface DfHeatmapResponse {
  year?: number | null
  indicator?: string | null
  source?: string | null
  areas: DfHeatmapAreaResponse[]
  warnings: string[]
}

export interface ChartSeriesPoint {
  label: string
  value?: number | null
  year?: number | null
  status_dado: DataStatus
}

export interface DfChartsResponse {
  year?: number | null
  indicator?: string | null
  source?: string | null
  bar_chart_data: ChartSeriesPoint[]
  historical_series: ChartSeriesPoint[]
  table_data: Array<Record<string, string | number | null>>
  source_metadata: SourceMetadata[]
  recommendation_hints: RecommendationHint[]
  warnings: string[]
}

export interface SummaryCard {
  id: string
  label: string
  valor?: number | null
  unidade?: string | null
  descricao?: string | null
  status_dado: DataStatus
}

export interface DfSummaryResponse {
  year?: number | null
  source?: string | null
  summary_cards: SummaryCard[]
  total_registros: number
  media?: number | null
  minimo?: number | null
  maximo?: number | null
  source_metadata: SourceMetadata[]
  warnings: string[]
}
