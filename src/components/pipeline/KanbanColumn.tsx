"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import type { Deal, DealStage } from "@/types"
import { DealCard } from "./DealCard"
import { STAGE_CONFIG } from "./StageBadge"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  stage: DealStage
  deals: Deal[]
  index: number
  onDealClick: (deal: Deal) => void
  onAddDeal: (stage: DealStage) => void
  onEditDeal: (deal: Deal) => void
  onMoveDeal: (id: string, stage: DealStage) => void
  onDeleteDeal: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

export function KanbanColumn({ stage, deals, index, onDealClick, onAddDeal, onEditDeal, onMoveDeal, onDeleteDeal }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const cfg        = STAGE_CONFIG[stage]
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const isWon      = stage === "closed_won"
  const isLost     = stage === "closed_lost"

  return (
    <div
      className={cn(
        "kanban-column flex w-[272px] shrink-0 flex-col rounded-xl border transition-colors duration-150",
        isOver && "ring-1"
      )}
      style={{
        animationDelay: `${index * 70}ms`,
        background: isWon
          ? "rgba(34,197,94,0.04)"
          : isLost
          ? "rgba(100,116,139,0.04)"
          : "rgb(22 32 50 / 0.7)",
        borderColor: isOver ? cfg.border : "rgba(51,65,85,0.55)",
        "--tw-ring-color": cfg.border,
      } as React.CSSProperties}
    >
      {/* Stage color bar */}
      <div
        className="h-[3px] w-full rounded-t-xl shrink-0"
        style={{ background: cfg.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between px-3 py-2.5">
        <div className="min-w-0 flex-1 space-y-0.5">
          {/* Stage name + count */}
          <div className="flex items-center gap-2">
            {/* Dot indicator */}
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: cfg.color }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {cfg.label}
            </span>
            {/* Count pill */}
            <span
              className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums"
              style={{
                background: `${cfg.color}1A`,
                color: cfg.color,
              }}
            >
              {deals.length}
            </span>
          </div>

          {/* Total value */}
          <p className="pl-4 text-[13px] font-semibold text-foreground tabular-nums">
            {formatCurrency(totalValue)}
          </p>
        </div>

        {/* Add button */}
        <button
          onClick={() => onAddDeal(stage)}
          className={cn(
            "ml-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            "border border-border/60 text-muted-foreground",
            "transition-all hover:border-[var(--c)] hover:text-[var(--c)] hover:bg-[var(--cbg)]"
          )}
          style={{ "--c": cfg.color, "--cbg": `${cfg.color}15` } as React.CSSProperties}
          title="Adicionar negócio"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-border/40" />

      {/* Cards list */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-2.5 scrollbar-thin"
        style={{ minHeight: 64 }}
      >
        <SortableContext
          items={deals.map(d => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={onDealClick}
              onEdit={onEditDeal}
              onMove={onMoveDeal}
              onDelete={onDeleteDeal}
            />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg",
              "border border-dashed py-6 text-center",
              isOver && "border-solid"
            )}
            style={{
              borderColor: isOver ? cfg.color : `${cfg.color}25`,
              background: isOver ? `${cfg.color}08` : "transparent",
            }}
          >
            <span className="text-[11px] text-muted-foreground/50">
              {isOver ? "Soltar aqui" : "Sem negócios"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
