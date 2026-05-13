"use client"

import { useState, useCallback, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { Plus, Kanban, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Deal, DealStage } from "@/types"
import { moveDeal, createDeal, updateDeal, deleteDeal } from "@/lib/actions/deals"
import { KanbanColumn } from "./KanbanColumn"
import { DealCard } from "./DealCard"
import { DealFormSheet } from "./DealFormSheet"
import { DealDetailSheet } from "./DealDetailSheet"

const STAGES: DealStage[] = [
  "new_lead",
  "contacted",
  "proposal_sent",
  "negotiation",
  "closed_won",
  "closed_lost",
]

type AvailableLead = { id: string; name: string; company: string | null }

interface KanbanBoardProps {
  initialDeals: Deal[]
  availableLeads: AvailableLead[]
}

export function KanbanBoard({ initialDeals, availableLeads }: KanbanBoardProps) {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [formSheet, setFormSheet] = useState<{ open: boolean; stage?: DealStage; deal?: Deal }>({ open: false })
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null)
  const [dealError, setDealError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setDeals(initialDeals)
  }, [initialDeals])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null

  const dealsByStage = useCallback(
    (stage: DealStage) => deals.filter(d => d.stage === stage),
    [deals]
  )

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return

    const activeId = active.id as string
    const overId   = over.id as string

    const deal = deals.find(d => d.id === activeId)
    if (!deal) return

    if (STAGES.includes(overId as DealStage)) {
      const targetStage = overId as DealStage
      if (deal.stage !== targetStage) {
        // Optimistic update
        setDeals(prev => prev.map(d => d.id === activeId ? { ...d, stage: targetStage } : d))
        startTransition(async () => {
          await moveDeal(activeId, targetStage)
          router.refresh()
        })
      }
      return
    }

    const overDeal = deals.find(d => d.id === overId)
    if (!overDeal) return

    if (deal.stage === overDeal.stage) {
      setDeals(prev => {
        const stageDeals = prev.filter(d => d.stage === deal.stage)
        const others     = prev.filter(d => d.stage !== deal.stage)
        const oldIdx     = stageDeals.findIndex(d => d.id === activeId)
        const newIdx     = stageDeals.findIndex(d => d.id === overId)
        return [...others, ...arrayMove(stageDeals, oldIdx, newIdx)]
      })
    } else {
      const targetStage = overDeal.stage
      setDeals(prev => prev.map(d => d.id === activeId ? { ...d, stage: targetStage } : d))
      startTransition(async () => {
        await moveDeal(activeId, targetStage)
        router.refresh()
      })
    }
  }

  function handleSaveDeal(deal: Deal) {
    setDealError(null)
    startTransition(async () => {
      if (deal.id.startsWith("deal-new-")) {
        const result = await createDeal({
          title: deal.title,
          leadId: deal.leadId ?? "",
          value: deal.value,
          stage: deal.stage,
          ownerId: deal.ownerId,
          deadline: deal.deadline ?? "",
        })
        if (!result.success) {
          setDealError(result.error)
          return
        }
        setDeals(prev => [{ ...deal, id: result.id }, ...prev])
      } else {
        const result = await updateDeal(deal.id, {
          title: deal.title,
          leadId: deal.leadId ?? "",
          value: deal.value,
          stage: deal.stage,
          ownerId: deal.ownerId,
          deadline: deal.deadline ?? "",
        })
        if (!result.success) {
          setDealError(result.error)
          return
        }
        setDeals(prev => prev.map(d => d.id === deal.id ? deal : d))
      }
      setFormSheet({ open: false })
      router.refresh()
    })
  }

  function handleDeleteDeal(id: string) {
    setDeals(prev => prev.filter(d => d.id !== id))
    setDetailDeal(null)
    startTransition(async () => {
      await deleteDeal(id)
      router.refresh()
    })
  }

  function handleEditFromDetail(deal: Deal) {
    setDetailDeal(null)
    setFormSheet({ open: true, deal })
  }

  function handleMoveDeal(id: string, stage: DealStage) {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage } : d))
    startTransition(async () => {
      await moveDeal(id, stage)
      router.refresh()
    })
  }

  const activeDeals  = deals.filter(d => d.stage !== "closed_lost")
  const wonDeals     = deals.filter(d => d.stage === "closed_won")
  const pipelineVal  = activeDeals.filter(d => d.stage !== "closed_won").reduce((s, d) => s + d.value, 0)
  const wonVal       = wonDeals.reduce((s, d) => s + d.value, 0)

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v)

  return (
    <div className="flex h-full flex-col gap-4 min-h-0">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Pipeline de Vendas
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {activeDeals.filter(d => d.stage !== "closed_won").length} negócios em andamento
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5">
            <Kanban className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Em pipeline</span>
            <span className="text-sm font-semibold text-foreground tabular-nums">{fmt(pipelineVal)}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-success/25 bg-success/5 px-3 py-1.5">
            <CircleDollarSign className="h-3.5 w-3.5 text-success" />
            <span className="text-xs text-muted-foreground">Ganho</span>
            <span className="text-sm font-semibold text-success tabular-nums">{fmt(wonVal)}</span>
          </div>
          <Button
            size="sm"
            onClick={() => setFormSheet({ open: true })}
            className="gap-1.5 shrink-0"
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
            Novo Negócio
          </Button>
        </div>
      </div>

      {/* ── Erro de ação ────────────────────────────────────── */}
      {dealError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive shrink-0">
          {dealError}
        </div>
      )}

      {/* ── Board ───────────────────────────────────────────── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board flex gap-3 overflow-x-auto pb-2 flex-1 min-h-0">
          {STAGES.map((stage, index) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage(stage)}
              index={index}
              onDealClick={setDetailDeal}
              onAddDeal={(s) => setFormSheet({ open: true, stage: s })}
              onEditDeal={(deal) => setFormSheet({ open: true, deal })}
              onMoveDeal={handleMoveDeal}
              onDeleteDeal={handleDeleteDeal}
            />
          ))}

          <div className="w-1 shrink-0" />
        </div>

        <DragOverlay dropAnimation={{ duration: 160, easing: "cubic-bezier(0.18,0.67,0.6,1.22)" }}>
          {activeDeal && (
            <DealCard
              deal={activeDeal}
              onClick={() => {}}
              onEdit={() => {}}
              onMove={() => {}}
              onDelete={() => {}}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>

      {/* ── Sheets ──────────────────────────────────────────── */}
      <DealFormSheet
        open={formSheet.open}
        defaultStage={formSheet.stage}
        deal={formSheet.deal}
        availableLeads={availableLeads}
        onClose={() => setFormSheet({ open: false })}
        onSave={handleSaveDeal}
      />
      <DealDetailSheet
        deal={detailDeal}
        onClose={() => setDetailDeal(null)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteDeal}
        onMove={handleMoveDeal}
      />
    </div>
  )
}
