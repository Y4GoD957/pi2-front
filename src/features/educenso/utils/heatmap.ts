import type { AnalysisRecord, DfHeatMapArea, DfHeatMapData } from '@/types/educenso'

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function normalizePercent(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 0
  }

  return clamp01(value / 100)
}

function normalizeIncome(value: number | null | undefined) {
  if (value === null || value === undefined || value <= 0) {
    return 0
  }

  return clamp01(value / 3000)
}

function buildDfAreaLabel(record: AnalysisRecord) {
  const sector = record.localidade.setorCensitario?.trim()

  if (sector) {
    return sector
  }

  return record.localidade.municipio
}

function computeVulnerabilityScore(record: AnalysisRecord) {
  const matricula = normalizePercent(record.fatoEducacao.taxaMatricula)
  const frequencia = normalizePercent(record.fatoEducacao.taxaFrequenciaEscolar)
  const analfabetismo = normalizePercent(record.fatoEducacao.taxaAnalfabetismo)
  const internet = normalizePercent(record.fatoSocioeconomico.acessoInternetPerc)
  const saneamento = normalizePercent(
    record.fatoSocioeconomico.acessoSaneamentoPerc,
  )
  const renda = normalizeIncome(record.fatoSocioeconomico.rendaPerCapita)

  const positiveScore =
    matricula * 0.22 +
    frequencia * 0.2 +
    (1 - analfabetismo) * 0.18 +
    internet * 0.14 +
    saneamento * 0.14 +
    renda * 0.12

  return Number(((1 - positiveScore) * 100).toFixed(1))
}

export function buildDfHeatMapFallback(records: AnalysisRecord[]): DfHeatMapData {
  const grouped = new Map<
    string,
    {
      scoreTotal: number
      reportCount: number
      latestYear: number
    }
  >()

  records
    .filter((record) => record.localidade.uf === 'DF')
    .forEach((record) => {
      const label = buildDfAreaLabel(record)
      const current = grouped.get(label) ?? {
        scoreTotal: 0,
        reportCount: 0,
        latestYear: record.fatoEducacao.ano,
      }

      current.scoreTotal += computeVulnerabilityScore(record)
      current.reportCount += 1
      current.latestYear = Math.max(current.latestYear, record.fatoEducacao.ano)

      grouped.set(label, current)
    })

  const areas = Array.from(grouped.entries())
    .map<DfHeatMapArea>(([label, group]) => ({
      id: label,
      label,
      metricLabel: 'Indice de vulnerabilidade composta',
      metricValue: Number((group.scoreTotal / group.reportCount).toFixed(1)),
      normalizedValue: clamp01(group.scoreTotal / group.reportCount / 100),
      reportCount: group.reportCount,
      year: group.latestYear,
      source: 'backend-fallback',
    }))
    .sort((left, right) => right.metricValue - left.metricValue)

  return {
    title: 'Heat map do DF',
    subtitle:
      'Blocos setoriais do Distrito Federal com intensidade derivada dos indicadores reais disponiveis no recorte atual.',
    areas,
    sourceLabel: 'API Python do projeto',
    geometryStatus: 'fallback',
    notes: [
      'Sem geometria intramunicipal consolidada no backend, o mapa usa um bloco tematico por setor/localidade do DF.',
      'Quando a API FastAPI com GeoPandas estiver disponivel, esta mesma area pode receber poligonos reais do DF.',
    ],
  }
}
