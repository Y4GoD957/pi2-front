import { memo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardLikertSummary } from '@/types/educenso'

interface LikertSummaryProps {
  summary: DashboardLikertSummary
}

function LikertMeter({
  title,
  value,
}: {
  title: string
  value: DashboardLikertSummary['educacao']
}) {
  const segments = [1, 2, 3, 4, 5]
  const activeSegments = Math.round(value.numericValue)

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{value.label}</p>
        </div>
        <p className="text-2xl font-semibold text-slate-950">
          {value.numericValue.toFixed(2)}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {segments.map((segment) => (
          <div
            key={segment}
            className={`h-3 rounded-full ${
              segment <= activeSegments ? value.colorClassName : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
    </div>
  )
}

export const LikertSummary = memo(function LikertSummary({ summary }: LikertSummaryProps) {
  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Leitura em escala Likert</CardTitle>
        <p className="text-sm text-slate-600">
          Interpretacao consolidada dos eixos educacional e socioeconomico.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <LikertMeter title="Eixo educacional" value={summary.educacao} />
        <LikertMeter
          title="Eixo socioeconomico"
          value={summary.socioeconomico}
        />
      </CardContent>
    </Card>
  )
})
