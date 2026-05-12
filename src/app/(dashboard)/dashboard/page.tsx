import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, KanbanSquare, DollarSign } from "lucide-react"

const METRIC_CARDS = [
  {
    title: "Total de Leads",
    value: "124",
    delta: "+12%",
    deltaPositive: true,
    icon: Users,
    description: "vs. mês anterior",
  },
  {
    title: "Negócios Abertos",
    value: "38",
    delta: "+5%",
    deltaPositive: true,
    icon: KanbanSquare,
    description: "vs. mês anterior",
  },
  {
    title: "Valor do Pipeline",
    value: "R$ 284.500",
    delta: "+18%",
    deltaPositive: true,
    icon: DollarSign,
    description: "vs. mês anterior",
  },
  {
    title: "Taxa de Conversão",
    value: "23,4%",
    delta: "-2%",
    deltaPositive: false,
    icon: TrendingUp,
    description: "vs. mês anterior",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Visão Geral</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo do seu pipeline — dados reais chegam no M8.
        </p>
      </div>

      {/* Grid de métricas */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription>{card.title}</CardDescription>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Badge variant={card.deltaPositive ? "success" : "destructive"}>
                    {card.delta}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{card.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Placeholder do gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>Distribuição de negócios por etapa do pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border">
            <p className="text-sm text-muted-foreground">Gráfico Recharts — implementado no M7</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
