import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { AnalysisFilters } from '@/features/educenso/components/AnalysisFilters'
import { AnalyticalTable } from '@/features/educenso/components/AnalyticalTable'
import { DfHeatMap } from '@/features/educenso/components/DfHeatMap'
import { IndicatorCards } from '@/features/educenso/components/IndicatorCards'
import { LikertSummary } from '@/features/educenso/components/LikertSummary'
import { MetricBarChart } from '@/features/educenso/components/MetricBarChart'
import { MetricLineChart } from '@/features/educenso/components/MetricLineChart'
import { RecommendationList } from '@/features/educenso/components/RecommendationList'
import { useDfAdministrativeRegions } from '@/features/educenso/hooks/useDfAdministrativeRegions'
import { useEducensoDashboard } from '@/features/educenso/hooks/useEducensoDashboard'

function SectionSkeleton({ rows = 1 }: { rows?: number }) {
  return (
    <div className="animate-pulse rounded-[2rem] border border-slate-200 bg-white/80 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded-full bg-slate-200 ${i > 0 ? 'mt-3' : ''}`}
          style={{ width: `${70 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

function CardGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <SectionSkeleton key={i} rows={3} />
      ))}
    </div>
  )
}

export function DashboardHomePage() {
  const dashboard = useEducensoDashboard()
  const { error: dfRegionsError, regions } = useDfAdministrativeRegions()

  if (dashboard.error && !dashboard.indicators) {
    return <AlertError message={dashboard.error ?? 'Dashboard indisponivel.'} />
  }

  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          EduCenso Analytics
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Painel principal do Distrito Federal
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Cruzamento inicial entre educacao, renda, conectividade e
          saneamento, com foco exclusivo no DF para leitura clara por
          gestores, pesquisadores e formuladores de politica publica.
        </p>

        {dashboard.modelNotice ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {dashboard.modelNotice}
          </p>
        ) : (
          <div className="mt-4 animate-pulse rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="h-3 w-3/4 rounded-full bg-amber-200" />
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <p className="font-semibold">Leitura oficial com limitação territorial conhecida</p>
          <p className="mt-1 leading-6">
            Nesta etapa, os indicadores oficiais exibidos no painel representam o Distrito Federal no nível de UF. Quando não houver detalhamento por Região Administrativa, a interface informa essa limitação de forma clara.
          </p>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Distritos administrativos identificados via IBGE: {regions.length}
          {dfRegionsError ? ' • referencia IBGE indisponivel no momento' : ''}
        </p>
      </header>

      {dashboard.filterOptions ? (
        <AnalysisFilters
          filters={dashboard.filters}
          options={dashboard.filterOptions}
          onChange={dashboard.setFilters}
        />
      ) : (
        <SectionSkeleton rows={2} />
      )}

      {dashboard.indicators ? (
        <IndicatorCards indicators={dashboard.indicators} />
      ) : (
        <CardGridSkeleton />
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {dashboard.trend ? (
          <MetricLineChart data={dashboard.trend} />
        ) : (
          <SectionSkeleton rows={4} />
        )}
        {dashboard.likertSummary ? (
          <LikertSummary summary={dashboard.likertSummary} />
        ) : (
          <SectionSkeleton rows={3} />
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {dashboard.comparisons ? (
          <MetricBarChart data={dashboard.comparisons} />
        ) : (
          <SectionSkeleton rows={3} />
        )}
        {dashboard.recommendations ? (
          <RecommendationList recommendations={dashboard.recommendations} />
        ) : (
          <SectionSkeleton rows={3} />
        )}
      </section>

      {dashboard.heatMap ? (
        <DfHeatMap data={dashboard.heatMap} />
      ) : (
        <SectionSkeleton rows={4} />
      )}

      {dashboard.tableRows ? (
        <AnalyticalTable rows={dashboard.tableRows} />
      ) : (
        <SectionSkeleton rows={3} />
      )}

      <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preparacao para expansao
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Estrutura pronta para incorporar: {dashboard.futureIndicators.join(', ')}.
          </p>
          {dashboard.totalRecords !== null ? (
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Total de observacoes unicas no recorte atual: {dashboard.totalRecords}.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </>
  )
}
