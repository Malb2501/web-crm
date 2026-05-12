"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarDays, User2, Building2 } from "lucide-react"
import type { Deal } from "@/types"
import { STAGE_CONFIG } from "./StageBadge"
import { cn } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
  onClick: (deal: Deal) => void
  isDragOverlay?: boolean
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
}

function isOverdue(deadline?: string) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
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

  const cfg = STAGE_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onClick(deal)}
      className={cn(
        "deal-card group relative rounded-xl border p-3 cursor-grab active:cursor-grabbing select-none",
        "transition-all duration-200",
        isDragging && "opacity-40 scale-[0.97]",
        isDragOverlay && "shadow-2xl rotate-1 scale-105 cursor-grabbing opacity-100"
      )}
      style={{
        ...style,
        background: "rgba(30, 41, 59, 0.75)",
        backdropFilter: "blur(8px)",
        borderColor: `rgba(51,65,85,0.8)`,
        "--stage-color": cfg.color,
        "--stage-glow": cfg.glow,
        "--stage-border": cfg.border,
      } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: cfg.color }}
      />

      {/* Title */}
      <p className="text-sm font-semibold text-foreground leading-tight mb-2 pr-2 line-clamp-2">
        {deal.title}
      </p>

      {/* Lead / Company */}
      {deal.lead && (
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">
            {deal.lead.company ?? deal.lead.name}
          </span>
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between mt-1 gap-2">
        {/* Value */}
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: cfg.color }}
        >
          {formatCurrency(deal.value)}
        </span>

        <div className="flex items-center gap-2">
          {/* Deadline */}
          {deal.deadline && (
            <div className={cn("flex items-center gap-1", overdue ? "text-destructive" : "text-muted-foreground")}>
              <CalendarDays className="h-3 w-3 shrink-0" />
              <span className="text-xs font-medium">{formatDate(deal.deadline)}</span>
            </div>
          )}

          {/* Owner avatar */}
          {deal.owner && (
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shrink-0"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              title={deal.owner.name}
            >
              {deal.owner.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
