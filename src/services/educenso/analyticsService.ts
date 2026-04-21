import { MODELING_NOTICE } from '@/constants/educenso'
import { apiRequest } from '@/services/api/client'
import type {
  EducensoAnalysisFilters,
  EducensoDashboardResponse,
} from '@/types/educenso'

export async function fetchEducensoDashboard(
  filters: EducensoAnalysisFilters,
): Promise<EducensoDashboardResponse> {
  const response = await apiRequest<EducensoDashboardResponse>(
    '/educenso/dashboard',
    {
      query: {
        year: filters.year,
        uf: filters.uf,
        municipality: filters.municipality,
        census_sector: filters.censusSector,
        report_type: filters.reportType,
      },
    },
  )

  return {
    ...response,
    modelNotice: response.modelNotice ?? MODELING_NOTICE,
  }
}

export function buildFiltersAppliedLabel(filters: EducensoAnalysisFilters) {
  const parts: string[] = []

  if (filters.year) {
    parts.push(`Ano: ${filters.year}`)
  }

  if (filters.uf) {
    parts.push(`UF: ${filters.uf}`)
  }

  if (filters.municipality) {
    parts.push(`Municipio: ${filters.municipality}`)
  }

  if (filters.censusSector) {
    parts.push(`Setor censitario: ${filters.censusSector}`)
  }

  if (filters.reportType) {
    parts.push(`Tipo: ${filters.reportType}`)
  }

  return parts.length ? parts.join(' | ') : 'Sem filtros adicionais.'
}
