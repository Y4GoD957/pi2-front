import { useCallback, useEffect, useState } from 'react'

import {
  createPublicPolicy,
  fetchPublicPolicyById,
  fetchPublicPolicyFormOptions,
  updatePublicPolicy,
} from '@/services/publicPolicies/publicPolicyService'
import type {
  PublicPolicyDetail,
  PublicPolicyFormData,
  PublicPolicyFormErrors,
  PublicPolicyFormOptions,
  PublicPolicyPayload,
} from '@/types/publicPolicy'

const INITIAL_FORM: PublicPolicyFormData = {
  titulo: '',
  objetivo_geral: '',
  objetivos_especificos: [''],
  instituicoes_responsaveis: [''],
  beneficiarios: [''],
  id_dim_localidade: '',
  indicador_chave: '',
  id_relatorio: '',
}

function normalizeEntries(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean)
}

function validate(values: PublicPolicyFormData): PublicPolicyFormErrors {
  const errors: PublicPolicyFormErrors = {}

  if (!values.titulo.trim()) {
    errors.titulo = 'Informe o titulo da politica publica.'
  }

  if (!values.objetivo_geral.trim()) {
    errors.objetivo_geral = 'Informe o objetivo geral.'
  }

  const objetivos = normalizeEntries(values.objetivos_especificos)
  if (objetivos.length < 1) {
    errors.objetivos_especificos = 'Informe pelo menos um objetivo especifico.'
  } else if (objetivos.length > 3) {
    errors.objetivos_especificos = 'Informe no maximo tres objetivos especificos.'
  }

  if (normalizeEntries(values.instituicoes_responsaveis).length < 1) {
    errors.instituicoes_responsaveis = 'Informe ao menos uma instituicao responsavel.'
  }

  if (normalizeEntries(values.beneficiarios).length < 1) {
    errors.beneficiarios = 'Informe ao menos um beneficiario.'
  }

  return errors
}

function mapDetailToForm(detail: PublicPolicyDetail): PublicPolicyFormData {
  return {
    titulo: detail.titulo,
    objetivo_geral: detail.objetivo_geral,
    objetivos_especificos: detail.objetivos_especificos.map((item) => item.descricao),
    instituicoes_responsaveis: detail.instituicoes_responsaveis.map((item) => item.nome),
    beneficiarios: detail.beneficiarios.map((item) => item.nome),
    id_dim_localidade: detail.id_dim_localidade ? String(detail.id_dim_localidade) : '',
    indicador_chave: detail.indicador_chave ?? '',
    id_relatorio: detail.id_relatorio ? String(detail.id_relatorio) : '',
  }
}

export function usePublicPolicyForm(mode: 'create' | 'edit', policyId?: number | null) {
  const [form, setForm] = useState<PublicPolicyFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<PublicPolicyFormErrors>({})
  const [options, setOptions] = useState<PublicPolicyFormOptions>({
    localidades: [],
    indicadores_disponiveis: [],
    relatorios: [],
  })
  const [loadedPolicy, setLoadedPolicy] = useState<PublicPolicyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    void (async () => {
      try {
        const [formOptions, detail] = await Promise.all([
          fetchPublicPolicyFormOptions(),
          mode === 'edit' && policyId ? fetchPublicPolicyById(policyId) : Promise.resolve(null),
        ])

        if (!isMounted) {
          return
        }

        setOptions(formOptions)
        if (detail) {
          setLoadedPolicy(detail)
          setForm(mapDetailToForm(detail))
        }
      } catch (nextError) {
        if (!isMounted) {
          return
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel preparar o formulario da politica publica.',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [mode, policyId])

  const handleChange = useCallback((field: keyof PublicPolicyFormData, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setError(null)
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }, [])

  const handleListChange = useCallback(
    (field: 'objetivos_especificos' | 'instituicoes_responsaveis' | 'beneficiarios', index: number, value: string) => {
      setForm((current) => ({
        ...current,
        [field]: current[field].map((item, currentIndex) =>
          currentIndex === index ? value : item,
        ),
      }))
      setError(null)
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }))
    },
    [],
  )

  const addListItem = useCallback(
    (field: 'objetivos_especificos' | 'instituicoes_responsaveis' | 'beneficiarios') => {
      setForm((current) => {
        if (field === 'objetivos_especificos' && current[field].length >= 3) {
          return current
        }

        return {
          ...current,
          [field]: [...current[field], ''],
        }
      })
    },
    [],
  )

  const removeListItem = useCallback(
    (field: 'objetivos_especificos' | 'instituicoes_responsaveis' | 'beneficiarios', index: number) => {
      setForm((current) => {
        if (current[field].length === 1) {
          return {
            ...current,
            [field]: [''],
          }
        }

        return {
          ...current,
          [field]: current[field].filter((_, currentIndex) => currentIndex !== index),
        }
      })
    },
    [],
  )

  const submit = useCallback(async () => {
    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    const payload: PublicPolicyPayload = {
      titulo: form.titulo.trim(),
      objetivo_geral: form.objetivo_geral.trim(),
      objetivos_especificos: normalizeEntries(form.objetivos_especificos).map((descricao) => ({ descricao })),
      instituicoes_responsaveis: normalizeEntries(form.instituicoes_responsaveis),
      beneficiarios: normalizeEntries(form.beneficiarios),
      id_dim_localidade: form.id_dim_localidade ? Number(form.id_dim_localidade) : null,
      indicador_chave: form.indicador_chave.trim() || null,
      id_relatorio: form.id_relatorio ? Number(form.id_relatorio) : null,
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (mode === 'edit' && policyId) {
        const updated = await updatePublicPolicy(policyId, payload)
        setLoadedPolicy(updated)
        return updated
      }

      const created = await createPublicPolicy(payload)
      setLoadedPolicy(created)
      return created
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel salvar a politica publica.'

      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [form, mode, policyId])

  return {
    error,
    errors,
    form,
    handleChange,
    handleListChange,
    addListItem,
    removeListItem,
    isLoading,
    isSubmitting,
    loadedPolicy,
    options,
    submit,
  }
}
