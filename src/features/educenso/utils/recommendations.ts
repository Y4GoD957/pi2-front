import type {
  AnalysisRecord,
  PublicPolicyRecommendation,
} from '@/types/educenso'

function buildRecommendation(
  id: string,
  title: string,
  summary: string,
  rationale: string,
  emphasis: PublicPolicyRecommendation['emphasis'],
): PublicPolicyRecommendation {
  return {
    id,
    title,
    summary,
    rationale,
    emphasis,
  }
}

export function buildRecommendationsFromRecords(records: AnalysisRecord[]) {
  const recommendations: PublicPolicyRecommendation[] = []

  const averageEnrollment =
    records.reduce((sum, record) => sum + record.fatoEducacao.taxaMatricula, 0) /
    Math.max(records.length, 1)
  const averageAttendance =
    records.reduce(
      (sum, record) => sum + record.fatoEducacao.taxaFrequenciaEscolar,
      0,
    ) / Math.max(records.length, 1)
  const averageIlliteracy =
    records.reduce(
      (sum, record) => sum + record.fatoEducacao.taxaAnalfabetismo,
      0,
    ) / Math.max(records.length, 1)
  const averageIncome =
    records.reduce(
      (sum, record) => sum + (record.fatoSocioeconomico.rendaPerCapita ?? 0),
      0,
    ) / Math.max(records.length, 1)
  const averageInternet =
    records.reduce(
      (sum, record) => sum + (record.fatoSocioeconomico.acessoInternetPerc ?? 0),
      0,
    ) / Math.max(records.length, 1)
  const averageSanitation =
    records.reduce(
      (sum, record) =>
        sum + (record.fatoSocioeconomico.acessoSaneamentoPerc ?? 0),
      0,
    ) / Math.max(records.length, 1)

  if (averageEnrollment < 75 && averageIncome < 1200) {
    recommendations.push(
      buildRecommendation(
        'inclusao-permanencia',
        'Incentivar inclusao e permanencia escolar',
        'Priorizar programas de busca ativa, apoio financeiro e acompanhamento da permanencia.',
        'O recorte filtrado combina baixa taxa de matricula com renda per capita reduzida.',
        'education',
      ),
    )
  }

  if (averageIlliteracy > 12 && averageInternet < 60) {
    recommendations.push(
      buildRecommendation(
        'alfabetizacao-inclusao-digital',
        'Ampliar alfabetizacao e inclusao digital',
        'Combinar reforco de alfabetizacao com acesso comunitario a conectividade e equipamentos.',
        'O conjunto analisado apresenta analfabetismo elevado e baixa conectividade.',
        'socioeconomic',
      ),
    )
  }

  if (averageAttendance < 80 && averageSanitation < 70) {
    recommendations.push(
      buildRecommendation(
        'acao-intersetorial',
        'Promover acao intersetorial entre educacao e infraestrutura',
        'Integrar agenda escolar com saneamento, transporte e qualificacao dos equipamentos locais.',
        'A frequencia escolar esta pressionada por contexto de infraestrutura fragil.',
        'intersectoral',
      ),
    )
  }

  if (!recommendations.length) {
    recommendations.push(
      buildRecommendation(
        'monitoramento-continuo',
        'Manter monitoramento continuo dos indicadores',
        'O recorte nao aciona heuristicas criticas, mas ainda demanda acompanhamento sistematico.',
        'Os indicadores atuais nao apontam um gatilho prioritario unico.',
        'education',
      ),
    )
  }

  return recommendations
}

export function buildRecommendationSummary(record: AnalysisRecord) {
  const recommendations = buildRecommendationsFromRecords([record])
  return recommendations[0]
}
