import {
  buildFiltersAppliedLabel,
} from '@/services/educenso/analyticsService'
import { computeEducationLikert, computeSocioeconomicLikert } from '@/features/educenso/utils/likert'
import { buildRecommendationsFromRecords } from '@/features/educenso/utils/recommendations'
import { getSupabaseClient } from '@/services/supabase/client'
import type {
  AnalysisRecord,
  CreateReportPayload,
  EducensoAnalysisFilters,
  FatoEducacao,
  FatoSocioeconomico,
  Localidade,
  Relatorio,
  ReportFormOptions,
  ReportListItem,
} from '@/types/educenso'
import {
  dedupeAnalysisRecords,
  formatLocationLabel,
  getReportTypeLabel,
  toNumber,
} from '@/features/educenso/utils/analytics'

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

async function fetchReportRowsByUser(userId: number) {
  const supabase = await getSupabaseClient()

  if (!supabase) {
    throw new Error('Supabase indisponivel para carregar relatorios.')
  }

  const { data, error } = await supabase
    .from('relatorio')
    .select(
      'id_relatorio, tipo, likert_educacao, likert_socioeconomico, avaliacao, filtros_aplicados, politica_publica, data_criacao, id_usuario, id_fato_educacao, id_fato_socioeconomico, id_dim_localidade, dim_localidade(id_localidade, codigo_ibge, UF, municipio, setor_censitario, data_criacao), fato_educacao(id_fato_educacao, ano, taxa_matricula, taxa_frequencia_escolar, taxa_analfabetismo, data_criacao), fato_socioeconomico(id_fato_socioeconomico, ano, renda_per_capita, acesso_internet_perc, acesso_saneamento_perc, data_criacao)',
    )
    .eq('id_usuario', userId)
    .order('data_criacao', { ascending: false })

  if (error) {
    throw new Error('Nao foi possivel carregar os relatorios do usuario.')
  }

  return ((data as RelatorioRow[] | null) ?? [])
    .map(mapRelatorio)
    .filter((report): report is Relatorio => report !== null)
}

function toAnalysisRecord(report: Relatorio): AnalysisRecord {
  return {
    report,
    localidade: report.localidade!,
    fatoEducacao: report.fatoEducacao!,
    fatoSocioeconomico: report.fatoSocioeconomico!,
  }
}

export async function fetchUserReports(
  userId: number,
  filters: EducensoAnalysisFilters,
): Promise<ReportListItem[]> {
  const reports = await fetchReportRowsByUser(userId)

  const filteredReports = reports.filter((report) => {
    if (filters.year && report.fatoEducacao?.ano !== filters.year) {
      return false
    }

    if (filters.uf && report.localidade?.uf !== filters.uf) {
      return false
    }

    if (filters.municipality && report.localidade?.municipio !== filters.municipality) {
      return false
    }

    if (
      filters.censusSector &&
      report.localidade?.setorCensitario !== filters.censusSector
    ) {
      return false
    }

    if (filters.reportType && report.tipo !== filters.reportType) {
      return false
    }

    return true
  })

  return filteredReports.map((report) => {
    const record = toAnalysisRecord(report)

    return {
      report,
      reportTypeLabel: getReportTypeLabel(report.tipo),
      locationLabel: formatLocationLabel(record),
      recommendation: buildRecommendationsFromRecords([record])[0],
    }
  })
}

export async function fetchReportById(userId: number, reportId: number) {
  const reports = await fetchReportRowsByUser(userId)
  const report = reports.find((item) => item.idRelatorio === reportId)

  if (!report) {
    throw new Error('Relatorio nao encontrado para o usuario autenticado.')
  }

  return {
    report,
    reportTypeLabel: getReportTypeLabel(report.tipo),
    locationLabel: formatLocationLabel(toAnalysisRecord(report)),
    recommendation: buildRecommendationsFromRecords([toAnalysisRecord(report)])[0],
  }
}

