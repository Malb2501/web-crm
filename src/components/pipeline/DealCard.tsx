"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarDays, Building2 } from "lucide-react"
import type { Deal } from "@/types"
import { STAGE_CONFIG } from "./StageBadge"
import { cn } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
  onClick: (deal: Deal) => void
  isDragOverlay?: boolean
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function isOverdue(deadline?: string) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

function formatDeadline(dateStr: string) {
  const d = new Date(dateStr)
  const day = d.getDate().toString().padStart(2, "0")
  const month = d.toLocaleString("pt-BR", { month: "short" }).replace(".", "")
  return `${day} ${month}`
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase()
}

export function DealCard({ deal, onClick, isDragOverlay = false }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const cfg    = STAGE_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onClick(deal)}
      className={cn(
        "deal-card group relative flex flex-col gap-2 rounded-lg border border-border/60",
        "bg-card cursor-grab active:cursor-grabbing select-none",
        "transition-all duration-150",
        isDragging    && "opacity-30 scale-[0.98] shadow-none",
        isDragOverlay && "opacity-100 scale-[1.02] shadow-xl cursor-grabbing"
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        borderLeft: `3px solid ${cfg.color}`,
        paddingLeft: "10px",
        padding: "10px 10px 10px 11px",
        "--stage-color": cfg.color,
        "--stage-glow": cfg.glow,
      } as React.CSSProperties}
    >
      {/* Title */}
      <p className="text-[13px] font-semibold leading-snug text-foreground line-clamp-2 pr-1">
        {deal.title}
      </p>

      {/* Lead / Company */}
      {deal.lead && (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-[11px] text-muted-foreground truncate">
            {deal.lead.company ?? deal.lead.name}
          </span>
        </div>
      )}

      {/* Value + footer */}
      <div className="flex items-center justify-between pt-0.5">
        {/* Value */}
        <span
          className="text-sm font-bold tabular-nums tracking-tight"
          style={{ color: cfg.color }}
        >
          {formatCurrency(deal.value)}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Deadline badge */}
          {deal.deadline && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium",
                overdue
                  ? "bg-destructive/15 text-destructive"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <CalendarDays className="h-2.5 w-2.5" />
              {formatDeadline(deal.deadline)}
            </span>
          )}

          {/* Owner avatar */}
          {deal.owner && (
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              style={{
                background: `${cfg.color}22`,
                color: cfg.color,
                outline: `1px solid ${cfg.color}55`,
              }}
              title={deal.owner.name}
            >
              {initials(deal.owner.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
