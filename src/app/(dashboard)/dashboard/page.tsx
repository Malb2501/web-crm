import { Suspense } from "react"
import { Users, KanbanSquare, DollarSign, TrendingUp } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { FunnelChart } from "@/components/dashboard/FunnelChart"
import { DealsTable } from "@/components/dashboard/DealsTable"
import {
  MetricCardSkeleton,
  FunnelChartSkeleton,
  DealsTableSkeleton,
} from "@/components/dashboard/DashboardSkeletons"
import {
  getDashboardMetrics,
  getFunnelData,
  getUpcomingDeals,
} from "@/lib/data/dashboard"

function formatCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
    notation: v >= 1_000_000 ? "compact" : "standard",
  }).format(v)
}

async function MetricsGrid() {
  const metrics = await getDashboardMetrics()

  const METRICS = [
    {
      title: "Total de Leads",
      value: String(metrics.totalLeads.current),
      delta: metrics.totalLeads.delta,
      icon: Users,
      accentColor: "#3B82F6",
    },
    {
      title: "Negócios Abertos",
      value: String(metrics.openDeals.current),
      delta: metrics.openDeals.delta,
      icon: KanbanSquare,
      accentColor: "#06B6D4",
    },
    {
      title: "Valor do Pipeline",
      value: formatCurrency(metrics.pipelineValue.current),
      delta: metrics.pipelineValue.delta,
      icon: DollarSign,
      accentColor: "#F59E0B",
    },
    {
      title: "Taxa de Conversão",
      value: `${metrics.conversionRate.current}%`,
      delta: metrics.conversionRate.delta,
      icon: TrendingUp,
      accentColor: "#22C55E",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS.map(m => (
        <MetricCard key={m.title} {...m} />
      ))}
    </div>
  )
}

async function FunnelSection() {
  const funnelData = await getFunnelData()

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Funil de Vendas</h3>
        <p className="text-xs text-muted-foreground">Negócios por etapa do pipeline</p>
      </div>
      <FunnelChart data={funnelData} />
    </div>
  )
}

async function UpcomingDealsSection() {
  const upcoming = await getUpcomingDeals()

  // Converte para o formato Deal esperado pelo DealsTable
  const deals = upcoming.map(d => ({
    id: d.id,
    workspaceId: "",
    leadId: "",
    title: d.title,
    value: d.value,
    stage: d.stage,
    ownerId: "",
    deadline: d.deadline,
    createdAt: "",
  }))

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Prazos Próximos</h3>
          <p className="text-xs text-muted-foreground">Negócios com vencimento nos próximos 7 dias</p>
        </div>
        {deals.length > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[11px] font-bold text-amber-400">
            {deals.length}
          </span>
        )}
      </div>
      <DealsTable deals={deals} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Visão Geral</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Resumo do pipeline com dados reais do banco
        </p>
      </div>

      <Suspense fallback={
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
        </div>
      }>
        <MetricsGrid />
      </Suspense>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Suspense fallback={
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <FunnelChartSkeleton />
          </div>
        }>
          <FunnelSection />
        </Suspense>

        <Suspense fallback={
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <DealsTableSkeleton />
          </div>
        }>
          <UpcomingDealsSection />
        </Suspense>
      </div>
    </div>
  )
}
