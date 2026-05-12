import React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted/50", className)} style={style} />
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border/60 bg-card px-5 py-4">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl bg-muted/50" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="mt-2 h-4 w-20" />
      </div>
    </div>
  )
}

export function FunnelChartSkeleton() {
  const bars = [0.7, 0.55, 0.45, 0.35, 0.25, 0.2]
  return (
    <div className="flex h-[220px] items-end gap-2 px-4 pb-8">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="w-full rounded-t-sm" style={{ height: `${h * 160}px` }} />
          <Skeleton className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  )
}

export function DealsTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="ml-auto h-3.5 w-20" />
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}
