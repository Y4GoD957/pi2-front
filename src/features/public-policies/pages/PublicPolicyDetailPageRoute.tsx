import { useParams } from '@tanstack/react-router'

import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { usePublicPolicyDetail } from '@/features/public-policies/hooks/usePublicPolicyDetail'

import { PublicPolicyDetailPage } from './PublicPolicyDetailPage'

export function PublicPolicyDetailPageRoute() {
  const params = useParams({ strict: false }) as { policyId?: string }
  const policyId = params.policyId ? Number(params.policyId) : null
  const detail = usePublicPolicyDetail(policyId)

  if (detail.isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando politica publica...
        </CardContent>
      </Card>
    )
  }

  if (detail.error && !detail.data) {
    return <AlertError message={detail.error} />
  }

  return <PublicPolicyDetailPage {...detail} />
}
