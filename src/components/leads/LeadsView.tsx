"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge"
import { LeadFormSheet, type LeadFormData } from "@/components/leads/LeadFormSheet"
import { createLead, updateLead, deleteLead } from "@/lib/actions/leads"
import type { Lead, LeadStatus } from "@/types"

const ITEMS_PER_PAGE = 10

const STATUS_FILTERS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all",       label: "Todos"      },
  { value: "new",       label: "Novo"       },
  { value: "contacted", label: "Contatado"  },
  { value: "proposal",  label: "Proposta"   },
  { value: "converted", label: "Convertido" },
  { value: "lost",      label: "Perdido"    },
]

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

interface LeadsViewProps {
  initialLeads: Lead[]
}

export function LeadsView({ initialLeads }: LeadsViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const filtered = leads.filter(lead => {
    const term = search.toLowerCase()
    const matchSearch =
      !term ||
      lead.name.toLowerCase().includes(term) ||
      (lead.company ?? "").toLowerCase().includes(term) ||
      (lead.email ?? "").toLowerCase().includes(term)
    const matchStatus = statusFilter === "all" || lead.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusChange = (value: LeadStatus | "all") => {
    setStatusFilter(value)
    setPage(1)
  }

  const openCreate = () => {
    setEditingLead(null)
    setActionError(null)
    setFormOpen(true)
  }

  const openEdit = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingLead(lead)
    setActionError(null)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: LeadFormData) => {
    setActionError(null)
    startTransition(async () => {
      if (editingLead) {
        const result = await updateLead(editingLead.id, data)
        if (!result.success) {
          setActionError(result.error)
          return
        }
        setLeads(prev =>
          prev.map(l => l.id === editingLead.id ? { ...l, ...data } : l)
        )
      } else {
        const result = await createLead(data)
        if (!result.success) {
          setActionError(result.error)
          return
        }
        const newLead: Lead = {
          id: result.id,
          workspaceId: "",
          ownerId: "",
          createdAt: new Date().toISOString(),
          ...data,
        }
        setLeads(prev => [newLead, ...prev])
      }
      setFormOpen(false)
      setEditingLead(null)
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteLead(id)
      if (!result.success) {
        setActionError(result.error)
        return
      }
      setLeads(prev => prev.filter(l => l.id !== id))
      setFormOpen(false)
      setEditingLead(null)
      router.refresh()
    })
  }

  const isFiltered = !!(search || statusFilter !== "all")

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Leads</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {leads.length} {leads.length === 1 ? "lead" : "leads"} no workspace
            </p>
          </div>
          <Button onClick={openCreate} className="w-full sm:w-auto gap-2" disabled={isPending}>
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        </div>

        {actionError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}

        <Card>
          <CardHeader className="pb-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, empresa ou e-mail..."
                  className="pl-8"
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => handleStatusChange(f.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === f.value
                        ? "bg-accent text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {isFiltered && (
              <p className="text-xs text-muted-foreground">
                {filtered.length}{" "}
                {filtered.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {paginated.length === 0 ? (
              <EmptyState
                isFiltered={isFiltered}
                onClear={() => { setSearch(""); setStatusFilter("all") }}
                onNew={openCreate}
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Lead
                        </th>
                        <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                          E-mail
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Status
                        </th>
                        <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:table-cell">
                          Criado em
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginated.map(lead => (
                        <tr
                          key={lead.id}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => router.push(`/leads/${lead.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-accent/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-accent">
                                  {initials(lead.name)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {lead.name}
                                </p>
                                {lead.company && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {lead.company}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="hidden px-6 py-4 text-muted-foreground md:table-cell">
                            {lead.email}
                          </td>

                          <td className="px-6 py-4">
                            <LeadStatusBadge status={lead.status} />
                          </td>

                          <td className="hidden px-6 py-4 text-xs text-muted-foreground xl:table-cell">
                            {formatDate(lead.createdAt)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={e => openEdit(lead, e)}
                              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                              title="Editar lead"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border px-6 py-3">
                    <p className="text-xs text-muted-foreground">
                      Página {safePage} de {totalPages} · {filtered.length} leads
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`min-w-[32px] rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                            p === safePage
                              ? "bg-accent text-white"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <LeadFormSheet
        lead={editingLead}
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingLead(null) }}
        onSubmit={handleFormSubmit}
        onDelete={handleDelete}
        isPending={isPending}
      />
    </>
  )
}

function EmptyState({
  isFiltered,
  onClear,
  onNew,
}: {
  isFiltered: boolean
  onClear: () => void
  onNew: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
        {isFiltered ? (
          <Search className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Users className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      {isFiltered ? (
        <>
          <p className="text-sm font-medium text-foreground">Nenhum lead encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tente outros termos ou ajuste os filtros.
          </p>
          <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
            Limpar filtros
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground">Nenhum lead ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Comece adicionando seu primeiro lead.
          </p>
          <Button size="sm" onClick={onNew} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Criar primeiro lead
          </Button>
        </>
      )}
    </div>
  )
}
