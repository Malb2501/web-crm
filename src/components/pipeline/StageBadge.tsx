import type { DealStage } from "@/types"
import { cn } from "@/lib/utils"

export const STAGE_CONFIG: Record<DealStage, {
  label: string
  color: string
  bg: string
  border: string
  glow: string
}> = {
  new_lead:      { label: "Novo Lead",         color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.35)",  glow: "rgba(59,130,246,0.18)"  },
  contacted:     { label: "Contato Realizado", color: "#06B6D4", bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.35)",   glow: "rgba(6,182,212,0.18)"   },
  proposal_sent: { label: "Proposta Enviada",  color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)",  glow: "rgba(245,158,11,0.18)"  },
  negotiation:   { label: "Negociação",        color: "#F97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.35)",  glow: "rgba(249,115,22,0.18)"  },
  closed_won:    { label: "Fechado Ganho",     color: "#22C55E", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.35)",   glow: "rgba(34,197,94,0.18)"   },
  closed_lost:   { label: "Fechado Perdido",   color: "#EF4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.35)",   glow: "rgba(239,68,68,0.18)"   },
}

interface StageBadgeProps {
  stage: DealStage
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const cfg = STAGE_CONFIG[stage]
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", className)}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}
