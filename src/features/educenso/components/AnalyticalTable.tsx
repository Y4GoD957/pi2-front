import { memo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalyticalTableRow } from '@/types/educenso'

interface AnalyticalTableProps {
  rows: AnalyticalTableRow[]
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return '--'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number | null) {
  if (value === null) {
    return '--'
  }

  return `${value.toFixed(1)}%`
}

export const AnalyticalTable = memo(function AnalyticalTable({ rows }: AnalyticalTableProps) {
  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Tabela analitica</CardTitle>
        <p className="text-sm text-slate-600">
          Cruzamento direto entre educacao, contexto socioeconomico e leitura do
          relatorio.
        </p>
      </CardHeader>
      <CardContent>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-3 py-2">Ano</th>
                  <th className="px-3 py-2">Localidade</th>
                  <th className="px-3 py-2">Matricula</th>
                  <th className="px-3 py-2">Frequencia</th>
                  <th className="px-3 py-2">Analfabetismo</th>
                  <th className="px-3 py-2">Renda</th>
                  <th className="px-3 py-2">Internet</th>
                  <th className="px-3 py-2">Saneamento</th>
                  <th className="px-3 py-2">Likert</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="rounded-2xl bg-slate-50 text-slate-700">
                    <td className="rounded-l-2xl px-3 py-3 font-semibold text-slate-900">
                      {row.year}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-900">
                        {row.locationLabel}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {row.reportTypeLabel}
                      </div>
                    </td>
                    <td className="px-3 py-3">{formatPercent(row.enrollmentRate)}</td>
                    <td className="px-3 py-3">
                      {formatPercent(row.schoolAttendanceRate)}
                    </td>
                    <td className="px-3 py-3">{formatPercent(row.illiteracyRate)}</td>
                    <td className="px-3 py-3">{formatCurrency(row.perCapitaIncome)}</td>
                    <td className="px-3 py-3">{formatPercent(row.internetAccess)}</td>
                    <td className="px-3 py-3">{formatPercent(row.sanitationAccess)}</td>
                    <td className="rounded-r-2xl px-3 py-3">
                      <div className="font-medium text-slate-900">
                        Edu {row.likertEducacao.toFixed(2)} / Socio{' '}
                        {row.likertSocioeconomico.toFixed(2)}
                      </div>
                      {row.sourceName ? (
                        <div className="mt-1 text-xs text-cyan-700">
                          {row.sourceName}
                          {row.dataStatus ? ` • ${row.dataStatus}` : ''}
                        </div>
                      ) : null}
                      <div className="mt-1 text-xs text-slate-500">
                        {row.recommendationSummary}
                      </div>
                      {row.warnings?.length ? (
                        <div className="mt-1 text-xs text-amber-700">
                          {row.warnings[0]}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Nenhuma linha analítica oficial foi encontrada para os filtros atuais.
          </div>
        )}
      </CardContent>
    </Card>
  )
})
