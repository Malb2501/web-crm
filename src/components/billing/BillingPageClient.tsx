"use client"

import { useTransition } from 'react'
import { Loader2, Zap, Check, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createCheckoutSession, createPortalSession } from '@/lib/actions/billing'
import type { WorkspacePlan } from '@/types'

interface Props {
  plan: WorkspacePlan
  status: string
  hasCustomer: boolean
}

const FREE_FEATURES = [
  'Até 50 leads',
  'Até 2 colaboradores',
  'Pipeline Kanban',
  'Dashboard de métricas',
]

const PRO_FEATURES = [
  'Leads ilimitados',
  'Colaboradores ilimitados',
  'Pipeline Kanban',
  'Dashboard de métricas',
  'Suporte prioritário',
]

export function BillingPageClient({ plan, status, hasCustomer }: Props) {
  const [isPendingCheckout, startCheckout] = useTransition()
  const [isPendingPortal, startPortal] = useTransition()

  const isPro = plan === 'pro'
  const isPastDue = status === 'past_due'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Assinatura</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie seu plano e dados de cobrança.
        </p>
      </div>

      {isPastDue && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <strong>Pagamento pendente:</strong> Houve um problema com a cobrança da sua
          assinatura. Atualize seu método de pagamento para continuar usando o plano Pro.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Free */}
        <Card className={!isPro ? 'ring-2 ring-accent' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Free</CardTitle>
              {!isPro && <Badge variant="secondary">Plano atual</Badge>}
            </div>
            <CardDescription>
              <span className="text-2xl font-bold text-foreground">R$0</span>
              <span className="text-muted-foreground">/mês</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className={isPro ? 'ring-2 ring-accent' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-accent" />
                Pro
              </CardTitle>
              {isPro && (
                <Badge className="bg-accent text-white">
                  {isPastDue ? 'Inadimplente' : 'Plano atual'}
                </Badge>
              )}
            </div>
            <CardDescription>
              <span className="text-2xl font-bold text-foreground">R$49</span>
              <span className="text-muted-foreground">/mês</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-accent" />
                  {f}
                </li>
              ))}
            </ul>

            {!isPro && (
              <form action={() => startCheckout(() => createCheckoutSession())}>
                <Button
                  type="submit"
                  className="mt-2 w-full bg-accent hover:bg-accent/90"
                  disabled={isPendingCheckout}
                >
                  {isPendingCheckout ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  {isPendingCheckout ? 'Redirecionando...' : 'Assinar Pro'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {isPro && hasCustomer && (
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Gerenciar assinatura</p>
              <p className="text-xs text-muted-foreground">
                Altere o cartão de crédito, veja o histórico de faturas ou cancele.
              </p>
            </div>
            <form action={() => startPortal(() => createPortalSession())}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isPendingPortal}
              >
                {isPendingPortal ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                {isPendingPortal ? 'Abrindo...' : 'Portal de cobrança'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