export async function fetchReportFormOptions(): Promise<ReportFormOptions> {
  const supabase = await getSupabaseClient()

  if (!supabase) {
    throw new Error('Supabase indisponivel para preparar o formulario.')
  }

  const [
    { data: localidadeData, error: localidadeError },
    { data: educacaoData, error: educacaoError },
    { data: socioData, error: socioError },
  ] = await Promise.all([
    supabase
      .from('dim_localidade')
      .select('id_localidade, codigo_ibge, UF, municipio, setor_censitario, data_criacao')
      .order('UF', { ascending: true })
      .order('municipio', { ascending: true }),
    supabase
      .from('fato_educacao')
      .select('id_fato_educacao, ano')
      .order('ano', { ascending: false }),
    supabase
      .from('fato_socioeconomico')
      .select('id_fato_socioeconomico, ano')
      .order('ano', { ascending: false }),
  ])

  if (localidadeError || educacaoError || socioError) {
    throw new Error('Nao foi possivel carregar as opcoes do formulario.')
  }

  const educationYears = new Set(
    ((educacaoData as Array<{ ano: number }> | null) ?? []).map((row) => row.ano),
  )
  const socioeconomicYears = new Set(
    ((socioData as Array<{ ano: number }> | null) ?? []).map((row) => row.ano),
  )

  const years = Array.from(educationYears).filter((year) =>
    socioeconomicYears.has(year),
  )

  return {
    years: years.sort((left, right) => right - left),
    localities: ((localidadeData as LocalidadeRow[] | null) ?? []).map(mapLocalidade),
  }
}

async function resolveFactByYear(year: number) {
  const supabase = await getSupabaseClient()

  if (!supabase) {
    throw new Error('Supabase indisponivel para resolver o contexto do relatorio.')
  }

  const [
    { data: educacaoData, error: educacaoError },
    { data: socioData, error: socioError },
  ] = await Promise.all([
    supabase
      .from('fato_educacao')
      .select(
        'id_fato_educacao, ano, taxa_matricula, taxa_frequencia_escolar, taxa_analfabetismo, data_criacao',
      )
      .eq('ano', year)
      .order('id_fato_educacao', { ascending: true }),
    supabase
      .from('fato_socioeconomico')
      .select(
        'id_fato_socioeconomico, ano, renda_per_capita, acesso_internet_perc, acesso_saneamento_perc, data_criacao',
      )
      .eq('ano', year)
      .order('id_fato_socioeconomico', { ascending: true }),
  ])

  if (educacaoError || socioError) {
    throw new Error('Nao foi possivel recuperar os fatos do ano selecionado.')
  }

  const educationRows = (educacaoData as FatoEducacaoRow[] | null) ?? []
  const socioeconomicRows = (socioData as FatoSocioeconomicoRow[] | null) ?? []

  if (!educationRows.length || !socioeconomicRows.length) {
    throw new Error('Nao existem fatos suficientes para o ano selecionado.')
  }

  if (educationRows.length > 1 || socioeconomicRows.length > 1) {
    throw new Error(
      'A modelagem atual possui mais de um fato para o mesmo ano sem chave de localidade. A criacao do relatorio fica ambigua nesse cenario.',
    )
  }

  return {
    fatoEducacao: mapFatoEducacao(educationRows[0]),
    fatoSocioeconomico: mapFatoSocioeconomico(socioeconomicRows[0]),
  }
}

