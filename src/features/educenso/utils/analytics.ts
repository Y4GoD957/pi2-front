import type {
  AnalysisRecord,
  AnalyticalTableRow,
  DashboardIndicator,
  DashboardTrendPoint,
  EducensoAnalysisFilters,
  EducensoFilterOptions,
  IndicatorComparisonPoint,
} from '@/types/educenso'

export function toNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function formatLocationLabel(record: Pick<AnalysisRecord, 'localidade'>) {
  const sector = record.localidade.setorCensitario?.trim()

  if (sector) {
    return `${record.localidade.municipio} - ${record.localidade.uf} (${sector})`
  }

  return `${record.localidade.municipio} - ${record.localidade.uf}`
}

export function getReportTypeLabel(reportType: number) {
  return `Tipo ${reportType}`
}

export function buildFilterOptions(records: AnalysisRecord[]): EducensoFilterOptions {
  const years = new Set<number>()
  const ufs = new Set<string>()
  const municipalities = new Set<string>()
  const censusSectors = new Set<string>()
  const reportTypes = new Set<number>()

  records.forEach((record) => {
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

export function applyAnalysisFilters(
  records: AnalysisRecord[],
  filters: EducensoAnalysisFilters,
) {
  return records.filter((record) => {
    if (filters.year && record.fatoEducacao.ano !== filters.year) {
      return false
    }

    if (filters.uf && record.localidade.uf !== filters.uf) {
      return false
    }

    if (filters.municipality && record.localidade.municipio !== filters.municipality) {
      return false
    }

    if (
      filters.censusSector &&
      record.localidade.setorCensitario !== filters.censusSector
    ) {
      return false
    }

    if (filters.reportType && record.report.tipo !== filters.reportType) {
      return false
    }

    return true
  })
}

export function dedupeAnalysisRecords(records: AnalysisRecord[]) {
  const uniqueRecords = new Map<string, AnalysisRecord>()

  records.forEach((record) => {
    const key = [
      record.localidade.idLocalidade,
      record.fatoEducacao.idFatoEducacao,
      record.fatoSocioeconomico.idFatoSocioeconomico,
      record.fatoEducacao.ano,
    ].join(':')

    if (!uniqueRecords.has(key)) {
      uniqueRecords.set(key, record)
    }
  })

  return Array.from(uniqueRecords.values())
}

function average(values: Array<number | null>) {
  const validValues = values.filter((value): value is number => value !== null)

  if (!validValues.length) {
    return null
  }

  const total = validValues.reduce((sum, value) => sum + value, 0)
  return total / validValues.length
}

export function buildDashboardIndicators(records: AnalysisRecord[]): DashboardIndicator[] {
  return [
    {
      id: 'taxaMatricula',
      label: 'Taxa de matricula',
      value: average(records.map((record) => record.fatoEducacao.taxaMatricula)),
      unit: '%',
      description: 'Media consolidada da taxa de matricula no recorte filtrado.',
    },
    {
      id: 'taxaFrequenciaEscolar',
      label: 'Taxa de frequencia escolar',
      value: average(
        records.map((record) => record.fatoEducacao.taxaFrequenciaEscolar),
      ),
      unit: '%',
      description: 'Presenca media escolar observada no conjunto selecionado.',
    },
    {
      id: 'taxaAnalfabetismo',
      label: 'Taxa de analfabetismo',
      value: average(
        records.map((record) => record.fatoEducacao.taxaAnalfabetismo),
      ),
      unit: '%',
      description: 'Quanto menor esse indice, melhor a leitura educacional.',
    },
    {
      id: 'rendaPerCapita',
      label: 'Renda per capita',
      value: average(
        records.map((record) => record.fatoSocioeconomico.rendaPerCapita),
      ),
      unit: 'R$',
      description: 'Media de renda per capita nas observacoes filtradas.',
    },
    {
      id: 'acessoInternetPerc',
      label: 'Acesso a internet',
      value: average(
        records.map((record) => record.fatoSocioeconomico.acessoInternetPerc),
      ),
      unit: '%',
      description: 'Percentual medio de acesso a internet no recorte.',
    },
    {
      id: 'acessoSaneamentoPerc',
      label: 'Acesso a saneamento',
      value: average(
        records.map((record) => record.fatoSocioeconomico.acessoSaneamentoPerc),
      ),
      unit: '%',
      description: 'Percentual medio de acesso a saneamento no recorte.',
    },
  ]
}

export function buildTrendData(records: AnalysisRecord[]): DashboardTrendPoint[] {
  const groupedByYear = new Map<number, AnalysisRecord[]>()

  records.forEach((record) => {
    const currentGroup = groupedByYear.get(record.fatoEducacao.ano) ?? []
    currentGroup.push(record)
    groupedByYear.set(record.fatoEducacao.ano, currentGroup)
  })

  return Array.from(groupedByYear.entries())
    .sort(([left], [right]) => left - right)
    .map(([year, yearRecords]) => ({
      year,
      taxaMatricula: average(
        yearRecords.map((record) => record.fatoEducacao.taxaMatricula),
      ),
      taxaFrequenciaEscolar: average(
        yearRecords.map((record) => record.fatoEducacao.taxaFrequenciaEscolar),
      ),
      taxaAnalfabetismo: average(
        yearRecords.map((record) => record.fatoEducacao.taxaAnalfabetismo),
      ),
      rendaPerCapita: average(
        yearRecords.map((record) => record.fatoSocioeconomico.rendaPerCapita),
      ),
      acessoInternetPerc: average(
        yearRecords.map((record) => record.fatoSocioeconomico.acessoInternetPerc),
      ),
      acessoSaneamentoPerc: average(
        yearRecords.map((record) => record.fatoSocioeconomico.acessoSaneamentoPerc),
      ),
    }))
}

export function buildComparisonData(records: AnalysisRecord[]) {
  const groupedByLocation = new Map<string, AnalysisRecord[]>()

  records.forEach((record) => {
    const key = formatLocationLabel(record)
    const currentGroup = groupedByLocation.get(key) ?? []
    currentGroup.push(record)
    groupedByLocation.set(key, currentGroup)
  })

  return Array.from(groupedByLocation.entries())
    .map<IndicatorComparisonPoint>(([label, groupRecords]) => ({
      id: label,
      label,
      taxaMatricula: average(
        groupRecords.map((record) => record.fatoEducacao.taxaMatricula),
      ),
      taxaFrequenciaEscolar: average(
        groupRecords.map((record) => record.fatoEducacao.taxaFrequenciaEscolar),
      ),
      taxaAnalfabetismo: average(
        groupRecords.map((record) => record.fatoEducacao.taxaAnalfabetismo),
      ),
      rendaPerCapita: average(
        groupRecords.map((record) => record.fatoSocioeconomico.rendaPerCapita),
      ),
      acessoInternetPerc: average(
        groupRecords.map((record) => record.fatoSocioeconomico.acessoInternetPerc),
      ),
      acessoSaneamentoPerc: average(
        groupRecords.map((record) => record.fatoSocioeconomico.acessoSaneamentoPerc),
      ),
    }))
    .sort((left, right) => (right.taxaMatricula ?? 0) - (left.taxaMatricula ?? 0))
    .slice(0, 6)
}

export function buildAnalyticalTableRows(
  records: AnalysisRecord[],
  recommendationSummaryByKey: Map<string, string>,
): AnalyticalTableRow[] {
  return records
    .map((record) => {
      const id = [
        record.localidade.idLocalidade,
        record.fatoEducacao.idFatoEducacao,
        record.fatoSocioeconomico.idFatoSocioeconomico,
      ].join(':')

      return {
        id,
        year: record.fatoEducacao.ano,
        reportType: record.report.tipo,
        reportTypeLabel: getReportTypeLabel(record.report.tipo),
        locationLabel: formatLocationLabel(record),
        uf: record.localidade.uf,
        municipality: record.localidade.municipio,
        censusSector: record.localidade.setorCensitario,
        enrollmentRate: record.fatoEducacao.taxaMatricula,
        schoolAttendanceRate: record.fatoEducacao.taxaFrequenciaEscolar,
        illiteracyRate: record.fatoEducacao.taxaAnalfabetismo,
        perCapitaIncome: record.fatoSocioeconomico.rendaPerCapita,
        internetAccess: record.fatoSocioeconomico.acessoInternetPerc,
        sanitationAccess: record.fatoSocioeconomico.acessoSaneamentoPerc,
        likertEducacao: record.report.likertEducacao,
        likertSocioeconomico: record.report.likertSocioeconomico,
        recommendationSummary:
          recommendationSummaryByKey.get(id) ?? 'Sem recomendacao calculada.',
      }
    })
    .sort((left, right) => right.year - left.year)
}
