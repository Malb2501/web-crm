"use client"

import { useActionState, useEffect, useRef } from 'react'
import { Mail, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inviteMember } from '@/lib/actions/members'

type State = { error?: string; success?: boolean } | null

async function action(_prev: State, formData: FormData): Promise<State> {
  const result = await inviteMember(formData)
  if ('error' in result) return { error: result.error }
  return { success: true }
}

export function InviteMemberForm() {
  const [state, formAction, isPending] = useActionState(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  // Bug 9 fix: reseta o formulário quando a action retorna sucesso
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_160px_auto] items-end">
        <div className="space-y-1.5">
          <Label htmlFor="invite-email">E-mail do convidado</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="invite-email"
              name="email"
              type="email"
              placeholder="colaborador@empresa.com"
              className="pl-9"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-role">Papel</Label>
          <Select name="role" defaultValue="member">
            <SelectTrigger id="invite-role" disabled={isPending}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Membro</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="bg-accent hover:bg-accent/90 gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {isPending ? 'Enviando…' : 'Convidar'}
        </Button>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-500">Convite enviado com sucesso!</p>
      )}
    </form>
  )
}
