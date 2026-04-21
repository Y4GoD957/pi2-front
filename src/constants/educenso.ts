export const EDUCENSO_FUTURE_INDICATORS = [
  'IDH',
  'Taxa de mortalidade',
  'Dados da pandemia',
] as const

export const LIKERT_MIN = 1
export const LIKERT_MAX = 5

export const LIKERT_LABELS = {
  high: 'Nivel alto',
  low: 'Nivel baixo',
  moderate: 'Nivel moderado',
} as const

export const MODELING_NOTICE =
  'A analise atual depende das relacoes presentes em relatorio, pois as tabelas fato_educacao e fato_socioeconomico nao possuem chave direta de localidade na modelagem informada.'
