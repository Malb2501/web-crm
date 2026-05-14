"use client"

import { useTransition } from 'react'
import { Crown, Shield, Trash2, X, Clock, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InviteMemberForm } from './InviteMemberForm'
import { updateMemberRole, removeMember, cancelInvite } from '@/lib/actions/members'
import type { MemberWithProfile, PendingInvite } from '@/lib/data/members'

type Props = {
  members: MemberWithProfile[]
  pendingInvites: PendingInvite[]
  currentUserId: string
  isAdmin: boolean
  plan: string
  occupiedSlots: number
  memberLimit: number
}

function MemberRow({
  member,
  currentUserId,
  isAdmin,
}: {
  member: MemberWithProfile
  currentUserId: string
  isAdmin: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const isSelf = member.userId === currentUserId
  const initials = member.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')

  function handleRoleChange(newRole: 'admin' | 'member') {
    startTransition(async () => {
      await updateMemberRole(member.userId, newRole)
    })
  }

  function handleRemove() {
    if (!confirm(`Remover ${member.name} do workspace?`)) return
    startTransition(async () => {
      await removeMember(member.userId)
    })
  }

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
        {initials || '?'}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">
          {member.name}
          {isSelf && (
            <span className="ml-1.5 text-xs text-muted-foreground">(você)</span>
          )}
        </span>
        <span className="truncate text-xs text-muted-foreground">{member.email}</span>
      </div>

      <Badge
        variant="secondary"
        className={
          member.role === 'admin'
            ? 'bg-accent/10 text-accent border-accent/20'
            : 'bg-muted text-muted-foreground'
        }
      >
        {member.role === 'admin' ? (
          <><Crown className="mr-1 h-3 w-3" />Admin</>
        ) : (
          <><Shield className="mr-1 h-3 w-3" />Membro</>
        )}
      </Badge>

      {isAdmin && !isSelf && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              disabled={isPending}
            >
              <span className="text-base leading-none">⋯</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {member.role !== 'admin' && (
              <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
                <Crown className="mr-2 h-4 w-4" />
                Tornar admin
              </DropdownMenuItem>
            )}
            {member.role !== 'member' && (
              <DropdownMenuItem onClick={() => handleRoleChange('member')}>
                <Shield className="mr-2 h-4 w-4" />
                Tornar membro
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleRemove}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover do workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

function PendingInviteRow({
  invite,
  isAdmin,
}: {
  invite: PendingInvite
  isAdmin: boolean
}) {
  const [isPending, startTransition] = useTransition()

  const expiresDate = new Date(invite.expiresAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  function handleCancel() {
    startTransition(async () => {
      await cancelInvite(invite.id)
    })
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-card/50 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{invite.email}</span>
        <span className="text-xs text-muted-foreground">Expira em {expiresDate}</span>
      </div>

      <Badge variant="outline" className="text-muted-foreground shrink-0">
        Pendente
      </Badge>

      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          disabled={isPending}
          onClick={handleCancel}
          title="Cancelar convite"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function MembersPageClient({
  members,
  pendingInvites,
  currentUserId,
  isAdmin,
  plan,
  occupiedSlots,
  memberLimit,
}: Props) {
  const atLimit = plan === 'free' && occupiedSlots >= memberLimit

  return (
    <div className="space-y-8">
      {/* Contador de membros */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Membros do workspace</span>
          </div>
          {plan === 'free' ? (
            <span className={`text-sm ${occupiedSlots >= memberLimit ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
              <span className="font-semibold text-foreground">{occupiedSlots}</span>
              {' / '}
              <span>{memberLimit}</span>
              <span className="ml-1">do plano Free</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-accent font-medium">
              <Zap className="h-3.5 w-3.5" />
              Pro — ilimitado
            </span>
          )}
        </div>

        {plan === 'free' && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${occupiedSlots >= memberLimit ? 'bg-destructive' : 'bg-accent'}`}
              style={{ width: `${Math.min((occupiedSlots / memberLimit) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Lista de membros */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Membros ativos</h2>
        <div className="space-y-2">
          {members.map((m) => (
            <MemberRow
              key={m.userId}
              member={m}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>

      {/* Convites pendentes */}
      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Convites pendentes</h2>
          <div className="space-y-2">
            {pendingInvites.map((inv) => (
              <PendingInviteRow key={inv.id} invite={inv} isAdmin={isAdmin} />
            ))}
          </div>
        </div>
      )}

      {/* Formulário de convite */}
      {isAdmin && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Convidar colaborador</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Um e-mail com link de acesso será enviado automaticamente.
            </p>
          </div>

          {atLimit ? (
            <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-400">
              <strong>Limite atingido.</strong> O plano Free permite no máximo {memberLimit} membros (incluindo convites pendentes).{' '}
              <a href="/settings/billing" className="underline underline-offset-2">
                Faça upgrade para o Pro
              </a>{' '}
              para convidar mais colaboradores.
            </div>
          ) : (
            <InviteMemberForm />
          )}
        </div>
      )}
    </div>
  )
}
