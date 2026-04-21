import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useEducensoReportForm } from '@/features/educenso/hooks/useEducensoReportForm'

import { ReportCreatePage } from './ReportCreatePage'

export function ReportCreatePageRoute() {
  const form = useEducensoReportForm()

  if (form.isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Preparando formulario de relatorio...
        </CardContent>
      </Card>
    )
  }

  if (form.error && !form.options.years.length && !form.options.localities.length) {
    return <AlertError message={form.error} />
  }

  return <ReportCreatePage {...form} />
}
