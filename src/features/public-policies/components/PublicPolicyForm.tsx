import { Link } from '@tanstack/react-router'
import type { FormEvent } from 'react'

import { appPaths } from '@/app/routes/paths'
import { AlertError } from '@/components/ui/alert'
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
import type { usePublicPolicyForm } from '@/features/public-policies/hooks/usePublicPolicyForm'

type PublicPolicyFormProps = ReturnType<typeof usePublicPolicyForm> & {
  mode: 'create' | 'edit'
  onSubmitSuccess?: (policyId: number) => Promise<void> | void
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
}

export function PublicPolicyForm({
  mode,
  onSubmitSuccess,
  error,
  errors,
  form,
  handleChange,
  handleListChange,
  addListItem,
  removeListItem,
  isSubmitting,
  options,
  submit,
}: PublicPolicyFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await submit()

    if (!result) {
      return
    }

    await onSubmitSuccess?.(result.id)
  }

  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          {mode === 'create' ? 'Nova politica publica' : 'Editar politica publica'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
          <section className="space-y-4">
            <SectionHeader
              title="Identificacao da politica"
              description="Defina um titulo claro e um objetivo geral para orientar o entendimento da proposta."
            />
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Titulo</Label>
                <Input
                  id="titulo"
                  value={form.titulo}
                  onChange={(event) => handleChange('titulo', event.target.value)}
                  placeholder="Ex.: Programa de conectividade escolar no DF"
                />
                {errors.titulo ? <p className="text-xs font-medium text-destructive">{errors.titulo}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo_geral">Objetivo geral</Label>
                <textarea
                  id="objetivo_geral"
                  className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  value={form.objetivo_geral}
                  onChange={(event) => handleChange('objetivo_geral', event.target.value)}
                  placeholder="Descreva o objetivo geral da politica publica..."
                />
                {errors.objetivo_geral ? <p className="text-xs font-medium text-destructive">{errors.objetivo_geral}</p> : null}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Objetivos especificos"
              description="Cadastre de um a tres objetivos especificos para detalhar a acao publica."
            />
            <div className="space-y-3">
              {form.objetivos_especificos.map((item, index) => (
                <div key={`objetivo-${index}`} className="flex gap-3">
                  <Input
                    value={item}
                    onChange={(event) =>
                      handleListChange('objetivos_especificos', index, event.target.value)
                    }
                    placeholder={`Objetivo especifico ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeListItem('objetivos_especificos', index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
              <div className="flex justify-start">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addListItem('objetivos_especificos')}
                  disabled={form.objetivos_especificos.length >= 3}
                >
                  Adicionar objetivo
                </Button>
              </div>
              {errors.objetivos_especificos ? (
                <p className="text-xs font-medium text-destructive">{errors.objetivos_especificos}</p>
              ) : null}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <SectionHeader
                title="Instituicoes responsaveis"
                description="Estruture os responsaveis para permitir filtragem e analises futuras."
              />
              <div className="space-y-3">
                {form.instituicoes_responsaveis.map((item, index) => (
                  <div key={`instituicao-${index}`} className="flex gap-3">
                    <Input
                      value={item}
                      onChange={(event) =>
                        handleListChange('instituicoes_responsaveis', index, event.target.value)
                      }
                      placeholder="Nome da instituicao"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeListItem('instituicoes_responsaveis', index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addListItem('instituicoes_responsaveis')}
                >
                  Adicionar instituicao
                </Button>
                {errors.instituicoes_responsaveis ? (
                  <p className="text-xs font-medium text-destructive">{errors.instituicoes_responsaveis}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader
                title="Beneficiarios"
                description="Registre os grupos beneficiarios em formato reutilizavel para correlacoes futuras."
              />
              <div className="space-y-3">
                {form.beneficiarios.map((item, index) => (
                  <div key={`beneficiario-${index}`} className="flex gap-3">
                    <Input
                      value={item}
                      onChange={(event) =>
                        handleListChange('beneficiarios', index, event.target.value)
                      }
                      placeholder="Grupo beneficiario"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeListItem('beneficiarios', index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addListItem('beneficiarios')}
                >
                  Adicionar beneficiario
                </Button>
                {errors.beneficiarios ? (
                  <p className="text-xs font-medium text-destructive">{errors.beneficiarios}</p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Vinculos opcionais"
              description="Conecte a politica a localidade, indicador ou relatorio para preparar integracoes futuras sem alterar o dashboard atual."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="id_dim_localidade">Localidade</Label>
                <Select
                  value={form.id_dim_localidade || '__none__'}
                  onValueChange={(value) =>
                    handleChange('id_dim_localidade', value === '__none__' ? '' : value)
                  }
                >
                  <SelectTrigger id="id_dim_localidade">
                    <SelectValue placeholder="Sem localidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sem localidade</SelectItem>
                    {options.localidades.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.nome} - {item.uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indicador_chave">Indicador</Label>
                <Select
                  value={form.indicador_chave || '__none__'}
                  onValueChange={(value) =>
                    handleChange('indicador_chave', value === '__none__' ? '' : value)
                  }
                >
                  <SelectTrigger id="indicador_chave">
                    <SelectValue placeholder="Sem indicador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sem indicador</SelectItem>
                    {options.indicadores_disponiveis.map((item) => (
                      <SelectItem key={item.chave} value={item.chave}>
                        {item.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_relatorio">Relatorio vinculado</Label>
                <Select
                  value={form.id_relatorio || '__none__'}
                  onValueChange={(value) =>
                    handleChange('id_relatorio', value === '__none__' ? '' : value)
                  }
                >
                  <SelectTrigger id="id_relatorio">
                    <SelectValue placeholder="Sem relatorio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Sem relatorio</SelectItem>
                    {options.relatorios.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        Relatorio {item.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {error ? <AlertError message={error} /> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link to={appPaths.publicPolicies}>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting
                ? mode === 'create'
                  ? 'Salvando...'
                  : 'Atualizando...'
                : mode === 'create'
                  ? 'Criar politica publica'
                  : 'Salvar alteracoes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
