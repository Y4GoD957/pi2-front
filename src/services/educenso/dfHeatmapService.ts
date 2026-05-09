import { apiRequest } from '@/services/api/client'
import type { DfHeatmapResponse } from '@/types/educenso'
import type {
  DfMetadataResponse,
  IbgeAdministrativeRegion,
} from '@/types/ibge'
import type { GeoRegionCollection } from '@/features/educenso/maps/types'

export async function fetchDfHeatmap(query: {
  year?: number
  indicator?: string
  source?: string
}): Promise<DfHeatmapResponse> {
  return apiRequest<DfHeatmapResponse>('/educenso/df/heatmap', {
    query: {
      year: query.year,
      indicator: query.indicator,
      source: query.source,
    },
  })
}

export async function fetchDfMetadata(): Promise<DfMetadataResponse> {
  return apiRequest<DfMetadataResponse>('/educenso/df/metadata')
}

export async function fetchDfAdministrativeRegions(): Promise<
  IbgeAdministrativeRegion[]
> {
  return apiRequest<IbgeAdministrativeRegion[]>('/educenso/df/regions')
}

export async function fetchDfGeojson(): Promise<GeoRegionCollection> {
  return apiRequest<GeoRegionCollection>('/educenso/df/geojson')
}
