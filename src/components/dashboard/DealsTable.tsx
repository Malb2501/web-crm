import { CalendarDays, AlertCircle } from "lucide-react"
import { StageBadge } from "@/components/pipeline/StageBadge"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types"

interface DealsTableProps {
  deals: Deal[]
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(v)
}

function formatDeadline(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
}

function daysLeft(dateStr: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dl = new Date(dateStr)
  dl.setHours(0, 0, 0, 0)
  return Math.round((dl.getTime() - today.getTime()) / 86_400_000)
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
}

export function DealsTable({ deals }: DealsTableProps) {
  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Nenhum negócio com prazo nos próximos 7 dias</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Negócio
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Etapa
            </th>
            <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Valor
            </th>
            <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Prazo
            </th>
            <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Resp.
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {deals.map(deal => {
            const days = daysLeft(deal.deadline!)
            const urgent = days <= 2
            return (
              <tr key={deal.id} className="group transition-colors hover:bg-muted/30">
                <td className="py-3 pr-4">
                  <p className="font-medium text-foreground line-clamp-1">{deal.title}</p>
                  {deal.lead?.company && (
                    <p className="text-xs text-muted-foreground">{deal.lead.company}</p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <StageBadge stage={deal.stage} />
                </td>
                <td className="py-3 pr-4 text-right font-semibold tabular-nums text-foreground">
                  {formatCurrency(deal.value)}
                </td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {urgent && (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    )}
                    <div className={cn("text-right", urgent ? "text-amber-400" : "text-muted-foreground")}>
                      <p className="text-xs font-medium">{formatDeadline(deal.deadline!)}</p>
                      <p className="text-[10px]">
                        {days === 0 ? "hoje" : days === 1 ? "amanhã" : `${days} dias`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right">
                  {deal.owner && (
                    <div
                      className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8", outline: "1px solid rgba(99,102,241,0.3)" }}
                      title={deal.owner.name}
                    >
                      {initials(deal.owner.name)}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
