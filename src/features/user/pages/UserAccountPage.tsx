import { Link, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { appPaths } from '@/app/routes/paths'
import { Alert, AlertError, AlertSuccess } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  extractDigits,
  formatCpf,
  formatPhone,
} from '@/lib/utils'
import type {
  ProfileOption,
  UpdateUserAccountPayload,
} from '@/services/user/userService'
import type { AuthUser } from '@/types/auth'
import { ArrowLeft, CalendarDays, Save, ShieldCheck } from 'lucide-react'

interface UserAccountPageProps {
  hasLoadedOnce: boolean
  isSaving: boolean
  isLoading: boolean
  onSave: (payload: UpdateUserAccountPayload) => Promise<AuthUser>
  profiles: ProfileOption[]
  profilesError: string | null
  user: AuthUser
}

interface AccountFormState {
  name: string
  email: string
  cpf: string
  birthDate: string
  phone: string
  address: string
  profileDescription: string
}

interface AccountFormErrors {
  name?: string
  email?: string
  cpf?: string
  birthDate?: string
  phone?: string
  address?: string
}

function parseIsoDate(value: string) {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function buildInitialState(user: AuthUser): AccountFormState {
  return {
    name: user.name,
    email: user.email,
    cpf: user.cpf ? formatCpf(user.cpf) : '',
    birthDate: user.birthDate ?? '',
    phone: user.phone ? formatPhone(user.phone) : '',
    address: user.address ?? '',
    profileDescription: user.profileDescription ?? '',
  }
}

function validate(values: AccountFormState): AccountFormErrors {
  const errors: AccountFormErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!values.name.trim()) {
    errors.name = 'Informe seu nome.'
  }

  if (!values.email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Digite um e-mail valido.'
  }

  if (values.cpf.trim() && extractDigits(values.cpf).length !== 11) {
    errors.cpf = 'Digite um CPF com 11 numeros.'
  }

  if (values.phone.trim() && extractDigits(values.phone).length < 10) {
    errors.phone = 'Digite um telefone valido com DDD.'
  }

  if (!values.address.trim()) {
    errors.address = 'Informe seu endereco.'
  }

  return errors
}

