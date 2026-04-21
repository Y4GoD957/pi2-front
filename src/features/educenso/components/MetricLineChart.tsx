import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardTrendPoint } from '@/types/educenso'

interface MetricLineChartProps {
  data: DashboardTrendPoint[]
}

function buildPath(
  points: DashboardTrendPoint[],
  accessor: (point: DashboardTrendPoint) => number | null,
) {
  const values = points
    .map((point, index) => {
      const value = accessor(point)

      if (value === null) {
        return null
      }

      const x = points.length === 1 ? 0 : (index / (points.length - 1)) * 100
      const y = 100 - Math.min(100, Math.max(0, value))

      return `${x},${y}`
    })
    .filter((point): point is string => point !== null)

  return values.join(' ')
}

export function MetricLineChart({ data }: MetricLineChartProps) {
  const enrollmentPath = buildPath(data, (point) => point.taxaMatricula)
  const attendancePath = buildPath(data, (point) => point.taxaFrequenciaEscolar)
  const illiteracyPath = buildPath(data, (point) => point.taxaAnalfabetismo)

  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Tendencia ao longo do tempo</CardTitle>
        <p className="text-sm text-slate-600">
          Leitura temporal das taxas educacionais no recorte atual.
        </p>
      </CardHeader>
      <CardContent>
        {data.length ? (
          <>
            <div className="rounded-3xl bg-slate-50 p-4">
              <svg viewBox="0 0 100 100" className="h-56 w-full">
                <polyline
                  fill="none"
                  points={enrollmentPath}
                  stroke="#0891b2"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                <polyline
                  fill="none"
                  points={attendancePath}
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                <polyline
                  fill="none"
                  points={illiteracyPath}
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-600" />
                Matricula
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-600" />
                Frequencia
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-rose-600" />
                Analfabetismo
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.map((point) => (
                <span
                  key={point.year}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {point.year}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">
            Nao ha dados suficientes para desenhar a serie temporal.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
