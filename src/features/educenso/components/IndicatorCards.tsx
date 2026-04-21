import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardIndicator } from '@/types/educenso'

interface IndicatorCardsProps {
  indicators: DashboardIndicator[]
}

function formatIndicatorValue(value: number | null, unit: DashboardIndicator['unit']) {
  if (value === null) {
    return 'Sem dado'
  }

  if (unit === 'R$') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return `${value.toFixed(1)}%`
}

export function IndicatorCards({ indicators }: IndicatorCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {indicators.map((indicator) => (
        <Card
          key={indicator.id}
          className="border-white/70 bg-white/88 backdrop-blur-sm"
        >
          <CardHeader className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Indicador principal
            </p>
            <CardTitle className="text-lg text-slate-950">
              {indicator.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight text-slate-950">
              {formatIndicatorValue(indicator.value, indicator.unit)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {indicator.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
