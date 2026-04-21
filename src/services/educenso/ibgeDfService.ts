import type { DfHeatMapData } from '@/types/educenso'
import type {
  BackendDfHeatMapResponse,
  IbgeAdministrativeRegion,
} from '@/types/ibge'

const backendBaseUrl = import.meta.env.VITE_EDUCENSO_API_BASE_URL?.trim()

function mapBackendHeatMapResponse(
  response: BackendDfHeatMapResponse,
): DfHeatMapData {
  return {
    title: response.title,
    subtitle: response.subtitle,
    sourceLabel: response.sourceLabel,
    geometryStatus: 'real',
    notes: response.notes,
    areas: response.areas.map((area) => ({
      id: area.id,
      label: area.label,
      metricLabel: area.metricLabel,
      metricValue: area.metricValue,
      normalizedValue: area.normalizedValue,
      reportCount: area.reportCount,
      year: area.year,
      svgPath: area.svgPath,
      source: 'ibge-fastapi',
    })),
  }
}

export async function fetchDfHeatMapFromBackend() {
  if (!backendBaseUrl) {
    return null
  }

  const response = await fetch(`${backendBaseUrl}/df/heatmap`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar a geometria do heat map do DF.')
  }

  const data = (await response.json()) as BackendDfHeatMapResponse
  return mapBackendHeatMapResponse(data)
}

export async function fetchDfDistrictsFromIbge() {
  const response = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados/DF/distritos?orderBy=nome',
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Nao foi possivel consultar os distritos do DF no IBGE.')
  }

  const data = (await response.json()) as Array<{
    id: number
    nome: string
  }>

  return data.map<IbgeAdministrativeRegion>((item) => ({
    id: String(item.id),
    nome: item.nome,
  }))
}
