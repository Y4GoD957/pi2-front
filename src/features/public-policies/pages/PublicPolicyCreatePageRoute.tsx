import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { usePublicPolicyForm } from '@/features/public-policies/hooks/usePublicPolicyForm'

import { PublicPolicyCreatePage } from './PublicPolicyCreatePage'

export function PublicPolicyCreatePageRoute() {
  const form = usePublicPolicyForm('create')

  if (form.isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Preparando formulario da politica publica...
        </CardContent>
      </Card>
    )
  }

  if (form.error && !form.options.indicadores_disponiveis.length && !form.options.localidades.length) {
    return <AlertError message={form.error} />
  }

  return <PublicPolicyCreatePage {...form} />
}
