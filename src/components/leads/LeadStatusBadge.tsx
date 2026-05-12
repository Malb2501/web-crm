import { Badge } from "@/components/ui/badge"
import type { BadgeProps } from "@/components/ui/badge"
import type { LeadStatus } from "@/types"

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  new:       { label: "Novo",       variant: "secondary"   },
  contacted: { label: "Contatado",  variant: "default"     },
  proposal:  { label: "Proposta",   variant: "warning"     },
  converted: { label: "Convertido", variant: "success"     },
  lost:      { label: "Perdido",    variant: "destructive" },
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const { label, variant } = STATUS_CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}
