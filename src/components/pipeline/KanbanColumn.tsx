"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import type { Deal, DealStage } from "@/types"
import { DealCard } from "./DealCard"
import { STAGE_CONFIG } from "./StageBadge"

interface KanbanColumnProps {
  stage: DealStage
  deals: Deal[]
  index: number
  onDealClick: (deal: Deal) => void
  onAddDeal: (stage: DealStage) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
}

export function KanbanColumn({ stage, deals, index, onDealClick, onAddDeal }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const cfg = STAGE_CONFIG[stage]
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)

  const isWon  = stage === "closed_won"
  const isLost = stage === "closed_lost"

  return (
    <div
      className="kanban-column flex w-[272px] shrink-0 flex-col rounded-2xl border transition-colors duration-200"
      style={{
        animationDelay: `${index * 80}ms`,
        background: isWon
          ? "rgba(34,197,94,0.04)"
          : isLost
          ? "rgba(239,68,68,0.04)"
          : "rgba(15,23,42,0.6)",
        borderColor: isOver
          ? cfg.border
          : isWon
          ? "rgba(34,197,94,0.18)"
          : isLost
          ? "rgba(239,68,68,0.18)"
          : "rgba(51,65,85,0.6)",
        boxShadow: isOver ? `0 0 0 2px ${cfg.border}` : undefined,
      }}
    >
      {/* Column top accent */}
      <div
        className="h-[3px] w-full rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between px-3 pt-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
            <span
              className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {deals.length}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
            {formatCurrency(totalValue)}
          </p>
        </div>

        <button
          onClick={() => onAddDeal(stage)}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-muted-foreground transition-all hover:border-[var(--stage-border)] hover:text-[var(--stage-color)] hover:bg-card"
          style={{ "--stage-border": cfg.border, "--stage-color": cfg.color } as React.CSSProperties}
          title="Novo negócio"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-3 scrollbar-thin"
        style={{ minHeight: 80 }}
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div
            className="flex flex-1 items-center justify-center rounded-xl border border-dashed py-8 text-xs text-muted-foreground/50"
            style={{ borderColor: `${cfg.color}22` }}
          >
            Arraste cards aqui
          </div>
        )}
      </div>
    </div>
  )
}
