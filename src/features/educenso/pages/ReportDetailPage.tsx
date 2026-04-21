import { Link } from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LikertSummary } from '@/features/educenso/components/LikertSummary'
import { interpretLikert } from '@/features/educenso/utils/likert'
import type { fetchReportById } from '@/services/educenso/reportService'

type ReportDetailPageProps = Awaited<ReturnType<typeof fetchReportById>>

function formatDate(value?: string | null) {
  if (!value) {
    return 'Sem data'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined) {
    return '--'
  }

  return `${value.toFixed(1)}%`
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) {
    return '--'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function ReportDetailPage({
  locationLabel,
  recommendation,
  report,
  reportTypeLabel,
}: ReportDetailPageProps) {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/82 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Detalhe do relatorio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {locationLabel}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {reportTypeLabel} • Criado em {formatDate(report.dataCriacao)}
            </p>
          </div>

          <Link to={appPaths.reports}>
            <Button variant="outline">Voltar para relatorios</Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Leitura registrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Avaliacao
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {report.avaliacao}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Politica publica
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {report.politicaPublica}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filtros aplicados
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {report.filtrosAplicados ?? 'Sem filtros registrados'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recomendacao automatica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-base font-semibold text-cyan-950">
                {recommendation.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-cyan-900">
                {recommendation.summary}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-cyan-700">
                {recommendation.rationale}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Indicadores associados</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Matricula
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {formatPercent(report.fatoEducacao?.taxaMatricula)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Frequencia escolar
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {formatPercent(report.fatoEducacao?.taxaFrequenciaEscolar)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Analfabetismo
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {formatPercent(report.fatoEducacao?.taxaAnalfabetismo)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Renda per capita
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {formatCurrency(report.fatoSocioeconomico?.rendaPerCapita)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Internet
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {formatPercent(report.fatoSocioeconomico?.acessoInternetPerc)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Saneamento
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {formatPercent(report.fatoSocioeconomico?.acessoSaneamentoPerc)}
              </p>
            </div>
          </CardContent>
        </Card>

        <LikertSummary
          summary={{
            educacao: interpretLikert(report.likertEducacao),
            socioeconomico: interpretLikert(report.likertSocioeconomico),
          }}
        />
      </section>
    </>
  )
}
