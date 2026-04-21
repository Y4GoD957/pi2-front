import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  EducensoAnalysisFilters,
  EducensoFilterOptions,
} from '@/types/educenso'

interface AnalysisFiltersProps {
  filters: EducensoAnalysisFilters
  options: EducensoFilterOptions
  onChange: (nextFilters: EducensoAnalysisFilters) => void
}

const ALL_VALUE = '__all__'

export function AnalysisFilters({
  filters,
  options,
  onChange,
}: AnalysisFiltersProps) {
  const updateFilter = <T extends keyof EducensoAnalysisFilters>(
    field: T,
    value: EducensoAnalysisFilters[T],
  ) => {
    onChange({
      ...filters,
      [field]: value,
    })
  }

  return (
    <Card className="border-white/70 bg-white/88 backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg">Filtros da analise</CardTitle>
          <p className="mt-2 text-sm text-slate-600">
            Combine recortes de tempo, localidade e tipo de relatorio.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({})}
        >
          Limpar filtros
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ano
          </p>
          <Select
            value={filters.year ? String(filters.year) : ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('year', value === ALL_VALUE ? undefined : Number(value))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os anos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos os anos</SelectItem>
              {options.years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            UF
          </p>
          <Select
            value={filters.uf ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('uf', value === ALL_VALUE ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as UFs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todas as UFs</SelectItem>
              {options.ufs.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Municipio
          </p>
          <Select
            value={filters.municipality ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('municipality', value === ALL_VALUE ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os municipios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos os municipios</SelectItem>
              {options.municipalities.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Setor censitario
          </p>
          <Select
            value={filters.censusSector ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('censusSector', value === ALL_VALUE ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os setores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos os setores</SelectItem>
              {options.censusSectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Tipo de relatorio
          </p>
          <Select
            value={filters.reportType ? String(filters.reportType) : ALL_VALUE}
            onValueChange={(value) =>
              updateFilter(
                'reportType',
                value === ALL_VALUE ? undefined : Number(value),
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos os tipos</SelectItem>
              {options.reportTypes.map((reportType) => (
                <SelectItem key={reportType} value={String(reportType)}>
                  Tipo {reportType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
