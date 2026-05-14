import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md space-y-6 px-4 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Assinatura ativada!</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao PipeFlow Pro. Todos os limites foram removidos e você já
            pode convidar colaboradores ilimitados e criar quantos leads quiser.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/dashboard">Ir para o dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
