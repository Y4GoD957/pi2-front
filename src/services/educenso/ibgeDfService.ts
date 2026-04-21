import type { DfHeatMapData } from '@/types/educenso'
import type { IbgeAdministrativeRegion } from '@/types/ibge'
import { apiRequest } from '@/services/api/client'

export async function fetchDfHeatMapFromBackend() {
  return apiRequest<DfHeatMapData>('/educenso/df/heatmap')
}

export async function fetchDfDistrictsFromIbge() {
  return apiRequest<IbgeAdministrativeRegion[]>('/educenso/df/regions')
}
