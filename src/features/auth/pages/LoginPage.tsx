import { useState } from 'react'
import type { FormEvent } from 'react'

import logo from '@/assets/logo.png'
import { appPaths } from '@/app/routes/paths'
import { AlertError } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login as loginRequest } from '@/services/auth/authService'
import { Link } from 'react-router-dom'

interface FormState {
  email: string
  password: string
}

interface FieldErrors {
  email?: string
  password?: string
}

const INITIAL_STATE: FormState = {
  email: '',
  password: '',
}

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!values.email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Digite um e-mail valido.'
  }

  if (!values.password) {
    errors.password = 'Informe sua senha.'
  } else if (values.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  return errors
}

export function LoginPage() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    setAuthError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validate(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      const response = await loginRequest({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })

      login(response.user)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Nao foi possivel fazer login. Tente novamente.'
      setAuthError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-login-grid px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="auth-pulse absolute -left-12 top-20 h-52 w-52 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="auth-float absolute right-[-4rem] top-16 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="auth-pulse absolute bottom-[-5rem] left-1/4 h-64 w-64 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_86%,rgba(2,132,199,0.22),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(249,115,22,0.20),transparent_28%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <Card className="auth-slide-up w-full max-w-md border-white/40 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-28 items-center justify-center rounded-2xl bg-white px-3 shadow-sm ring-1 ring-cyan-200">
                <img
                  src={logo}
                  alt="EduCenso"
                  className="h-10 w-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-[0.18em] text-cyan-900">
                  EDUCENSO
                </p>
                <p className="text-xs text-muted-foreground">
                  Inteligencia para dados educacionais
                </p>
              </div>
            </div>
            <p className="inline-flex w-fit rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
              Plataforma EduCenso
            </p>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Acesse os dashboards e relatorios de indicadores educacionais.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@dominio.com"
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

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
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

              {authError ? <AlertError message={authError} /> : null}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <Link
                to={appPaths.register}
                className="block w-full text-center text-sm font-medium text-cyan-800 transition hover:text-cyan-950"
              >
                Criar conta
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
