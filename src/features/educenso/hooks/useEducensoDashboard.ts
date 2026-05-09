import { useMemo, useState } from 'react'

import { useDataSources } from '@/features/educenso/hooks/useDataSources'
import { useDfCharts } from '@/features/educenso/hooks/useDfCharts'
import { useDfHeatmap } from '@/features/educenso/hooks/useDfHeatmap'
import { useDfIndicators } from '@/features/educenso/hooks/useDfIndicators'
import { useDfSummary } from '@/features/educenso/hooks/useDfSummary'
import type {
  AnalyticalTableRow,
  DashboardIndicator,
  DashboardLikertSummary,
  DashboardTrendPoint,
  DfHeatMapData,
  EducensoAnalysisFilters,
  EducensoFilterOptions,
  IndicatorComparisonPoint,
  LikertInterpretation,
  PublicPolicyRecommendation,
} from '@/types/educenso'

const INITIAL_FILTERS: EducensoAnalysisFilters = {}

function buildLikertInterpretation(score: number): LikertInterpretation {
  if (score >= 4) {
    return {
      numericValue: score,
      label: 'Nivel alto',
      level: 'alto',
      description: 'Leitura agregada favoravel.',
      colorClassName: 'bg-emerald-500',
    }
  }

  if (score >= 2.5) {
    return {
      numericValue: score,
      label: 'Nivel moderado',
      level: 'moderado',
      description: 'Leitura agregada intermediaria.',
      colorClassName: 'bg-amber-500',
    }
  }

  return {
    numericValue: score,
    label: 'Nivel baixo',
    level: 'baixo',
    description: 'Leitura agregada mais sensivel.',
    colorClassName: 'bg-rose-500',
  }
}

function normalizeLikertScore(values: number[]) {
  if (!values.length) return 3
  return 1 + (values.reduce((acc, v) => acc + v, 0) / values.length) * 4
}

