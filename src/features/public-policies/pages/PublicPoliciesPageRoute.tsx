import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { usePublicPolicies } from '@/features/public-policies/hooks/usePublicPolicies'

import { PublicPoliciesPage } from './PublicPoliciesPage'

export function PublicPoliciesPageRoute() {
  const { items, error, isLoading } = usePublicPolicies()

  if (isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando politicas publicas...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <AlertError message={error} />
  }

  return <PublicPoliciesPage items={items} />
}
