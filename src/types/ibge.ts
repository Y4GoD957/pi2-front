export interface IbgeAdministrativeRegion {
  id: string
  nome: string
}

export interface BackendDfHeatMapAreaResponse {
  id: string
  label: string
  metricLabel: string
  metricValue: number
  normalizedValue: number
  reportCount: number
  year?: number
  svgPath: string
}

export interface BackendDfHeatMapResponse {
  title: string
  subtitle: string
  sourceLabel: string
  notes: string[]
  areas: BackendDfHeatMapAreaResponse[]
}
