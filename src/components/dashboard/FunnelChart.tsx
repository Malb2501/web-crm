"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { STAGE_CONFIG } from "@/components/pipeline/StageBadge"
import type { DealStage } from "@/types"

interface FunnelDataPoint {
  stage: DealStage
  count: number
  value: number
}

interface FunnelChartProps {
  data: FunnelDataPoint[]
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
    notation: v >= 1_000_000 ? "compact" : "standard",
  }).format(v)
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: FunnelDataPoint }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const cfg = STAGE_CONFIG[d.stage]
  return (
    <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
      <p className="mt-1 text-sm font-bold text-foreground">
        {d.count} negócio{d.count !== 1 ? "s" : ""}
      </p>
      <p className="text-xs text-muted-foreground">{formatCurrency(d.value)}</p>
    </div>
  )
}

function CustomXAxisTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: DealStage } }) {
  if (!payload) return null
  const cfg = STAGE_CONFIG[payload.value]
  return (
    <text
      x={x}
      y={(y ?? 0) + 14}
      textAnchor="middle"
      fill={cfg.color}
      fontSize={11}
      fontWeight={500}
    >
      {cfg.label}
    </text>
  )
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barSize={36}>
        <CartesianGrid vertical={false} stroke="rgba(100,116,139,0.12)" />
        <XAxis
          dataKey="stage"
          axisLine={false}
          tickLine={false}
          tick={<CustomXAxisTick />}
          interval={0}
          height={32}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11 }}
          allowDecimals={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100,116,139,0.08)" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map(entry => (
            <Cell
              key={entry.stage}
              fill={STAGE_CONFIG[entry.stage].color}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
