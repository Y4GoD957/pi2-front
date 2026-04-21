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

export function DashboardHomePage() {
  const { data, error, filters, isLoading, setFilters } = useEducensoDashboard()
  const { error: dfRegionsError, regions } = useDfAdministrativeRegions()

  if (isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando painel analitico...
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return <AlertError message={error ?? 'Dashboard indisponivel.'} />
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
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {data.modelNotice}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Distritos administrativos identificados via IBGE:
          {' '}
          {regions.length}
          {dfRegionsError ? ' • referencia IBGE indisponivel no momento' : ''}
        </p>
      </header>

      <AnalysisFilters
        filters={filters}
        options={data.filterOptions}
        onChange={setFilters}
      />

      <IndicatorCards indicators={data.indicators} />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MetricLineChart data={data.trend} />
        <LikertSummary summary={data.likertSummary} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MetricBarChart data={data.comparisons} />
        <RecommendationList recommendations={data.recommendations} />
      </section>

      <DfHeatMap data={data.heatMap} />

      <AnalyticalTable rows={data.tableRows} />

      <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Preparacao para expansao
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Estrutura pronta para incorporar: {data.futureIndicators.join(', ')}.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Total de observacoes unicas no recorte atual: {data.totalRecords}.
          </p>
        </CardContent>
      </Card>
    </>
  )
}
