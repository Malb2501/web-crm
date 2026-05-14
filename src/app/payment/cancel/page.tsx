import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6 px-4 text-center">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Pagamento cancelado</h1>
          <p className="text-muted-foreground">
            Nenhuma cobrança foi realizada. Você pode fazer o upgrade a qualquer
            momento na página de assinatura.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/settings/billing">Ver planos</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Voltar ao dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
