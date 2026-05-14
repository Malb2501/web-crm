import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getOccupiedSlots } from '@/lib/data/members'

export const FREE_LEAD_LIMIT = 50
export const FREE_MEMBER_LIMIT = 2

export type LimitCheck = { allowed: true } | { allowed: false; reason: string }

export async function canAddLead(): Promise<LimitCheck> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { allowed: false, reason: 'Workspace não encontrado.' }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  if ((sub?.plan ?? 'free') !== 'free') return { allowed: true }

  const { count } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  if ((count ?? 0) >= FREE_LEAD_LIMIT) {
    return {
      allowed: false,
      reason: `Limite de ${FREE_LEAD_LIMIT} leads atingido no plano Free. Faça upgrade para o Pro para adicionar mais.`,
    }
  }

  return { allowed: true }
}

export async function canAddMember(): Promise<LimitCheck> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { allowed: false, reason: 'Workspace não encontrado.' }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  if ((sub?.plan ?? 'free') !== 'free') return { allowed: true }

  const occupied = await getOccupiedSlots(workspaceId)
  if (occupied >= FREE_MEMBER_LIMIT) {
    return {
      allowed: false,
      reason: `Limite de ${FREE_MEMBER_LIMIT} membros atingido no plano Free. Faça upgrade para o Pro para convidar mais colaboradores.`,
    }
  }

  return { allowed: true }
}
