import { AlertError } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { useEducensoReports } from '@/features/educenso/hooks/useEducensoReports'

import { ReportsPage } from './ReportsPage'

export function ReportsPageRoute() {
  const { error, filterOptions, filters, isLoading, reports, setFilters } =
    useEducensoReports()

  if (isLoading) {
    return (
      <Card className="border-white/70 bg-white/85 backdrop-blur-sm">
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando relatorios do usuario...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <AlertError message={error} />
  }

  return (
    <ReportsPage
      filterOptions={filterOptions}
      filters={filters}
      onChangeFilters={setFilters}
      reports={reports}
    />
  )
}
