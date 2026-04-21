import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DfHeatMapLegend } from '@/features/educenso/components/DfHeatMapLegend'
import type { DfHeatMapData } from '@/types/educenso'

interface DfHeatMapProps {
  data: DfHeatMapData
}

function heatMapColor(value: number) {
  if (value >= 0.8) {
    return '#dc2626'
  }

  if (value >= 0.6) {
    return '#f97316'
  }

  if (value >= 0.4) {
    return '#f59e0b'
  }

  if (value >= 0.2) {
    return '#60a5fa'
  }

  return '#dbeafe'
}

export function DfHeatMap({ data }: DfHeatMapProps) {
  const hasGeometry = data.geometryStatus === 'real'

  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
        <p className="text-sm leading-6 text-slate-600">{data.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {hasGeometry ? (
          <div className="rounded-3xl bg-slate-50 p-4">
            <svg viewBox="0 0 1000 1000" className="h-[26rem] w-full">
              {data.areas.map((area) =>
                area.svgPath ? (
                  <path
                    key={area.id}
                    d={area.svgPath}
                    fill={heatMapColor(area.normalizedValue)}
                    stroke="#f8fafc"
                    strokeWidth="6"
                  >
                    <title>{`${area.label}: ${area.metricValue.toFixed(1)}`}</title>
                  </path>
                ) : null,
              )}
            </svg>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.areas.map((area) => (
              <article
                key={area.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {area.label}
                  </p>
                  <span
                    className="inline-flex min-w-14 justify-center rounded-full px-2 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: heatMapColor(area.normalizedValue) }}
                  >
                    {area.metricValue.toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                  {area.metricLabel}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {area.reportCount} observacao(oes)
                  {area.year ? ` • ultimo ano ${area.year}` : ''}
                </p>
              </article>
            ))}
          </div>
        )}

        <DfHeatMapLegend
          startLabel="Menor vulnerabilidade"
          endLabel="Maior vulnerabilidade"
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Fonte atual
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{data.sourceLabel}</p>
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
}
