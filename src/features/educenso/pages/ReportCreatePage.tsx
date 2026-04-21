import { Link, useNavigate } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

import { appPaths } from '@/app/routes/paths'
import { AlertError, AlertSuccess } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { useEducensoReportForm } from '@/features/educenso/hooks/useEducensoReportForm'

type ReportCreatePageProps = ReturnType<typeof useEducensoReportForm>

export function ReportCreatePage({
  createdReportId,
  error,
  errors,
  form,
  handleChange,
  isSubmitting,
  options,
  submit,
}: ReportCreatePageProps) {
  const navigate = useNavigate()
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const localityLabel = useMemo(() => {
    const selected = options.localities.find(
      (item) => String(item.idLocalidade) === form.localidadeId,
    )

    if (!selected) {
      return ''
    }

    return selected.setorCensitario
      ? `${selected.municipio} - ${selected.uf} (${selected.setorCensitario})`
      : `${selected.municipio} - ${selected.uf}`
  }, [form.localidadeId, options.localities])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const created = await submit()

      if (!created) {
        return
      }

      setSubmitMessage('Relatorio criado com sucesso.')
      await navigate({
        to: appPaths.reportDetail,
        params: { reportId: String(created.report.idRelatorio) },
      })
    } catch {
      setSubmitMessage(null)
    }
  }

  return (
    <>
      <header className="rounded-[2rem] border border-slate-200/70 bg-white/82 p-6 shadow-sm backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Novo relatorio
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Registrar leitura analitica
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Crie um relatorio ligado ao usuario autenticado, com referencia de
          ano e localidade, para consolidar uma avaliacao e uma direcao inicial
          de politica publica.
        </p>
      </header>

      <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Formulario de criacao</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Select
                  value={form.year}
                  onValueChange={(value) => handleChange('year', value)}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Selecione um ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year ? (
                  <p className="text-xs font-medium text-destructive">
                    {errors.year}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="localidadeId">Localidade</Label>
                <Select
                  value={form.localidadeId}
                  onValueChange={(value) => handleChange('localidadeId', value)}
                >
                  <SelectTrigger id="localidadeId">
                    <SelectValue placeholder="Selecione uma localidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.localities.map((locality) => (
                      <SelectItem
                        key={locality.idLocalidade}
                        value={String(locality.idLocalidade)}
                      >
                        {locality.setorCensitario
                          ? `${locality.municipio} - ${locality.uf} (${locality.setorCensitario})`
                          : `${locality.municipio} - ${locality.uf}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.localidadeId ? (
                  <p className="text-xs font-medium text-destructive">
                    {errors.localidadeId}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de relatorio</Label>
                <Input
                  id="tipo"
                  inputMode="numeric"
                  value={form.tipo}
                  onChange={(event) => handleChange('tipo', event.target.value)}
                  placeholder="Ex.: 1"
                />
                {errors.tipo ? (
                  <p className="text-xs font-medium text-destructive">
                    {errors.tipo}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="politicaPublica">Politica publica sugerida</Label>
                <Input
                  id="politicaPublica"
                  value={form.politicaPublica}
                  onChange={(event) =>
                    handleChange('politicaPublica', event.target.value)
                  }
                  placeholder="Se vazio, uma sugestao inicial sera aplicada"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avaliacao">Avaliacao do recorte</Label>
              <textarea
                id="avaliacao"
                className="min-h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                value={form.avaliacao}
                onChange={(event) => handleChange('avaliacao', event.target.value)}
                placeholder="Descreva sua leitura do recorte selecionado..."
              />
              {errors.avaliacao ? (
                <p className="text-xs font-medium text-destructive">
                  {errors.avaliacao}
                </p>
              ) : null}
            </div>

            {(form.year || localityLabel) && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Contexto selecionado</p>
                <p className="mt-2">
                  {form.year ? `Ano ${form.year}` : 'Ano nao selecionado'}
                  {localityLabel ? ` • ${localityLabel}` : ''}
                </p>
              </div>
            )}

            {error ? <AlertError message={error} /> : null}
            {submitMessage ? <AlertSuccess message={submitMessage} /> : null}
            {createdReportId ? (
              <AlertSuccess
                message={`Relatorio ${createdReportId} criado e pronto para consulta.`}
              />
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link to={appPaths.reports}>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar relatorio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
