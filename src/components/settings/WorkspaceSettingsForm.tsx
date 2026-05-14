"use client"

import { useActionState } from 'react'
import { Building2, Calendar, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateWorkspace } from '@/lib/actions/workspace'

type Props = {
  workspace: { id: string; name: string; plan: string; createdAt: string }
  isAdmin: boolean
}

type State = { error?: string; success?: boolean } | null

async function action(_prev: State, formData: FormData): Promise<State> {
  const result = await updateWorkspace(formData)
  if ('error' in result) return { error: result.error }
  return { success: true }
}

export function WorkspaceSettingsForm({ workspace, isAdmin }: Props) {
  const [state, formAction, isPending] = useActionState(action, null)

  const createdDate = new Date(workspace.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Plano atual</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground capitalize">
            {workspace.plan === 'pro' ? (
              <span className="text-accent">Pro</span>
            ) : (
              'Free'
            )}
          </p>
          {workspace.plan === 'free' && (
            <p className="mt-1 text-xs text-muted-foreground">
              Até 2 membros · 50 leads
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Criado em</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-foreground">{createdDate}</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-accent" />
          <h2 className="text-base font-semibold text-foreground">Informações do Workspace</h2>
        </div>

        <form action={formAction} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome do workspace</Label>
            <Input
              id="name"
              name="name"
              defaultValue={workspace.name}
              disabled={!isAdmin || isPending}
              placeholder="Nome da sua empresa"
              maxLength={80}
            />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-sm text-green-500">Workspace atualizado com sucesso.</p>
          )}

          {isAdmin ? (
            <Button type="submit" disabled={isPending} className="bg-accent hover:bg-accent/90">
              {isPending ? 'Salvando…' : 'Salvar alterações'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Apenas administradores podem editar o workspace.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
