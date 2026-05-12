"use client"

import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Lead, LeadStatus } from "@/types"

export type LeadFormData = {
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  status: LeadStatus
}

const EMPTY_FORM: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  status: "new",
}

interface LeadFormSheetProps {
  lead?: Lead | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LeadFormData) => void
  onDelete?: (id: string) => void
}

export function LeadFormSheet({
  lead,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
}: LeadFormSheetProps) {
  const [form, setForm] = useState<LeadFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isEditing = !!lead

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? "",
        company: lead.company ?? "",
        jobTitle: lead.jobTitle ?? "",
        status: lead.status,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setConfirmDelete(false)
    setErrors({})
  }, [lead, isOpen])

  const validate = (): Partial<Record<keyof LeadFormData, string>> => {
    const errs: Partial<Record<keyof LeadFormData, string>> = {}
    if (!form.name.trim()) errs.name = "Nome é obrigatório"
    if (!form.email.trim()) {
      errs.email = "E-mail é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "E-mail inválido"
    }
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  const setField = (key: keyof LeadFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEditing ? "Editar Lead" : "Novo Lead"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-5 px-6 py-5">
            <div className="space-y-1.5">
              <Label htmlFor="lead-name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-name"
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                placeholder="João Silva"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-email">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-email"
                type="email"
                value={form.email}
                onChange={e => setField("email", e.target.value)}
                placeholder="joao@empresa.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Input
                id="lead-phone"
                type="tel"
                value={form.phone}
                onChange={e => setField("phone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-company">Empresa</Label>
              <Input
                id="lead-company"
                value={form.company}
                onChange={e => setField("company", e.target.value)}
                placeholder="Empresa Ltda"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-jobTitle">Cargo</Label>
              <Input
                id="lead-jobTitle"
                value={form.jobTitle}
                onChange={e => setField("jobTitle", e.target.value)}
                placeholder="Diretor Comercial"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-status">
                Status <span className="text-destructive">*</span>
              </Label>
              <select
                id="lead-status"
                value={form.status}
                onChange={e => setField("status", e.target.value as LeadStatus)}
                className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="new">Novo</option>
                <option value="contacted">Contatado</option>
                <option value="proposal">Proposta</option>
                <option value="converted">Convertido</option>
                <option value="lost">Perdido</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border px-6 py-4 space-y-3">
            {confirmDelete ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 space-y-2">
                <p className="text-sm font-medium text-destructive">Excluir este lead?</p>
                <p className="text-xs text-muted-foreground">
                  Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => lead && onDelete?.(lead.id)}
                  >
                    Sim, excluir
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? "Salvar alterações" : "Criar lead"}
                </Button>
                {isEditing && onDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setConfirmDelete(true)}
                    className="text-destructive hover:text-destructive hover:border-destructive/50"
                    title="Excluir lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
