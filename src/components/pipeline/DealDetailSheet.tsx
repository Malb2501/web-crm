"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
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
import {
  CalendarDays,
  User2,
  Building2,
  Pencil,
  Trash2,
  DollarSign,
  Clock,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import type { Deal, DealStage } from "@/types"
import { StageBadge, STAGE_CONFIG } from "./StageBadge"

const STAGES = Object.entries(STAGE_CONFIG) as [DealStage, typeof STAGE_CONFIG[DealStage]][]

interface DealDetailSheetProps {
  deal: Deal | null
  onClose: () => void
  onEdit: (deal: Deal) => void
  onDelete: (id: string) => void
  onMove: (id: string, stage: DealStage) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isOverdue(deadline?: string) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function DealDetailSheet({ deal, onClose, onEdit, onDelete, onMove }: DealDetailSheetProps) {
  if (!deal) return null

  const cfg     = STAGE_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)

  return (
    <Sheet open={!!deal} onOpenChange={v => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          {/* Title row with three-dots menu */}
          <div className="flex items-start justify-between gap-2 pr-1">
            <SheetTitle className="text-base leading-snug">{deal.title}</SheetTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Opções do negócio"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Ações
                </DropdownMenuLabel>

                {/* Edit */}
                <DropdownMenuItem onClick={() => onEdit(deal)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Editar negócio
                </DropdownMenuItem>

                {/* Move to stage */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowRight className="mr-2 h-3.5 w-3.5" />
                    Mover para…
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {STAGES.filter(([key]) => key !== deal.stage).map(([key, s]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => { onMove(deal.id, key); onClose() }}
                      >
                        <span
                          className="mr-2 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: s.color }}
                        />
                        {s.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Quick close shortcuts */}
                {deal.stage !== "closed_won" && deal.stage !== "closed_lost" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => { onMove(deal.id, "closed_won"); onClose() }}
                      className="text-success focus:text-success"
                    >
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                      Marcar como Ganho
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { onMove(deal.id, "closed_lost"); onClose() }}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="mr-2 h-3.5 w-3.5" />
                      Marcar como Perdido
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                {/* Delete */}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => { onDelete(deal.id); onClose() }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Excluir negócio
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-1">
            <StageBadge stage={deal.stage} />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Value */}
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: cfg.border, background: cfg.bg }}
          >
            <DollarSign className="h-4 w-4 shrink-0" style={{ color: cfg.color }} />
            <div>
              <p className="text-xs text-muted-foreground">Valor estimado</p>
              <p className="text-xl font-bold tabular-nums" style={{ color: cfg.color }}>
                {formatCurrency(deal.value)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-3">
            {deal.lead && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Lead vinculado</p>
                  <p className="text-sm font-medium text-foreground">
                    {deal.lead.name}
                    {deal.lead.company && (
                      <span className="font-normal text-muted-foreground"> — {deal.lead.company}</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {deal.owner && (
              <div className="flex items-center gap-3">
                <User2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Responsável</p>
                  <p className="text-sm font-medium text-foreground">{deal.owner.name}</p>
                </div>
              </div>
            )}

            {deal.deadline && (
              <div className="flex items-center gap-3">
                <CalendarDays
                  className={`h-4 w-4 shrink-0 ${overdue ? "text-destructive" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="text-xs text-muted-foreground">Prazo</p>
                  <p className={`text-sm font-medium ${overdue ? "text-destructive" : "text-foreground"}`}>
                    {formatDate(deal.deadline)}
                    {overdue && <span className="ml-2 text-xs">(vencido)</span>}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Criado em</p>
                <p className="text-sm font-medium text-foreground">{formatDate(deal.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
