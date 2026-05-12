"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  CalendarDays,
  Building2,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Deal, DealStage } from "@/types"
import { STAGE_CONFIG } from "./StageBadge"
import { cn } from "@/lib/utils"

const STAGES = Object.entries(STAGE_CONFIG) as [DealStage, typeof STAGE_CONFIG[DealStage]][]

interface DealCardProps {
  deal: Deal
  onClick: (deal: Deal) => void
  onEdit: (deal: Deal) => void
  onMove: (id: string, stage: DealStage) => void
  onDelete: (id: string) => void
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
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
}

export function DealCard({
  deal,
  onClick,
  onEdit,
  onMove,
  onDelete,
  isDragOverlay = false,
}: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const cfg     = STAGE_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)
  const isClosedStage = deal.stage === "closed_won" || deal.stage === "closed_lost"

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
        padding: "10px 10px 10px 11px",
        "--stage-color": cfg.color,
        "--stage-glow": cfg.glow,
      } as React.CSSProperties}
    >
      {/* Title row + three-dots menu */}
      <div className="flex items-start justify-between gap-1">
        <p className="text-[13px] font-semibold leading-snug text-foreground line-clamp-2 flex-1">
          {deal.title}
        </p>

        {/* Three-dots menu — stop propagation so it doesn't drag or open the sheet */}
        {!isDragOverlay && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded",
                  "text-muted-foreground/40 transition-all",
                  "opacity-0 group-hover:opacity-100",
                  "hover:bg-muted hover:text-muted-foreground",
                  "data-[state=open]:opacity-100 data-[state=open]:bg-muted data-[state=open]:text-foreground"
                )}
                aria-label="Opções"
                onPointerDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48"
              onCloseAutoFocus={e => e.preventDefault()}
            >
              <DropdownMenuLabel className="text-[11px] font-normal text-muted-foreground">
                {deal.title.length > 28 ? deal.title.slice(0, 28) + "…" : deal.title}
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={e => { e.stopPropagation(); onEdit(deal) }}
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger onClick={e => e.stopPropagation()}>
                  <ArrowRight className="mr-2 h-3.5 w-3.5" />
                  Mover para…
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  {STAGES.filter(([key]) => key !== deal.stage).map(([key, s]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={e => { e.stopPropagation(); onMove(deal.id, key) }}
                    >
                      <span
                        className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {!isClosedStage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-success focus:text-success"
                    onClick={e => { e.stopPropagation(); onMove(deal.id, "closed_won") }}
                  >
                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                    Marcar como Ganho
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-muted-foreground focus:text-muted-foreground"
                    onClick={e => { e.stopPropagation(); onMove(deal.id, "closed_lost") }}
                  >
                    <XCircle className="mr-2 h-3.5 w-3.5" />
                    Marcar como Perdido
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={e => { e.stopPropagation(); onDelete(deal.id) }}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Lead / Company */}
      {deal.lead && (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="text-[11px] text-muted-foreground truncate">
            {deal.lead.company ?? deal.lead.name}
          </span>
        </div>
      )}

      {/* Value + deadline + avatar */}
      <div className="flex items-center justify-between pt-0.5">
        <span
          className="text-sm font-bold tabular-nums tracking-tight"
          style={{ color: cfg.color }}
        >
          {formatCurrency(deal.value)}
        </span>

        <div className="flex items-center gap-1.5">
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
