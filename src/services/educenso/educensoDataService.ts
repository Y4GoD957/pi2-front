import { apiRequest } from '@/services/api/client'
import type {
  DataSourcesResponse,
  DfChartsResponse,
  DfIndicatorsResponse,
  DfSummaryResponse,
} from '@/types/educenso'

interface IndicatorQuery {
  indicator?: string
  source?: string
  theme?: string
  year?: number
}

export async function fetchDataSources(): Promise<DataSourcesResponse> {
  return apiRequest<DataSourcesResponse>('/educenso/data-sources')
}

export async function fetchDfIndicators(
  query: IndicatorQuery,
): Promise<DfIndicatorsResponse> {
  return apiRequest<DfIndicatorsResponse>('/educenso/df/indicators', {
    query: {
      year: query.year,
      theme: query.theme,
      indicator: query.indicator,
      source: query.source,
    },
  })
}

export async function fetchDfCharts(
  query: Omit<IndicatorQuery, 'theme'>,
): Promise<DfChartsResponse> {
  return apiRequest<DfChartsResponse>('/educenso/df/charts', {
    query: {
      year: query.year,
      indicator: query.indicator,
      source: query.source,
    },
  })
}

export async function fetchDfSummary(query: {
  source?: string
  year?: number
}): Promise<DfSummaryResponse> {
  return apiRequest<DfSummaryResponse>('/educenso/df/summary', {
    query: {
      year: query.year,
      source: query.source,
    },
  })
}
