interface DfHeatMapLegendProps {
  startLabel: string
  endLabel: string
}

export function DfHeatMapLegend({
  startLabel,
  endLabel,
}: DfHeatMapLegendProps) {
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full bg-[linear-gradient(90deg,#dbeafe_0%,#93c5fd_30%,#f59e0b_65%,#dc2626_100%)]" />
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  )
}