export function UserAccountPage({
  hasLoadedOnce,
  isLoading,
  isSaving,
  onSave,
  profiles,
  profilesError,
  user,
}: UserAccountPageProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<AccountFormState>(() => buildInitialState(user))
  const [errors, setErrors] = useState<AccountFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [lastSyncedUserId, setLastSyncedUserId] = useState(user.id)
  const [isDirty, setIsDirty] = useState(false)
  const selectedBirthDate = parseIsoDate(form.birthDate)

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSaving) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty, isSaving])

  useEffect(() => {
    const shouldSync =
      user.id !== lastSyncedUserId || (!isDirty && !isSaving)

    if (!shouldSync) {
      return
    }

    setForm(buildInitialState(user))
    setErrors({})
    setSubmitError(null)
    setLastSyncedUserId(user.id)
    setIsDirty(false)
  }, [isDirty, isSaving, lastSyncedUserId, user])

  const handleChange = (field: keyof AccountFormState, value: string) => {
    const nextValue =
      field === 'cpf'
        ? formatCpf(value)
        : field === 'phone'
          ? formatPhone(value)
          : value

    setForm((prev) => ({ ...prev, [field]: nextValue }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmitError(null)
    setSubmitMessage(null)
    setIsDirty(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      await onSave({
        address: form.address.trim(),
        birthDate: form.birthDate,
        cpf: extractDigits(form.cpf),
        email: form.email.trim().toLowerCase(),
        name: form.name.trim(),
        phone: extractDigits(form.phone),
        profileId: profiles.find(
          (profile) => profile.description === form.profileDescription,
        )?.id,
      })

      setSubmitMessage(
        'As informacoes do perfil foram atualizadas com sucesso.',
      )
      setSubmitError(null)
      setIsDirty(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel salvar as alteracoes.',
      )
    }
  }

  const handleNavigateBack = async () => {
    if (isDirty && !isSaving) {
      const shouldLeave = window.confirm(
        'Existem alteracoes nao salvas. Deseja sair mesmo assim?',
      )

      if (!shouldLeave) {
        return
      }
    }

    await navigate({ to: appPaths.user })
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(14,116,144,0.88),rgba(251,146,60,0.18))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.16),transparent_28%)]" />
        <div className="relative space-y-4">
          <div className="space-y-4">
            <Link
              to={appPaths.user}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-white/15"
              onClick={(event) => {
                if (!isDirty || isSaving) {
                  return
                }

                const shouldLeave = window.confirm(
                  'Existem alteracoes nao salvas. Deseja sair mesmo assim?',
                )

                if (!shouldLeave) {
                  event.preventDefault()
                }
              }}
            >
              <ArrowLeft className="size-3.5" />
              Voltar para usuario
            </Link>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
                <ShieldCheck className="size-3.5" />
                Gerenciamento da conta
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Edite seus dados em um unico formulario
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Ajuste informacoes pessoais, contato e contexto cadastral em uma
                tela centralizada, pensada para manutencao da sua conta.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Dados da conta</CardTitle>
          </CardHeader>
          <CardContent>
            {isDirty ? (
              <Alert className="mb-5 border-amber-300 bg-amber-50 text-amber-800">
                Existem alteracoes nao salvas neste formulario.
              </Alert>
            ) : null}

            {isLoading && !hasLoadedOnce ? (
              <Alert className="mb-5 border-cyan-300 bg-cyan-50 text-cyan-800">
                Sincronizando dados mais recentes da conta com o banco...
              </Alert>
            ) : null}

            {profilesError ? <AlertError message={profilesError} /> : null}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      handleChange('email', event.target.value)
                    }
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    inputMode="numeric"
                    value={form.cpf}
                    onChange={(event) => handleChange('cpf', event.target.value)}
                    aria-invalid={Boolean(errors.cpf)}
                  />
                  {errors.cpf ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors.cpf}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="birthDate"
                        type="button"
                        variant="outline"
                        className="w-full justify-between border-input font-normal hover:border-primary/30 hover:bg-background focus-visible:ring-ring/50"
                        aria-invalid={Boolean(errors.birthDate)}
                      >
                        <span
                          className={
                            selectedBirthDate
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {selectedBirthDate
                            ? format(selectedBirthDate, 'dd/MM/yyyy')
                            : 'Selecione uma data'}
                        </span>
                        <CalendarDays className="size-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[22rem] p-2" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedBirthDate}
                        defaultMonth={selectedBirthDate ?? new Date()}
                        onSelect={(date) => {
                          handleChange(
                            'birthDate',
                            date ? format(date, 'yyyy-MM-dd') : '',
                          )
                        }}
                        locale={ptBR}
                        captionLayout="dropdown"
                        startMonth={new Date(1900, 0)}
                        endMonth={new Date()}
                        hideNavigation
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.birthDate ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors.birthDate}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(event) =>
                      handleChange('phone', event.target.value)
                    }
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileDescription">Perfil</Label>
                  <Select
                    value={form.profileDescription}
                    onValueChange={(value) =>
                      handleChange('profileDescription', value)
                    }
                  >
                    <SelectTrigger id="profileDescription">
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem
                          key={profile.id}
                          value={profile.description}
                        >
                          {profile.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereco</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(event) =>
                    handleChange('address', event.target.value)
                  }
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address ? (
                  <p className="text-xs font-medium text-destructive">
                    {errors.address}
                  </p>
                ) : null}
              </div>

              {submitError ? <AlertError message={submitError} /> : null}

              {submitMessage ? <AlertSuccess message={submitMessage} /> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    void handleNavigateBack()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
                  <Save className="mr-2 size-4" />
                  {isSaving ? 'Salvando...' : 'Salvar alteracoes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Orientacoes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Persistencia
              </p>
              <p className="mt-2 leading-6">
                As alteracoes desta tela agora consultam e atualizam os dados do
                proprio usuario no Supabase, respeitando as policies ja
                configuradas para a conta autenticada.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Campos mascarados
              </p>
              <p className="mt-2 leading-6">
                CPF e telefone seguem o mesmo padrao visual usado nas demais
                partes da plataforma para manter consistencia.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Jornada
              </p>
              <p className="mt-2 leading-6">
                Usuario funciona como visao geral; Gerenciar conta concentra a
                manutencao dos dados em um unico formulario.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
