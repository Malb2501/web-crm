import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KanbanSquare } from "lucide-react"

const STAGES = [
  { label: "Novo Lead",         count: 12, value: "R$ 48.000",  color: "secondary" as const },
  { label: "Contato Realizado", count: 8,  value: "R$ 62.500",  color: "default"   as const },
  { label: "Proposta Enviada",  count: 6,  value: "R$ 94.000",  color: "warning"   as const },
  { label: "Negociação",        count: 5,  value: "R$ 57.000",  color: "warning"   as const },
  { label: "Fechado Ganho",     count: 4,  value: "R$ 38.200",  color: "success"   as const },
  { label: "Fechado Perdido",   count: 3,  value: "R$ 21.000",  color: "destructive" as const },
]

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Pipeline de Vendas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Kanban com drag-and-drop — implementado no M6.
        </p>
      </div>

      {/* Preview das colunas — visual placeholder */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STAGES.map((stage) => (
          <Card key={stage.label} className="flex flex-col">
            <CardHeader className="pb-2 pt-4 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {stage.label}
                </CardTitle>
                <Badge variant={stage.color}>{stage.count}</Badge>
              </div>
              <p className="text-sm font-bold text-foreground">{stage.value}</p>
            </CardHeader>
            <CardContent className="flex-1 px-3 pb-3">
              <div className="flex h-20 items-center justify-center rounded border border-dashed border-border">
                <KanbanSquare className="h-4 w-4 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
