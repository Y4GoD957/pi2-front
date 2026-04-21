import {
  buildFiltersAppliedLabel,
} from '@/services/educenso/analyticsService'
import { apiRequest } from '@/services/api/client'
import type {
  CreateReportPayload,
  EducensoAnalysisFilters,
  ReportFormOptions,
  ReportListItem,
} from '@/types/educenso'

export async function fetchUserReports(
  _userId: number,
  filters: EducensoAnalysisFilters,
): Promise<ReportListItem[]> {
  return apiRequest<ReportListItem[]>('/educenso/reports', {
    requiresAuth: true,
    query: {
      year: filters.year,
      uf: filters.uf,
      municipality: filters.municipality,
      census_sector: filters.censusSector,
      report_type: filters.reportType,
    },
  })
}

export async function fetchReportById(_userId: number, reportId: number) {
  return apiRequest<ReportListItem>(`/educenso/reports/${reportId}`, {
    requiresAuth: true,
  })
}

export async function fetchReportFormOptions(): Promise<ReportFormOptions> {
  return apiRequest<ReportFormOptions>('/educenso/report-form-options')
}

export async function createUserReport(
  _userId: number,
  payload: CreateReportPayload,
) {
  return apiRequest<ReportListItem>('/educenso/reports', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify({
      ...payload,
      filtrosAplicados:
        payload.filtrosAplicados ?? buildFiltersAppliedLabel({ year: payload.year }),
    }),
  })
}

export function buildReportFilterOptions(items: ReportListItem[]) {
  const years = new Set<number>()
  const ufs = new Set<string>()
  const municipalities = new Set<string>()
  const censusSectors = new Set<string>()
  const reportTypes = new Set<number>()

  items.forEach((item) => {
    const localidade = item.report.localidade
    const fatoEducacao = item.report.fatoEducacao

    if (!localidade || !fatoEducacao) {
      return
    }

    years.add(fatoEducacao.ano)
    ufs.add(localidade.uf)
    municipalities.add(localidade.municipio)

    if (localidade.setorCensitario) {
      censusSectors.add(localidade.setorCensitario)
    }

    reportTypes.add(item.report.tipo)
  })

  return {
    years: Array.from(years).sort((left, right) => right - left),
    ufs: Array.from(ufs).sort((left, right) => left.localeCompare(right)),
    municipalities: Array.from(municipalities).sort((left, right) =>
      left.localeCompare(right),
    ),
    censusSectors: Array.from(censusSectors).sort((left, right) =>
      left.localeCompare(right),
    ),
    reportTypes: Array.from(reportTypes).sort((left, right) => left - right),
  }
}
