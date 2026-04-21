import { MODELING_NOTICE } from '@/constants/educenso'
import { EDUCENSO_FUTURE_INDICATORS } from '@/constants/educenso'
import {
  applyAnalysisFilters,
  buildAnalyticalTableRows,
  buildComparisonData,
  buildDashboardIndicators,
  buildFilterOptions,
  buildTrendData,
  dedupeAnalysisRecords,
  formatLocationLabel,
  toNumber,
} from '@/features/educenso/utils/analytics'
import { interpretLikert } from '@/features/educenso/utils/likert'
import {
  buildRecommendationSummary,
  buildRecommendationsFromRecords,
} from '@/features/educenso/utils/recommendations'
import { buildDfHeatMapFallback } from '@/features/educenso/utils/heatmap'
import { fetchDfHeatMapFromBackend } from '@/services/educenso/ibgeDfService'
import { getSupabaseClient } from '@/services/supabase/client'
import type {
  AnalysisRecord,
  EducensoAnalysisFilters,
  EducensoDashboardResponse,
  FatoEducacao,
  FatoSocioeconomico,
  Localidade,
  Relatorio,
} from '@/types/educenso'

interface LocalidadeRow {
  id_localidade: number
  codigo_ibge: number
  UF: string
  municipio: string
  setor_censitario: string | null
  data_criacao: string | null
}

interface FatoEducacaoRow {
  id_fato_educacao: number
  ano: number
  taxa_matricula: number | string
  taxa_frequencia_escolar: number | string
  taxa_analfabetismo: number | string
  data_criacao: string | null
}

interface FatoSocioeconomicoRow {
  id_fato_socioeconomico: number
  ano: number
  renda_per_capita: number | string | null
  acesso_internet_perc: number | string | null
  acesso_saneamento_perc: number | string | null
  data_criacao: string | null
}

interface RelatorioRow {
  id_relatorio: number
  tipo: number | string
  likert_educacao: number | string
  likert_socioeconomico: number | string
  avaliacao: string
  filtros_aplicados: string | null
  politica_publica: string
  data_criacao: string | null
  id_usuario: number
  id_fato_educacao: number
  id_fato_socioeconomico: number
  id_dim_localidade: number
  dim_localidade: LocalidadeRow | LocalidadeRow[] | null
  fato_educacao: FatoEducacaoRow | FatoEducacaoRow[] | null
  fato_socioeconomico:
    | FatoSocioeconomicoRow
    | FatoSocioeconomicoRow[]
    | null
}

function normalizeNestedRow<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null
  }

  return Array.isArray(value) ? (value[0] ?? null) : value
}

function mapLocalidade(row: LocalidadeRow): Localidade {
  return {
    idLocalidade: row.id_localidade,
    codigoIbge: row.codigo_ibge,
    uf: row.UF,
    municipio: row.municipio,
    setorCensitario: row.setor_censitario,
    dataCriacao: row.data_criacao,
  }
}

function mapFatoEducacao(row: FatoEducacaoRow): FatoEducacao {
  return {
    idFatoEducacao: row.id_fato_educacao,
    ano: row.ano,
    taxaMatricula: toNumber(row.taxa_matricula) ?? 0,
    taxaFrequenciaEscolar: toNumber(row.taxa_frequencia_escolar) ?? 0,
    taxaAnalfabetismo: toNumber(row.taxa_analfabetismo) ?? 0,
    dataCriacao: row.data_criacao,
  }
}

function mapFatoSocioeconomico(row: FatoSocioeconomicoRow): FatoSocioeconomico {
  return {
    idFatoSocioeconomico: row.id_fato_socioeconomico,
    ano: row.ano,
    rendaPerCapita: toNumber(row.renda_per_capita),
    acessoInternetPerc: toNumber(row.acesso_internet_perc),
    acessoSaneamentoPerc: toNumber(row.acesso_saneamento_perc),
    dataCriacao: row.data_criacao,
  }
}

function mapRelatorio(row: RelatorioRow): Relatorio | null {
  const localidadeRow = normalizeNestedRow(row.dim_localidade)
  const fatoEducacaoRow = normalizeNestedRow(row.fato_educacao)
  const fatoSocioeconomicoRow = normalizeNestedRow(row.fato_socioeconomico)

  if (!localidadeRow || !fatoEducacaoRow || !fatoSocioeconomicoRow) {
    return null
  }

  return {
    idRelatorio: row.id_relatorio,
    tipo: toNumber(row.tipo) ?? 0,
    likertEducacao: toNumber(row.likert_educacao) ?? 0,
    likertSocioeconomico: toNumber(row.likert_socioeconomico) ?? 0,
    avaliacao: row.avaliacao,
    filtrosAplicados: row.filtros_aplicados,
    politicaPublica: row.politica_publica,
    dataCriacao: row.data_criacao,
    idUsuario: row.id_usuario,
    idFatoEducacao: row.id_fato_educacao,
    idFatoSocioeconomico: row.id_fato_socioeconomico,
    idDimLocalidade: row.id_dim_localidade,
    localidade: mapLocalidade(localidadeRow),
    fatoEducacao: mapFatoEducacao(fatoEducacaoRow),
    fatoSocioeconomico: mapFatoSocioeconomico(fatoSocioeconomicoRow),
  }
}

