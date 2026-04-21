import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  createUserReport,
  fetchReportFormOptions,
} from '@/services/educenso/reportService'
import type {
  CreateReportFormData,
  CreateReportFormErrors,
  CreateReportPayload,
  ReportFormOptions,
} from '@/types/educenso'

const INITIAL_FORM: CreateReportFormData = {
  year: '',
  localidadeId: '',
  tipo: '',
  avaliacao: '',
  politicaPublica: '',
}

function validate(values: CreateReportFormData): CreateReportFormErrors {
  const errors: CreateReportFormErrors = {}

  if (!values.year) {
    errors.year = 'Selecione um ano.'
  }

  if (!values.localidadeId) {
    errors.localidadeId = 'Selecione uma localidade.'
  }

  if (!values.tipo.trim()) {
    errors.tipo = 'Informe o tipo do relatorio.'
  }

  if (!values.avaliacao.trim()) {
    errors.avaliacao = 'Descreva a avaliacao do recorte.'
  }

  return errors
}

export function useEducensoReportForm() {
  const { isAuthReady, user } = useAuth()
  const [form, setForm] = useState<CreateReportFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<CreateReportFormErrors>({})
  const [options, setOptions] = useState<ReportFormOptions>({
    years: [],
    localities: [],
  })
  const [createdReportId, setCreatedReportId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    void fetchReportFormOptions()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setOptions(response)
      })
      .catch((nextError) => {
        if (!isMounted) {
          return
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Nao foi possivel preparar o formulario.',
        )
      })
      .finally(() => {
        if (!isMounted) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = useCallback(
    (field: keyof CreateReportFormData, value: string) => {
      setForm((current) => ({
        ...current,
        [field]: value,
      }))
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }))
      setError(null)
    },
    [],
  )

  const submit = useCallback(async () => {
    if (!isAuthReady || !user) {
      throw new Error('Usuario autenticado indisponivel para criar relatorio.')
    }

    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    const payload: CreateReportPayload = {
      year: Number(form.year),
      localidadeId: Number(form.localidadeId),
      tipo: Number(form.tipo),
      avaliacao: form.avaliacao.trim(),
      politicaPublica: form.politicaPublica.trim() || undefined,
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const created = await createUserReport(Number(user.id), payload)
      setCreatedReportId(created.report.idRelatorio)
      return created
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : 'Nao foi possivel criar o relatorio.'

      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [form, isAuthReady, user])

  return {
    createdReportId,
    error,
    errors,
    form,
    handleChange,
    isLoading,
    isSubmitting,
    options,
    submit,
  }
}
