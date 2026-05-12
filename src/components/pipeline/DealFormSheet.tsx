"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Deal, DealStage } from "@/types"
import { STAGE_CONFIG } from "./StageBadge"
import { MOCK_LEADS } from "@/lib/mock/leads"

const STAGES = Object.entries(STAGE_CONFIG) as [DealStage, typeof STAGE_CONFIG[DealStage]][]

const ANA   = { id: "user-1", name: "Ana Silva",     email: "ana@pipeflow.com" }
const BRUNO = { id: "user-2", name: "Bruno Martins", email: "bruno@pipeflow.com" }
const OWNERS = [ANA, BRUNO]

interface DealFormSheetProps {
  open: boolean
  defaultStage?: DealStage
  deal?: Deal
  onClose: () => void
  onSave: (deal: Deal) => void
}

function emptyForm(stage?: DealStage): Partial<Deal> {
  return {
    stage: stage ?? "new_lead",
    title: "",
    value: 0,
    leadId: "",
    ownerId: "user-1",
    deadline: "",
  }
}

export function DealFormSheet({ open, defaultStage, deal, onClose, onSave }: DealFormSheetProps) {
  const isEdit = !!deal
  const [form, setForm] = useState<Partial<Deal>>(isEdit ? deal : emptyForm(defaultStage))

  useEffect(() => {
    setForm(isEdit ? deal : emptyForm(defaultStage))
  }, [open, deal, defaultStage, isEdit])

  function set(field: keyof Deal, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.value || !form.stage) return

    const selectedLead = MOCK_LEADS.find(l => l.id === form.leadId)
    const selectedOwner = OWNERS.find(o => o.id === form.ownerId)

    const saved: Deal = {
      id: deal?.id ?? `deal-${Date.now()}`,
      workspaceId: "ws-1",
      leadId: form.leadId ?? "",
      lead: selectedLead
        ? { id: selectedLead.id, name: selectedLead.name, company: selectedLead.company }
        : undefined,
      title: form.title,
      value: Number(form.value),
      stage: form.stage,
      ownerId: form.ownerId ?? "user-1",
      owner: selectedOwner ?? ANA,
      deadline: form.deadline || undefined,
      createdAt: deal?.createdAt ?? new Date().toISOString(),
    }
    onSave(saved)
  }

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar Negócio" : "Novo Negócio"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-title">Título do negócio *</Label>
            <Input
              id="deal-title"
              placeholder="Ex: Plano Pro — Empresa XYZ"
              value={form.title ?? ""}
              onChange={e => set("title", e.target.value)}
              required
            />
          </div>

          {/* Lead */}
          <div className="flex flex-col gap-1.5">
            <Label>Lead vinculado</Label>
            <Select value={form.leadId ?? ""} onValueChange={v => set("leadId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar lead…" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_LEADS.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} {lead.company ? `— ${lead.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-value">Valor estimado (R$) *</Label>
            <Input
              id="deal-value"
              type="number"
              min={0}
              step={100}
              placeholder="Ex: 4800"
              value={form.value ?? ""}
              onChange={e => set("value", e.target.value)}
              required
            />
          </div>

          {/* Estágio */}
          <div className="flex flex-col gap-1.5">
            <Label>Estágio *</Label>
            <Select value={form.stage ?? "new_lead"} onValueChange={v => set("stage", v as DealStage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    {cfg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Responsável */}
          <div className="flex flex-col gap-1.5">
            <Label>Responsável</Label>
            <Select value={form.ownerId ?? "user-1"} onValueChange={v => set("ownerId", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OWNERS.map(o => (
                  <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prazo */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-deadline">Prazo</Label>
            <Input
              id="deal-deadline"
              type="date"
              value={form.deadline ?? ""}
              onChange={e => set("deadline", e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {isEdit ? "Salvar alterações" : "Criar negócio"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
