import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RegisterFormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterFieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface RegisterPageProps {
  onBackToLogin: () => void
}

const INITIAL_STATE: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function validate(values: RegisterFormState): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!values.name.trim()) {
    errors.name = 'Informe seu nome.'
  }

  if (!values.email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Digite um e-mail valido.'
  }

  if (!values.password) {
    errors.password = 'Informe uma senha.'
  } else if (values.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirme sua senha.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'As senhas precisam ser iguais.'
  }

  return errors
}

export function RegisterPage({ onBackToLogin }: RegisterPageProps) {
  const [form, setForm] = useState<RegisterFormState>(INITIAL_STATE)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const highlightItems = useMemo(
    () => [
      'Dashboards comparativos por territorio e ano',
      'Relatorios salvos por usuario',
      'Cruzamento entre educacao, contexto social e pandemia',
    ],
    [],
  )

  const handleChange = (field: keyof RegisterFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmitMessage(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validate(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    await new Promise((resolve) => window.setTimeout(resolve, 900))

    setSubmitMessage(
      `Cadastro pronto para integrar com API: ${form.email.trim().toLowerCase()}`,
    )
    setIsSubmitting(false)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f4fbff_0%,#eef6ff_42%,#fff8ef_100%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="auth-pulse absolute -left-16 top-10 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="auth-float absolute right-[-5rem] top-20 h-72 w-72 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="auth-pulse absolute bottom-[-4rem] left-1/3 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="auth-slide-up relative overflow-hidden rounded-[2rem] border border-white/50 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:px-10 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.18),transparent_32%)]" />
          <div className="relative space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-40 items-center justify-center rounded-[1.35rem] bg-white/95 px-4 shadow-lg ring-1 ring-white/20">
                <img
                  src={logo}
                  alt="EduCenso"
                  className="h-12 w-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.28em] text-cyan-200">
                  EDUCENSO
                </p>
                <h1 className="mt-2 max-w-lg text-3xl font-semibold leading-tight sm:text-5xl">
                  Crie sua conta e acompanhe sinais reais da educacao brasileira.
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Uma entrada mais editorial para o fluxo de cadastro, com foco em
              descoberta, contexto e continuidade para a integracao futura com
              autenticacao real.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlightItems.map((item, index) => (
                <article
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                    Recurso
                  </span>
                  <p className="mt-3 text-sm leading-6 text-slate-100">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Card className="auth-slide-up w-full border-white/60 bg-white/88 backdrop-blur-md">
          <CardHeader className="space-y-3">
            <p className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
              Novo acesso
            </p>
            <CardTitle>Cadastrar usuario</CardTitle>
            <CardDescription>
              Preencha os dados iniciais para criar seu acesso ao portal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name ? (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@educenso.dev"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email ? (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimo de 6 caracteres"
                    value={form.password}
                    onChange={(event) =>
                      handleChange('password', event.target.value)
                    }
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  {fieldErrors.password ? (
                    <p className="text-xs font-medium text-destructive">
                      {fieldErrors.password}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      handleChange('confirmPassword', event.target.value)
                    }
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                  {fieldErrors.confirmPassword ? (
                    <p className="text-xs font-medium text-destructive">
                      {fieldErrors.confirmPassword}
                    </p>
                  ) : null}
                </div>
              </div>

              {submitMessage ? (
                <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {submitMessage}
                </div>
              ) : null}

              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Preparando conta...' : 'Criar conta'}
                </Button>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full text-sm font-medium text-slate-700 transition hover:text-slate-950"
                >
                  Voltar para login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
