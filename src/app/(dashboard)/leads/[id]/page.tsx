import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge"
import { ActivityTimeline } from "@/components/leads/ActivityTimeline"
import { MOCK_LEADS } from "@/lib/mock/leads"
import type { DealStage } from "@/types"

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

const MOCK_DEALS: {
  id: string
  leadId: string
  title: string
  value: number
  stage: DealStage
}[] = [
  { id: "d1", leadId: "lead-02", title: "Licença Anual Pro",          value:  4800, stage: "proposal_sent" },
  { id: "d2", leadId: "lead-04", title: "Plano Pro — 12 meses",       value:  5880, stage: "closed_won"    },
  { id: "d3", leadId: "lead-07", title: "Enterprise — 20 usuários",   value: 14400, stage: "negotiation"   },
  { id: "d4", leadId: "lead-09", title: "Renovação Anual",            value:  3600, stage: "closed_won"    },
  { id: "d5", leadId: "lead-12", title: "Piloto 3 meses",             value:  1470, stage: "proposal_sent" },
]

const STAGE_LABEL: Record<DealStage, string> = {
  new_lead:      "Novo Lead",
  contacted:     "Contato Realizado",
  proposal_sent: "Proposta Enviada",
  negotiation:   "Negociação",
  closed_won:    "Fechado (Ganho)",
  closed_lost:   "Fechado (Perdido)",
}

const STAGE_VARIANT: Record<
  DealStage,
  "default" | "secondary" | "success" | "destructive" | "warning" | "outline"
> = {
  new_lead:      "secondary",
  contacted:     "default",
  proposal_sent: "warning",
  negotiation:   "warning",
  closed_won:    "success",
  closed_lost:   "destructive",
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = MOCK_LEADS.find(l => l.id === id)

  if (!lead) notFound()

  const deals = MOCK_DEALS.filter(d => d.leadId === id)

  return (
    <div className="space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Leads
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 flex-shrink-0 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-lg font-bold text-accent">{initials(lead.name)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {[lead.jobTitle, lead.company].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-2">
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <ActivityTimeline leadId={lead.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="E-mail">
                <span className="break-all">{lead.email}</span>
              </InfoRow>

              {lead.phone && (
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone">
                  {lead.phone}
                </InfoRow>
              )}

              {lead.company && (
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Empresa">
                  {lead.company}
                </InfoRow>
              )}

              {lead.jobTitle && (
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Cargo">
                  {lead.jobTitle}
                </InfoRow>
              )}

              {lead.owner && (
                <InfoRow icon={<User className="h-4 w-4" />} label="Responsável">
                  {lead.owner.name}
                </InfoRow>
              )}

              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Criado em">
                {formatDate(lead.createdAt)}
              </InfoRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                Negócios
                {deals.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {deals.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deals.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhum negócio vinculado ainda.
                </p>
              ) : (
                <div className="space-y-2">
                  {deals.map(deal => (
                    <div
                      key={deal.id}
                      className="rounded-md border border-border p-3 space-y-1.5"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {deal.title}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={STAGE_VARIANT[deal.stage]} className="text-xs">
                          {STAGE_LABEL[deal.stage]}
                        </Badge>
                        <span className="text-xs font-semibold text-foreground">
                          {deal.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{children}</p>
      </div>
    </div>
  )
}
