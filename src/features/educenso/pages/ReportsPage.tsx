import { Link } from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalysisFilters } from '@/features/educenso/components/AnalysisFilters'
import type {
  EducensoAnalysisFilters,
  EducensoFilterOptions,
  ReportListItem,
} from '@/types/educenso'

interface ReportsPageProps {
  filterOptions: EducensoFilterOptions
  filters: EducensoAnalysisFilters
  onChangeFilters: (filters: EducensoAnalysisFilters) => void
  reports: ReportListItem[]
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Sem data'
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function ReportsPage({
  filterOptions,
  filters,
  onChangeFilters,
  reports,
}: ReportsPageProps) {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/82 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Relatorios do usuario
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Biblioteca de analises salvas
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Consulte, filtre e acompanhe os relatorios associados ao usuario
              autenticado com leitura integrada de indicadores e politica
              publica.
            </p>
          </div>

          <Link to={appPaths.reportCreate}>
            <Button>Criar relatorio</Button>
          </Link>
        </div>
      </header>

      <AnalysisFilters
        filters={filters}
        options={filterOptions}
        onChange={onChangeFilters}
      />

      <section className="grid gap-4">
        {reports.length ? (
          reports.map((item) => (
            <Card key={item.report.idRelatorio} className="border-white/70 bg-white/88">
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-950">
                    {item.locationLabel}
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.reportTypeLabel} • Criado em {formatDate(item.report.dataCriacao)}
                  </p>
                </div>
                <Link
                  to={appPaths.reportDetail}
                  params={{ reportId: String(item.report.idRelatorio) }}
                >
                  <Button variant="outline">Ver detalhe</Button>
                </Link>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Avaliacao
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {item.report.avaliacao}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Politica publica
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {item.report.politicaPublica}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    Recomendacao sintetica
                  </p>
                  <p className="mt-2 text-base font-semibold text-cyan-950">
                    {item.recommendation.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-cyan-900">
                    {item.recommendation.summary}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-white/70 bg-white/88">
            <CardContent className="p-6 text-sm text-slate-600">
              Nenhum relatorio encontrado com os filtros atuais.
            </CardContent>
          </Card>
        )}
      </section>
    </>
  )
}
