import { Link } from '@tanstack/react-router'

import { appPaths } from '@/app/routes/paths'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PublicPolicySummary } from '@/types/publicPolicy'

function formatDate(value?: string | null) {
  if (!value) {
    return 'Sem data'
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

function formatNames(items: { nome: string }[]) {
  if (!items.length) {
    return 'Nao informado'
  }

  return items.map((item) => item.nome).join(', ')
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

export function PublicPoliciesPage({ items }: { items: PublicPolicySummary[] }) {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/82 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Politicas publicas
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Cadastro estruturado de respostas estrategicas
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Organize politicas publicas com objetivos, instituicoes, beneficiarios e vinculos opcionais a indicadores, localidades e relatorios.
            </p>
          </div>

          <Link to={appPaths.publicPolicyCreate}>
            <Button>Criar politica publica</Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-4">
        {items.length ? (
          items.map((item) => (
            <Card key={item.id} className="border-white/70 bg-white/88">
              <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-950">{item.titulo}</CardTitle>
                  <p className="mt-2 text-sm text-slate-600">
                    Criada em {formatDate(item.data_criacao)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={appPaths.publicPolicyEdit} params={{ policyId: String(item.id) }}>
                    <Button variant="outline">Editar</Button>
                  </Link>
                  <Link to={appPaths.publicPolicyDetail} params={{ policyId: String(item.id) }}>
                    <Button>Ver detalhes</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Objetivo geral
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.objetivo_geral}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Instituicoes</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{formatNames(item.instituicoes_responsaveis)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Beneficiarios</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{formatNames(item.beneficiarios)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Indicador relacionado</p>
                    <p className="mt-2 text-sm font-medium text-cyan-950">{buildIndicatorLabel(item.indicador_chave)}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Objetivos especificos</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {item.objetivos_especificos.map((objective) => (
                        <li key={objective.id}>{objective.descricao}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-white/70 bg-white/88">
            <CardContent className="p-6 text-sm text-slate-600">
              Nenhuma politica publica cadastrada ate o momento. Crie a primeira proposta estruturada para comecar a organizar respostas aos indicadores.
            </CardContent>
          </Card>
        )}
      </section>
    </>
  )
}
