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
const INDICATOR_LABELS: Record<string, string> = {
  adequate_housing_pct: 'Moradia adequada',
  illiteracy_rate_15_plus: 'Analfabetismo 15+',
  internet_access_pct: 'Acesso à internet',
  literacy_rate_15_plus: 'Alfabetização 15+',
  population_resident: 'População residente',
  school_attendance_rate: 'Frequência escolar',
}

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
            Combine recortes de tempo e indicador com leitura oficial do backend.
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
            Fonte
          </p>
          <Select
            value={filters.uf ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('uf', value === ALL_VALUE ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Fonte oficial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Fonte oficial</SelectItem>
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
            Indicador
          </p>
          <Select
            value={filters.municipality ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('municipality', value === ALL_VALUE ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os indicadores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Todos os indicadores</SelectItem>
              {options.municipalities.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {INDICATOR_LABELS[municipality] ?? municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recorte territorial
          </p>
          <Select
            value={filters.censusSector ?? ALL_VALUE}
            onValueChange={(value) =>
              updateFilter('censusSector', value === ALL_VALUE ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Nível atual" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Nível atual</SelectItem>
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
              <SelectValue placeholder="Sem uso nesta leitura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Sem uso nesta leitura</SelectItem>
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
