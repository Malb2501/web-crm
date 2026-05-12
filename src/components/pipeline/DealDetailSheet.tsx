"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, User2, Building2, Pencil, Trash2, DollarSign, Clock } from "lucide-react"
import type { Deal } from "@/types"
import { StageBadge, STAGE_CONFIG } from "./StageBadge"

interface DealDetailSheetProps {
  deal: Deal | null
  onClose: () => void
  onEdit: (deal: Deal) => void
  onDelete: (id: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
}

function isOverdue(deadline?: string) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function DealDetailSheet({ deal, onClose, onEdit, onDelete }: DealDetailSheetProps) {
  if (!deal) return null

  const cfg     = STAGE_CONFIG[deal.stage]
  const overdue = isOverdue(deal.deadline)

  return (
    <Sheet open={!!deal} onOpenChange={v => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2">
            <SheetTitle className="text-base leading-snug pr-2">{deal.title}</SheetTitle>
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

          {/* Details grid */}
          <div className="space-y-3">
            {deal.lead && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Lead vinculado</p>
                  <p className="text-sm font-medium text-foreground">
                    {deal.lead.name}
                    {deal.lead.company && (
                      <span className="text-muted-foreground font-normal"> — {deal.lead.company}</span>
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
                <CalendarDays className={`h-4 w-4 shrink-0 ${overdue ? "text-destructive" : "text-muted-foreground"}`} />
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

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              variant="outline"
              onClick={() => onEdit(deal)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(deal.id)}
              title="Excluir negócio"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
