import { Link, useNavigate } from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import { AlertError } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { usePublicPolicyDetail } from '@/features/public-policies/hooks/usePublicPolicyDetail'

type PublicPolicyDetailPageProps = ReturnType<typeof usePublicPolicyDetail>

function formatDate(value?: string | null) {
  if (!value) {
    return 'Sem data'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

function buildIndicatorLabel(indicatorKey?: string | null) {
  if (!indicatorKey) {
    return 'Sem indicador vinculado'
  }

  const labels: Record<string, string> = {
    internet_access_pct: 'Acesso a internet',
    school_attendance_rate: 'Frequencia escolar',
    illiteracy_rate_15_plus: 'Analfabetismo 15+',
    adequate_housing_pct: 'Moradia adequada',
    population_resident: 'Populacao residente',
  }

  return labels[indicatorKey] ?? indicatorKey
}

export function PublicPolicyDetailPage({ data, error, isDeleting, remove }: PublicPolicyDetailPageProps) {
  const navigate = useNavigate()

  if (!data) {
    return null
  }

  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/82 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Politica publica
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {data.titulo}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Criada em {formatDate(data.data_criacao)}
              {data.data_atualizacao ? ` ? Atualizada em ${formatDate(data.data_atualizacao)}` : ''}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to={appPaths.publicPolicyEdit} params={{ policyId: String(data.id) }}>
              <Button variant="outline">Editar politica</Button>
            </Link>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isDeleting}
              onClick={async () => {
                const confirmed = window.confirm('Deseja realmente excluir esta politica publica?')
                if (!confirmed) {
                  return
                }

                await remove()
                await navigate({ to: appPaths.publicPolicies })
              }}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </div>
      </header>

      {error ? <AlertError message={error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Direcionamento principal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Objetivo geral</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{data.objetivo_geral}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Objetivos especificos</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {data.objetivos_especificos.map((item) => (
                  <li key={item.id}>{item.descricao}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Vinculos estrategicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Indicador relacionado</p>
              <p className="mt-2">{buildIndicatorLabel(data.indicador_chave)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Localidade</p>
              <p className="mt-2">
                {data.localidade_nome ? `${data.localidade_nome} - ${data.localidade_uf}` : 'Sem localidade vinculada'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Relatorio vinculado</p>
              <p className="mt-2">{data.relatorio_resumo ?? 'Sem relatorio vinculado'}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Instituicoes responsaveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.instituicoes_responsaveis.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {item.nome}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Beneficiarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.beneficiarios.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {item.nome}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