export function useEducensoDashboard() {
  const [filters, setFilters] = useState<EducensoAnalysisFilters>(INITIAL_FILTERS)
  const selectedIndicator = filters.municipality ?? 'internet_access_pct'

  const { data: sourcesData, isLoading: isSourcesLoading } = useDataSources()
  const { data: indicatorsData, error: indicatorsError, isLoading: isIndicatorsLoading } = useDfIndicators({
    year: filters.year,
  })
  const { data: heatmapData, error: heatmapError, isLoading: isHeatmapLoading } = useDfHeatmap({
    year: filters.year,
    indicator: selectedIndicator,
    source: 'sidra',
  })
  const { data: chartsData, error: chartsError, isLoading: isChartsLoading } = useDfCharts({
    year: filters.year,
    indicator: selectedIndicator,
    source: 'sidra',
  })
  const { data: summaryData, error: summaryError, isLoading: isSummaryLoading } = useDfSummary({
    year: filters.year,
    source: 'sidra',
  })

  // --- Indicators-derived sections (available as soon as indicatorsData arrives) ---

  const indicators = useMemo<DashboardIndicator[] | null>(() => {
    if (!indicatorsData) return null
    return indicatorsData.indicadores.map((item) => ({
      id: item.indicador,
      label: item.rotulo,
      value: item.valor_bruto ?? null,
      unit: item.unidade ?? '',
      description: item.interpretacao?.leitura ?? 'Sem interpretacao disponivel.',
      status: item.status_dado,
      sourceName: item.metadados_fonte.nome,
      severity: item.interpretacao?.nivel_severidade,
      warnings: item.avisos,
    }))
  }, [indicatorsData])

  const trend = useMemo<DashboardTrendPoint[] | null>(() => {
    if (!indicatorsData) return null
    const series = indicatorsData.indicadores.reduce<Record<number, DashboardTrendPoint>>(
      (acc, item) => {
        item.serie_historica.forEach((point) => {
          acc[point.ano] ??= {
            year: point.ano,
            taxaMatricula: null,
            taxaFrequenciaEscolar: null,
            taxaAnalfabetismo: null,
            rendaPerCapita: null,
            acessoInternetPerc: null,
            acessoSaneamentoPerc: null,
          }
          if (item.indicador === 'school_attendance_rate') acc[point.ano].taxaFrequenciaEscolar = point.valor ?? null
          if (item.indicador === 'illiteracy_rate_15_plus') acc[point.ano].taxaAnalfabetismo = point.valor ?? null
          if (item.indicador === 'internet_access_pct') acc[point.ano].acessoInternetPerc = point.valor ?? null
          if (item.indicador === 'adequate_housing_pct') acc[point.ano].acessoSaneamentoPerc = point.valor ?? null
        })
        return acc
      },
      {},
    )
    return Object.values(series).sort((a, b) => a.year - b.year)
  }, [indicatorsData])

  const likertSummary = useMemo<DashboardLikertSummary | null>(() => {
    if (!indicatorsData) return null
    const eduScores = indicatorsData.indicadores
      .filter((i) => i.tema === 'educacao' && i.valor_normalizado != null)
      .map((i) => i.valor_normalizado as number)
    const socioScores = indicatorsData.indicadores
      .filter((i) => i.tema === 'socioeconomico' && i.valor_normalizado != null)
      .map((i) => i.valor_normalizado as number)
    return {
      educacao: buildLikertInterpretation(normalizeLikertScore(eduScores)),
      socioeconomico: buildLikertInterpretation(normalizeLikertScore(socioScores)),
    }
  }, [indicatorsData])

  const tableRows = useMemo<AnalyticalTableRow[] | null>(() => {
    if (!indicatorsData) return null
    return indicatorsData.indicadores.map((item) => ({
      id: item.indicador,
      year: item.ano ?? filters.year ?? new Date().getFullYear(),
      reportType: 0,
      reportTypeLabel: item.metadados_fonte.nome,
      locationLabel: 'Distrito Federal',
      uf: 'DF',
      municipality: 'Brasilia',
      enrollmentRate: null,
      schoolAttendanceRate: item.indicador === 'school_attendance_rate' ? item.valor_bruto ?? null : null,
      illiteracyRate: item.indicador === 'illiteracy_rate_15_plus' ? item.valor_bruto ?? null : null,
      perCapitaIncome: null,
      internetAccess: item.indicador === 'internet_access_pct' ? item.valor_bruto ?? null : null,
      sanitationAccess: item.indicador === 'adequate_housing_pct' ? item.valor_bruto ?? null : null,
      likertEducacao: item.tema === 'educacao' ? (item.valor_normalizado ?? 0) * 4 + 1 : 3,
      likertSocioeconomico: item.tema === 'socioeconomico' ? (item.valor_normalizado ?? 0) * 4 + 1 : 3,
      recommendationSummary: item.interpretacao?.resumo ?? 'Sem leitura complementar.',
      dataStatus: item.status_dado,
      sourceName: item.metadados_fonte.nome,
      warnings: item.avisos,
    }))
  }, [indicatorsData, filters.year])

  const filterOptions = useMemo<EducensoFilterOptions | null>(() => {
    if (!indicatorsData) return null
    const years = Array.from(
      new Set(indicatorsData.indicadores.flatMap((i) => i.serie_historica.map((p) => p.ano))),
    ).sort((a, b) => b - a)
    return {
      years,
      ufs: ['SIDRA/IBGE'],
      municipalities: indicatorsData.indicadores.map((i) => i.indicador),
      censusSectors: [],
      reportTypes: [],
    }
  }, [indicatorsData])

  // --- Heatmap section ---

  const heatMap = useMemo<DfHeatMapData | null>(() => {
    if (!heatmapData) return null
    return {
      title: 'Heat map do Distrito Federal',
      subtitle: 'Leitura oficial do indicador selecionado no recorte territorial atualmente disponivel.',
      areas: heatmapData.areas.map((area) => ({
        id: area.locality_id,
        label: area.locality_name,
        metricLabel: area.indicator_label,
        metricValue: area.raw_value ?? 0,
        normalizedValue: area.normalized_value ?? 0,
        reportCount: 1,
        year: area.year ?? undefined,
        source: 'ibge-fastapi',
        dataStatus: area.status_dado,
        severity: area.interpretacao.severidade,
        classificationLabel: area.classification_label ?? undefined,
        trendDirection: area.interpretacao.direcao_tendencia,
        explanation: area.interpretacao.metadados_explicacao ?? undefined,
        sourceReliability: area.interpretacao.confiabilidade_fonte,
      })),
      sourceLabel: heatmapData.areas[0]?.source_metadata.nome ?? 'Fonte oficial',
      geometryStatus: 'fallback',
      notes: heatmapData.warnings,
      dataStatus: heatmapData.areas[0]?.status_dado,
      sourceReliability: heatmapData.areas[0]?.interpretacao.confiabilidade_fonte,
    }
  }, [heatmapData])

  // --- Summary-derived section ---

  const comparisons = useMemo<IndicatorComparisonPoint[] | null>(() => {
    if (!summaryData) return null
    if (!summaryData.summary_cards.length) return []
    return [
      {
        id: 'df',
        label: 'Distrito Federal',
        taxaMatricula: null,
        taxaFrequenciaEscolar: summaryData.summary_cards.find((i) => i.id === 'school_attendance_rate')?.valor ?? null,
        taxaAnalfabetismo: summaryData.summary_cards.find((i) => i.id === 'illiteracy_rate_15_plus')?.valor ?? null,
        rendaPerCapita: null,
        acessoInternetPerc: summaryData.summary_cards.find((i) => i.id === 'internet_access_pct')?.valor ?? null,
        acessoSaneamentoPerc: summaryData.summary_cards.find((i) => i.id === 'adequate_housing_pct')?.valor ?? null,
      },
    ]
  }, [summaryData])

  const totalRecords = useMemo(() => summaryData?.total_registros ?? null, [summaryData])

  // --- Charts-derived section ---

  const recommendations = useMemo<PublicPolicyRecommendation[] | null>(() => {
    if (!chartsData) return null
    return chartsData.recommendation_hints.map((hint, index) => ({
      id: `${selectedIndicator}-${index}`,
      title: hint.titulo,
      summary: hint.descricao,
      rationale: `Prioridade ${hint.prioridade}`,
      emphasis: 'intersectoral' as const,
      relatedTo: hint.relacionado_a,
    }))
  }, [chartsData, selectedIndicator])

  // --- Model notice (needs all data) ---

  const modelNotice = useMemo<string | null>(() => {
    if (!sourcesData || !indicatorsData || !summaryData || !heatmapData) return null
    const sourceNames = Array.from(new Set(sourcesData.fontes.map((f) => f.nome))).join(', ')
    const selectedItem = indicatorsData.indicadores.find((i) => i.indicador === selectedIndicator)
    return [
      `Fonte atual: ${sourceNames}.`,
      `Indicador selecionado: ${selectedItem?.rotulo ?? selectedIndicator}.`,
      ...summaryData.warnings,
      ...heatmapData.warnings,
    ].join(' ')
  }, [sourcesData, indicatorsData, summaryData, heatmapData, selectedIndicator])

  const futureIndicators = ['INEP', 'Saude/Pandemia', 'Politicas publicas']

  const error =
    indicatorsError ??
    heatmapError ??
    chartsError ??
    summaryError ??
    null

  return {
    filters,
    setFilters,
    // Loading states per section
    isIndicatorsLoading,
    isHeatmapLoading,
    isChartsLoading,
    isSummaryLoading,
    isSourcesLoading,
    // Data sections (null while loading)
    indicators,
    trend,
    likertSummary,
    tableRows,
    filterOptions,
    heatMap,
    comparisons,
    recommendations,
    modelNotice,
    totalRecords,
    futureIndicators,
    error,
  }
}
