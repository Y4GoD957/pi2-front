import { LIKERT_LABELS, LIKERT_MAX, LIKERT_MIN } from '@/constants/educenso'
import type {
  FatoEducacao,
  FatoSocioeconomico,
  LikertInterpretation,
} from '@/types/educenso'

function clampLikert(value: number) {
  return Math.min(LIKERT_MAX, Math.max(LIKERT_MIN, value))
}

function normalizePercent(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return 0
  }

  return Math.min(100, Math.max(0, value)) / 100
}

function normalizeIncome(value: number | null | undefined) {
  if (value === null || value === undefined || value <= 0) {
    return 0
  }

  return Math.min(value / 3000, 1)
}

function scoreToLikert(score: number) {
  return clampLikert(Number((1 + score * 4).toFixed(2)))
}

export function interpretLikert(value: number): LikertInterpretation {
  const normalizedValue = clampLikert(Number(value.toFixed(2)))

  if (normalizedValue < 2.5) {
    return {
      numericValue: normalizedValue,
      label: LIKERT_LABELS.low,
      level: 'baixo',
      description: 'Leitura de maior vulnerabilidade no recorte analisado.',
      colorClassName: 'bg-rose-500',
    }
  }

  if (normalizedValue < 3.75) {
    return {
      numericValue: normalizedValue,
      label: LIKERT_LABELS.moderate,
      level: 'moderado',
      description: 'Situacao intermediaria, com pontos relevantes de atencao.',
      colorClassName: 'bg-amber-500',
    }
  }

  return {
    numericValue: normalizedValue,
    label: LIKERT_LABELS.high,
    level: 'alto',
    description: 'Leitura mais favoravel dentro do conjunto filtrado.',
    colorClassName: 'bg-emerald-500',
  }
}

export function computeEducationLikert(fatoEducacao: FatoEducacao) {
  const score =
    normalizePercent(fatoEducacao.taxaMatricula) * 0.4 +
    normalizePercent(fatoEducacao.taxaFrequenciaEscolar) * 0.35 +
    normalizePercent(100 - fatoEducacao.taxaAnalfabetismo) * 0.25

  return scoreToLikert(score)
}

export function computeSocioeconomicLikert(
  fatoSocioeconomico: FatoSocioeconomico,
) {
  const score =
    normalizeIncome(fatoSocioeconomico.rendaPerCapita) * 0.4 +
    normalizePercent(fatoSocioeconomico.acessoInternetPerc) * 0.3 +
    normalizePercent(fatoSocioeconomico.acessoSaneamentoPerc) * 0.3

  return scoreToLikert(score)
}