export async function createUserReport(
  userId: number,
  payload: CreateReportPayload,
) {
  const supabase = await getSupabaseClient()

  if (!supabase) {
    throw new Error('Supabase indisponivel para criar relatorio.')
  }

  const { fatoEducacao, fatoSocioeconomico } = await resolveFactByYear(payload.year)
  const localities = await fetchReportFormOptions()
  const selectedLocality = localities.localities.find(
    (locality) => locality.idLocalidade === payload.localidadeId,
  )

  if (!selectedLocality) {
    throw new Error('Localidade invalida para criacao do relatorio.')
  }

  const baseRecord: AnalysisRecord = {
    report: {
      idRelatorio: 0,
      tipo: payload.tipo,
      likertEducacao: computeEducationLikert(fatoEducacao),
      likertSocioeconomico: computeSocioeconomicLikert(fatoSocioeconomico),
      avaliacao: payload.avaliacao,
      filtrosAplicados:
        payload.filtrosAplicados ??
        buildFiltersAppliedLabel({ year: payload.year }),
      politicaPublica: payload.politicaPublica ?? '',
      idUsuario: userId,
      idFatoEducacao: fatoEducacao.idFatoEducacao,
      idFatoSocioeconomico: fatoSocioeconomico.idFatoSocioeconomico,
      idDimLocalidade: payload.localidadeId,
    },
    localidade: selectedLocality,
    fatoEducacao,
    fatoSocioeconomico,
  }

  const recommendation = buildRecommendationsFromRecords([baseRecord])[0]
  const politicaPublica =
    payload.politicaPublica?.trim() ||
    `${recommendation.title}: ${recommendation.summary}`

  const insertPayload = {
    tipo: payload.tipo,
    likert_educacao: baseRecord.report.likertEducacao,
    likert_socioeconomico: baseRecord.report.likertSocioeconomico,
    avaliacao: payload.avaliacao.trim(),
    filtros_aplicados:
      payload.filtrosAplicados ?? buildFiltersAppliedLabel({ year: payload.year }),
    politica_publica: politicaPublica,
    data_criacao: new Date().toISOString(),
    id_usuario: userId,
    id_fato_educacao: fatoEducacao.idFatoEducacao,
    id_fato_socioeconomico: fatoSocioeconomico.idFatoSocioeconomico,
    id_dim_localidade: payload.localidadeId,
  }

  const { data, error } = await supabase
    .from('relatorio')
    .insert(insertPayload)
    .select(
      'id_relatorio, tipo, likert_educacao, likert_socioeconomico, avaliacao, filtros_aplicados, politica_publica, data_criacao, id_usuario, id_fato_educacao, id_fato_socioeconomico, id_dim_localidade, dim_localidade(id_localidade, codigo_ibge, UF, municipio, setor_censitario, data_criacao), fato_educacao(id_fato_educacao, ano, taxa_matricula, taxa_frequencia_escolar, taxa_analfabetismo, data_criacao), fato_socioeconomico(id_fato_socioeconomico, ano, renda_per_capita, acesso_internet_perc, acesso_saneamento_perc, data_criacao)',
    )
    .single()

  if (error) {
    throw new Error('Nao foi possivel criar o relatorio.')
  }

  const report = mapRelatorio(data as RelatorioRow)

  if (!report) {
    throw new Error('Relatorio criado, mas nao foi possivel montar a resposta.')
  }

  return {
    report,
    reportTypeLabel: getReportTypeLabel(report.tipo),
    locationLabel: formatLocationLabel(toAnalysisRecord(report)),
    recommendation,
  }
}

export function buildReportFilterOptions(items: ReportListItem[]) {
  const recordOptions = dedupeAnalysisRecords(
    items.map((item) => ({
      report: item.report,
      localidade: item.report.localidade!,
      fatoEducacao: item.report.fatoEducacao!,
      fatoSocioeconomico: item.report.fatoSocioeconomico!,
    })),
  )

  const years = new Set<number>()
  const ufs = new Set<string>()
  const municipalities = new Set<string>()
  const censusSectors = new Set<string>()
  const reportTypes = new Set<number>()

  recordOptions.forEach((record) => {
    years.add(record.fatoEducacao.ano)
    ufs.add(record.localidade.uf)
    municipalities.add(record.localidade.municipio)

    if (record.localidade.setorCensitario) {
      censusSectors.add(record.localidade.setorCensitario)
    }

    reportTypes.add(record.report.tipo)
  })

  return {
    years: Array.from(years).sort((left, right) => right - left),
    ufs: Array.from(ufs).sort((left, right) => left.localeCompare(right)),
    municipalities: Array.from(municipalities).sort((left, right) =>
      left.localeCompare(right),
    ),
    censusSectors: Array.from(censusSectors).sort((left, right) =>
      left.localeCompare(right),
    ),
    reportTypes: Array.from(reportTypes).sort((left, right) => left - right),
  }
}
