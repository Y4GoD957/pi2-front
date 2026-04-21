import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCpf, formatDateBr, formatPhone } from '@/lib/utils'
import type { AuthUser } from '@/types/auth'

interface ProfilePageProps {
  user: AuthUser
}

export function ProfilePage({ user }: ProfilePageProps) {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Conta do usuario
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Perfil do usuario
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Area inicial para dados cadastrais, preferencias e futuras
          configuracoes da conta.
        </p>
      </header>

      <Card className="border-white/70 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Informacoes de acesso</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Nome
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {user.name}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              E-mail
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {user.email}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Perfil
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {user.profileDescription ?? 'Nao informado'}
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
          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Endereco
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {user.address ?? 'Nao informado'}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
