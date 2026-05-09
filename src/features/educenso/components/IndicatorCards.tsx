import { memo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardIndicator } from '@/types/educenso'

interface IndicatorCardsProps {
  indicators: DashboardIndicator[]
}

const STATUS_LABELS = {
  estimado: 'Estimado',
  indisponivel: 'Indisponível',
  oficial: 'Dado oficial',
  simulado: 'Simulado',
} as const

const STATUS_STYLES = {
  estimado: 'bg-amber-100 text-amber-800',
  indisponivel: 'bg-slate-200 text-slate-700',
  oficial: 'bg-emerald-100 text-emerald-800',
  simulado: 'bg-violet-100 text-violet-800',
} as const

function formatIndicatorValue(value: number | null, unit: DashboardIndicator['unit']) {
  if (value === null) {
    return 'Dado indisponível'
  }

  if (unit === 'R$') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return unit ? `${value.toFixed(1)} ${unit}` : value.toFixed(1)
}

export const IndicatorCards = memo(function IndicatorCards({ indicators }: IndicatorCardsProps) {
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
            <div className="mt-3 flex flex-wrap gap-2">
              {indicator.sourceName ? (
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                  {indicator.sourceName}
                </span>
              ) : null}
              {indicator.status ? (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[indicator.status]}`}>
                  {STATUS_LABELS[indicator.status]}
                </span>
              ) : null}
              {indicator.severity ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  Severidade {indicator.severity}
                </span>
              ) : null}
            </div>
            {indicator.value === null ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                O valor oficial não está disponível para este recorte no momento.
              </div>
            ) : null}
            {indicator.warnings?.length ? (
              <div className="mt-3 space-y-1">
                {indicator.warnings.map((warning) => (
                  <p key={warning} className="text-xs leading-5 text-amber-700">
                    {warning}
                  </p>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
})