async function fetchRawAnalysisRecords() {
  const supabase = await getSupabaseClient()

  if (!supabase) {
    throw new Error('Supabase indisponivel para carregar os dados analiticos.')
  }

  const { data, error } = await supabase
    .from('relatorio')
    .select(
      'id_relatorio, tipo, likert_educacao, likert_socioeconomico, avaliacao, filtros_aplicados, politica_publica, data_criacao, id_usuario, id_fato_educacao, id_fato_socioeconomico, id_dim_localidade, dim_localidade(id_localidade, codigo_ibge, UF, municipio, setor_censitario, data_criacao), fato_educacao(id_fato_educacao, ano, taxa_matricula, taxa_frequencia_escolar, taxa_analfabetismo, data_criacao), fato_socioeconomico(id_fato_socioeconomico, ano, renda_per_capita, acesso_internet_perc, acesso_saneamento_perc, data_criacao)',
    )
    .order('data_criacao', { ascending: false })

  if (error) {
    throw new Error('Nao foi possivel carregar a base analitica.')
  }

  return ((data as RelatorioRow[] | null) ?? [])
    .map(mapRelatorio)
    .filter((record): record is Relatorio => record !== null)
    .map<AnalysisRecord>((report) => ({
      report,
      localidade: report.localidade!,
      fatoEducacao: report.fatoEducacao!,
      fatoSocioeconomico: report.fatoSocioeconomico!,
    }))
}

export async function fetchEducensoDashboard(
  filters: EducensoAnalysisFilters,
): Promise<EducensoDashboardResponse> {
  const rawRecords = await fetchRawAnalysisRecords()
  const dfRecords = rawRecords.filter((record) => record.localidade.uf === 'DF')
  const normalizedFilters: EducensoAnalysisFilters = {
    ...filters,
    uf: 'DF',
  }
  const filterOptions = buildFilterOptions(dfRecords)
  const filteredRecords = applyAnalysisFilters(dfRecords, normalizedFilters)
  const uniqueRecords = dedupeAnalysisRecords(filteredRecords)
  const recommendations = buildRecommendationsFromRecords(uniqueRecords)
  const recommendationSummaryByKey = new Map<string, string>()

  uniqueRecords.forEach((record) => {
    const key = [
      record.localidade.idLocalidade,
      record.fatoEducacao.idFatoEducacao,
      record.fatoSocioeconomico.idFatoSocioeconomico,
    ].join(':')

    recommendationSummaryByKey.set(
      key,
      buildRecommendationSummary(record).summary,
    )
  })

  const averageLikertEducation =
    filteredRecords.reduce((sum, record) => sum + record.report.likertEducacao, 0) /
    Math.max(filteredRecords.length, 1)
  const averageLikertSocio =
    filteredRecords.reduce(
      (sum, record) => sum + record.report.likertSocioeconomico,
      0,
    ) / Math.max(filteredRecords.length, 1)
  const backendHeatMap = await fetchDfHeatMapFromBackend().catch(() => null)
  const heatMap = backendHeatMap ?? buildDfHeatMapFallback(uniqueRecords)

  return {
    filters: normalizedFilters,
    filterOptions,
    indicators: buildDashboardIndicators(uniqueRecords),
    trend: buildTrendData(uniqueRecords),
    comparisons: buildComparisonData(uniqueRecords),
    tableRows: buildAnalyticalTableRows(uniqueRecords, recommendationSummaryByKey),
    recommendations,
    likertSummary: {
      educacao: interpretLikert(averageLikertEducation || 1),
      socioeconomico: interpretLikert(averageLikertSocio || 1),
    },
    heatMap,
    totalRecords: uniqueRecords.length,
    futureIndicators: [...EDUCENSO_FUTURE_INDICATORS],
    modelNotice: MODELING_NOTICE,
  }
}

export function buildFiltersAppliedLabel(filters: EducensoAnalysisFilters) {
  const parts: string[] = []

  if (filters.year) {
    parts.push(`Ano: ${filters.year}`)
  }

  if (filters.uf) {
    parts.push(`UF: ${filters.uf}`)
  }

  if (filters.municipality) {
    parts.push(`Municipio: ${filters.municipality}`)
  }

  if (filters.censusSector) {
    parts.push(`Setor censitario: ${filters.censusSector}`)
  }

  if (filters.reportType) {
    parts.push(`Tipo: ${filters.reportType}`)
  }

  return parts.length ? parts.join(' | ') : 'Sem filtros adicionais.'
}

export function buildReportContextLabel(record: AnalysisRecord) {
  return `${formatLocationLabel(record)} - ${record.fatoEducacao.ano}`
}
