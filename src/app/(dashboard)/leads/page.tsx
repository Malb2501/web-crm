import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }> = {
  new:       { label: "Novo",         variant: "secondary"   },
  contacted: { label: "Em Contato",   variant: "default"     },
  proposal:  { label: "Proposta",     variant: "warning"     },
  converted: { label: "Convertido",   variant: "success"     },
  lost:      { label: "Perdido",      variant: "destructive" },
}

const MOCK_LEADS = [
  { id: "1", name: "Ana Oliveira",   company: "TechBrasil",  email: "ana@techbrasil.com",  status: "new"       },
  { id: "2", name: "Carlos Souza",   company: "Inova SA",    email: "carlos@inova.com",    status: "contacted" },
  { id: "3", name: "Fernanda Lima",  company: "StartupXYZ",  email: "fe@startxyz.com",     status: "proposal"  },
  { id: "4", name: "Rafael Costa",   company: "Mega Corp",   email: "rafael@mega.com",     status: "converted" },
  { id: "5", name: "Juliana Martins",company: "Prime Ltda",  email: "ju@prime.com",        status: "lost"      },
]

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Leads</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            CRUD completo com Supabase — implementado no M9.
          </p>
        </div>
        <Button className="w-full sm:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar leads..." className="pl-8" disabled />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nome</th>
                <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Empresa</th>
                <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_LEADS.map((lead) => {
                const status = STATUS_LABEL[lead.status]
                return (
                  <tr key={lead.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-foreground">{lead.name}</td>
                    <td className="hidden px-6 py-4 text-muted-foreground md:table-cell">{lead.company}</td>
                    <td className="hidden px-6 py-4 text-muted-foreground lg:table-cell">{lead.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
