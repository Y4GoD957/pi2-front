import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { appPaths } from '@/app/routes/paths'
import { formatCpf, formatDateBr, formatPhone } from '@/lib/utils'
import type { AuthUser } from '@/types/auth'
import {
  BadgeCheck,
  BellRing,
  FileText,
  MapPin,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react'

interface UserPageProps {
  user: AuthUser
}

const quickActions = [
  {
    title: 'Atualizar cadastro',
    description: 'Revise dados pessoais e mantenha a conta consistente.',
    icon: BadgeCheck,
  },
  {
    title: 'Preferencias',
    description: 'Organize notificacoes e comportamento da plataforma.',
    icon: BellRing,
  },
  {
    title: 'Relatorios salvos',
    description: 'Retome analises recentes da sua rotina no portal.',
    icon: FileText,
  },
] as const

export function UserPage({ user }: UserPageProps) {
  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,47,73,0.92),rgba(14,116,144,0.88))] p-6 text-white shadow-[0_24px_80px_rgba(14,116,144,0.18)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.16),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <ShieldCheck className="size-3.5" />
              Area do usuario
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-18 shrink-0 items-center justify-center rounded-[1.75rem] bg-white/12 ring-1 ring-white/15 backdrop-blur-sm">
                <UserCircle2 className="size-10 text-cyan-100" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {user.name}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  Espaco principal da sua conta para consultar identidade,
                  contexto de acesso e atalhos para as proximas interacoes do
                  sistema.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {quickActions.map((item) => {
                const Icon = item.icon

                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                  >
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-white/12 text-cyan-100">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {item.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>

          <Card className="border-white/10 bg-white/10 text-white backdrop-blur-md">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg text-white">
                Resumo rapido
              </CardTitle>
              <p className="text-sm text-slate-200">
                Dados centrais da sua conta para consulta imediata.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/80">
                  E-mail
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {user.email}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/80">
                  Perfil
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {user.profileDescription ?? 'Nao informado'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-cyan-100/80">
                  <MapPin className="size-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                    Endereco
                  </p>
                </div>
                <p className="mt-2 text-sm font-medium text-white">
                  {user.address ?? 'Nao informado'}
                </p>
              </div>
              <Link to={appPaths.account} className="block">
                <Button className="w-full bg-white text-slate-950 hover:bg-slate-100">
                  Gerenciar conta
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Identificacao</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Nome completo
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.name}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                CPF
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.cpf ? formatCpf(user.cpf) : 'Nao informado'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Data de nascimento
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.birthDate ? formatDateBr(user.birthDate) : 'Nao informado'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Telefone
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.phone ? formatPhone(user.phone) : 'Nao informado'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Contexto da conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Papel atual
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.profileDescription ?? 'Nao informado'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Canal principal
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.email}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Endereco cadastrado
              </p>
              <p className="mt-2 text-base font-medium text-slate-900">
                {user.address ?? 'Nao informado'}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
