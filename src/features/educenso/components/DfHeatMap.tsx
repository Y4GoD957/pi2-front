import { memo, Suspense, lazy } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DfHeatMapLegend } from '@/features/educenso/components/DfHeatMapLegend'
import { useDfGeojson } from '@/features/educenso/hooks/useDfGeojson'
import { dfBoundary } from '@/features/educenso/maps/geo/df'
import type { DfHeatMapData } from '@/types/educenso'
import type { MapAreaData } from './DfLeafletMap'

const DfLeafletMap = lazy(() =>
  import('./DfLeafletMap')
    .then((mod) => ({ default: mod.DfLeafletMap }))
    .catch(() => ({
      default: () => (
        <div className="flex h-[26rem] items-center justify-center rounded-3xl bg-slate-50 text-sm text-slate-500">
          Mapa indisponivel no momento.
        </div>
      ),
    })),
)

function MapSkeleton() {
  return (
    <div className="flex h-[26rem] items-center justify-center rounded-3xl bg-slate-100 animate-pulse">
      <span className="text-sm text-slate-400">Carregando mapa...</span>
    </div>
  )
}

interface DfHeatMapProps {
  data: DfHeatMapData
}

const statusLabelMap = {
  estimado: 'Estimado',
  indisponivel: 'Indisponível',
  oficial: 'Dado oficial',
  simulado: 'Simulado',
} as const

export const DfHeatMap = memo(function DfHeatMap({ data }: DfHeatMapProps) {
  const { data: backendGeoData } = useDfGeojson()
  const geoData = backendGeoData ?? dfBoundary

  const mapAreas: MapAreaData[] = data.areas.map((area) => ({
    id: area.id,
    label: area.label,
    normalizedValue: area.normalizedValue,
    metricValue: area.metricValue,
    metricLabel: area.metricLabel,
    year: area.year,
  }))

  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
        <p className="text-sm leading-6 text-slate-600">{data.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <Suspense fallback={<MapSkeleton />}>
          <DfLeafletMap areas={mapAreas} geoData={geoData} />
        </Suspense>

        <DfHeatMapLegend
          startLabel="Menor vulnerabilidade"
          endLabel="Maior vulnerabilidade"
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Fonte atual
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{data.sourceLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.dataStatus ? (
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                {statusLabelMap[data.dataStatus]}
              </span>
            ) : null}
            {data.sourceReliability ? (
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                Confiabilidade {data.sourceReliability}
              </span>
            ) : null}
          </div>
          {data.notes.length ? (
            <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-800">
                Limitação de granularidade do DF
              </p>
              <p className="mt-2 text-sm leading-6 text-sky-900">
                Os dados oficiais desta visualização estão no nível de UF. As Regiões Administrativas do DF ainda não aparecem como recorte oficial nesta integração.
              </p>
            </div>
          ) : null}
          <div className="mt-3 space-y-2">
            {data.notes.map((note) => (
              <p key={note} className="text-sm leading-6 text-slate-600">
                {note}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
