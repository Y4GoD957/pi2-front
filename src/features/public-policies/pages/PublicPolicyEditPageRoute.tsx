import { useParams } from '@tanstack/react-router'

import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { usePublicPolicyForm } from '@/features/public-policies/hooks/usePublicPolicyForm'

import { PublicPolicyEditPage } from './PublicPolicyEditPage'

export function PublicPolicyEditPageRoute() {
  const params = useParams({ strict: false }) as { policyId?: string }
  const policyId = params.policyId ? Number(params.policyId) : null
  const form = usePublicPolicyForm('edit', policyId)

  if (!policyId) {
    return <AlertError message="Politica publica invalida." />
  }

  if (form.isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando politica publica para edicao...
        </CardContent>
      </Card>
    )
  }

  if (form.error && !form.loadedPolicy) {
    return <AlertError message={form.error} />
  }

  return <PublicPolicyEditPage {...form} policyId={policyId} />
}
