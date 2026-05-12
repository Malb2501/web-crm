import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  delta: number
  deltaLabel?: string
  icon: LucideIcon
  accentColor?: string
}

export function MetricCard({
  title,
  value,
  delta,
  deltaLabel = "vs. mês anterior",
  icon: Icon,
  accentColor = "#3B82F6",
}: MetricCardProps) {
  const positive = delta >= 0

  return (
    <div
      className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border/60 bg-card px-5 py-4"
      style={{ "--accent": accentColor } as React.CSSProperties}
    >
      {/* Subtle top gradient bar */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
        style={{ background: accentColor }}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `${accentColor}18` }}
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
              positive
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {positive ? "+" : ""}{delta.toFixed(1)}%
          </span>
          <span className="text-[11px] text-muted-foreground">{deltaLabel}</span>
        </div>
      </div>
    </div>
  )
}
