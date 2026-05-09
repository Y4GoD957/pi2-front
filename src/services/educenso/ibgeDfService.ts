import type { DfHeatMapData } from '@/types/educenso'
import type { IbgeAdministrativeRegion } from '@/types/ibge'
import { apiRequest } from '@/services/api/client'
import {
  fetchDfAdministrativeRegions,
  fetchDfHeatmap,
} from '@/services/educenso/dfHeatmapService'

export async function fetchDfHeatMapFromBackend() {
  return apiRequest<DfHeatMapData>('/educenso/df/heatmap-legacy')
}

export async function fetchDfDistrictsFromIbge(): Promise<
  IbgeAdministrativeRegion[]
> {
  return fetchDfAdministrativeRegions()
}

export async function fetchDfHeatmapAnalytical(params: {
  year?: number
  indicator?: string
  source?: string
}) {
  return fetchDfHeatmap(params)
}
