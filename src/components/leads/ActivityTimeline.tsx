"use client"

import { useState, useTransition } from "react"
import { Phone, Mail, Users, FileText, Plus, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createActivity } from "@/lib/actions/activities"
import type { Activity, ActivityType } from "@/types"

type ActivityConfig = {
  label: string
  icon: React.ReactNode
  color: string
  bg: string
}

const ACTIVITY_CONFIG: Record<ActivityType, ActivityConfig> = {
  call:    { label: "Ligação",  icon: <Phone    className="h-3.5 w-3.5" />, color: "text-blue-400",   bg: "bg-blue-400/10"   },
  email:   { label: "E-mail",   icon: <Mail     className="h-3.5 w-3.5" />, color: "text-violet-400", bg: "bg-violet-400/10" },
  meeting: { label: "Reunião",  icon: <Users    className="h-3.5 w-3.5" />, color: "text-amber-400",  bg: "bg-amber-400/10"  },
  note:    { label: "Nota",     icon: <FileText className="h-3.5 w-3.5" />, color: "text-slate-400",  bg: "bg-slate-400/10"  },
}

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "call",    label: "Ligação"  },
  { value: "email",   label: "E-mail"   },
  { value: "meeting", label: "Reunião"  },
  { value: "note",    label: "Nota"     },
]

function formatScheduledDate(date: string) {
  // date é "YYYY-MM-DD" — parseamos como local para evitar off-by-one de timezone
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

interface ActivityTimelineProps {
  leadId: string
  initialActivities: Activity[]
}

export function ActivityTimeline({ leadId, initialActivities }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [isAdding, setIsAdding] = useState(false)
  const [newType, setNewType] = useState<ActivityType>("call")
  const [newDesc, setNewDesc] = useState("")
  const [newDate, setNewDate] = useState("")
  const [descError, setDescError] = useState("")
  const [serverError, setServerError] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!newDesc.trim()) {
      setDescError("Descrição é obrigatória")
      return
    }
    setDescError("")
    setServerError("")

    startTransition(async () => {
      const result = await createActivity({
        leadId,
        type: newType,
        description: newDesc.trim(),
        scheduledDate: newDate || undefined,
      })

      if (!result.success) {
        setServerError(result.error)
        return
      }

      const optimistic: Activity = {
        id: result.id,
        leadId,
        workspaceId: "",
        type: newType,
        description: newDesc.trim(),
        authorId: "",
        scheduledDate: newDate || undefined,
        createdAt: new Date().toISOString(),
      }
      setActivities(prev => [optimistic, ...prev])
      setNewDesc("")
      setNewDate("")
      setNewType("call")
      setIsAdding(false)
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setNewDesc("")
    setNewDate("")
    setNewType("call")
    setDescError("")
    setServerError("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Atividades
          {activities.length > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({activities.length})
            </span>
          )}
        </h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-7 gap-1.5 text-xs"
          >
            <Plus className="h-3 w-3" />
            Registrar
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Nova atividade</p>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Tipo</Label>
            <div className="flex gap-1.5 flex-wrap">
              {TYPE_OPTIONS.map(opt => {
                const cfg = ACTIVITY_CONFIG[opt.value]
                const active = newType === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewType(opt.value)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${
                      active
                        ? `${cfg.bg} ${cfg.color} ring-current/40`
                        : "bg-muted text-muted-foreground ring-transparent hover:ring-border"
                    }`}
                  >
                    {cfg.icon}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={newDesc}
              onChange={e => {
                setNewDesc(e.target.value)
                if (descError) setDescError("")
              }}
              placeholder="Descreva o que aconteceu..."
              className="min-h-[80px] text-sm"
              disabled={isPending}
            />
            {descError && (
              <p className="text-xs text-destructive">{descError}</p>
            )}
            {serverError && (
              <p className="text-xs text-destructive">{serverError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="activity-date" className="text-xs">Data de execução</Label>
            <Input
              id="activity-date"
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              disabled={isPending}
              className="text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Opcional — quando esta atividade está agendada para ocorrer.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isPending}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/20 py-10 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma atividade registrada.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Registre ligações, e-mails, reuniões e notas.
          </p>
        </div>
      ) : (
        <div className="relative pl-1">
          <div className="absolute left-4 top-3 bottom-3 w-px bg-border" />

          <div className="space-y-1">
            {activities.map(activity => {
              const cfg = ACTIVITY_CONFIG[activity.type]
              return (
                <div key={activity.id} className="flex gap-4 pb-5 last:pb-0">
                  <div
                    className={`relative z-10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${cfg.bg}`}
                  >
                    <span className={cfg.color}>{cfg.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className={`text-xs font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {activity.author && (
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-[8px] font-bold text-muted-foreground">
                              {initials(activity.author.name)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {activity.author.name}
                          </span>
                        </div>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                      {activity.description}
                    </p>
                    {activity.scheduledDate && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">
                          {formatScheduledDate(activity.scheduledDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
