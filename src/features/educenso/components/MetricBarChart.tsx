import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { IndicatorComparisonPoint } from '@/types/educenso'

interface MetricBarChartProps {
  data: IndicatorComparisonPoint[]
}

function percentage(value: number | null) {
  if (value === null) {
    return 0
  }

  return Math.min(100, Math.max(0, value))
}

export function MetricBarChart({ data }: MetricBarChartProps) {
  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Comparacao territorial</CardTitle>
        <p className="text-sm text-slate-600">
          Taxa de matricula e acesso a internet nas localidades mais relevantes
          do recorte filtrado.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length ? (
          data.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Frequencia {item.taxaFrequenciaEscolar?.toFixed(1) ?? '--'}%
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Matricula</span>
                    <span>{item.taxaMatricula?.toFixed(1) ?? '--'}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full bg-cyan-600"
                      style={{ width: `${percentage(item.taxaMatricula)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Internet</span>
                    <span>{item.acessoInternetPerc?.toFixed(1) ?? '--'}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div
                      className="h-2.5 rounded-full bg-emerald-500"
                      style={{ width: `${percentage(item.acessoInternetPerc)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">
            Nenhuma comparacao disponivel para os filtros atuais.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
