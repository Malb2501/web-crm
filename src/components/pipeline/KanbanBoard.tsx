"use client"

import { useState, useCallback } from "react"
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
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Deal, DealStage } from "@/types"
import { MOCK_DEALS } from "@/lib/mock/deals"
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

export function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [formSheet, setFormSheet] = useState<{ open: boolean; stage?: DealStage; deal?: Deal }>({ open: false })
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null)

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

    const activeDeal = deals.find(d => d.id === activeId)
    if (!activeDeal) return

    // Dropped onto a stage column
    if (STAGES.includes(overId as DealStage)) {
      const targetStage = overId as DealStage
      if (activeDeal.stage !== targetStage) {
        setDeals(prev => prev.map(d => d.id === activeId ? { ...d, stage: targetStage } : d))
      }
      return
    }

    // Dropped onto another card — reorder within or move across stages
    const overDeal = deals.find(d => d.id === overId)
    if (!overDeal) return

    if (activeDeal.stage === overDeal.stage) {
      setDeals(prev => {
        const stageDeals = prev.filter(d => d.stage === activeDeal.stage)
        const others     = prev.filter(d => d.stage !== activeDeal.stage)
        const oldIdx     = stageDeals.findIndex(d => d.id === activeId)
        const newIdx     = stageDeals.findIndex(d => d.id === overId)
        return [...others, ...arrayMove(stageDeals, oldIdx, newIdx)]
      })
    } else {
      setDeals(prev => prev.map(d => d.id === activeId ? { ...d, stage: overDeal.stage } : d))
    }
  }

  function handleAddDeal(stage: DealStage) {
    setFormSheet({ open: true, stage })
  }

  function handleSaveDeal(deal: Deal) {
    setDeals(prev => {
      const exists = prev.find(d => d.id === deal.id)
      return exists ? prev.map(d => d.id === deal.id ? deal : d) : [deal, ...prev]
    })
    setFormSheet({ open: false })
  }

  function handleDeleteDeal(id: string) {
    setDeals(prev => prev.filter(d => d.id !== id))
    setDetailDeal(null)
  }

  function handleEditFromDetail(deal: Deal) {
    setDetailDeal(null)
    setFormSheet({ open: true, deal })
  }

  const totalValue = deals
    .filter(d => d.stage !== "closed_lost")
    .reduce((sum, d) => sum + d.value, 0)

  const totalFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  }).format(totalValue)

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-1 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Pipeline de Vendas</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {deals.filter(d => d.stage !== "closed_lost").length} negócios abertos&nbsp;&bull;&nbsp;{totalFormatted} em pipeline
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setFormSheet({ open: true })}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Novo Negócio
        </Button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage, index) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage(stage)}
              index={index}
              onDealClick={setDetailDeal}
              onAddDeal={handleAddDeal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.18,0.67,0.6,1.22)" }}>
          {activeDeal && (
            <DealCard deal={activeDeal} onClick={() => {}} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>

      {/* Sheets */}
      <DealFormSheet
        open={formSheet.open}
        defaultStage={formSheet.stage}
        deal={formSheet.deal}
        onClose={() => setFormSheet({ open: false })}
        onSave={handleSaveDeal}
      />

      <DealDetailSheet
        deal={detailDeal}
        onClose={() => setDetailDeal(null)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteDeal}
      />
    </div>
  )
}
