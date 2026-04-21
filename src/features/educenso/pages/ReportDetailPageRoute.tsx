import { useParams } from '@tanstack/react-router'

import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useEducensoReportDetail } from '@/features/educenso/hooks/useEducensoReportDetail'

import { ReportDetailPage } from './ReportDetailPage'

export function ReportDetailPageRoute() {
  const params = useParams({ strict: false }) as { reportId?: string }
  const reportId = params.reportId ? Number(params.reportId) : null
  const { data, error, isLoading } = useEducensoReportDetail(reportId)

  if (isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando detalhe do relatorio...
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return <AlertError message={error ?? 'Relatorio indisponivel.'} />
  }

  return <ReportDetailPage {...data} />
}
