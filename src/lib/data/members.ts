import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'

export type MemberWithProfile = {
  workspaceId: string
  userId: string
  role: 'admin' | 'member'
  joinedAt: string
  email: string
  name: string
}

export type PendingInvite = {
  id: string
  email: string
  role: 'admin' | 'member'
  expiresAt: string
  createdAt: string
}

export async function getWorkspaceMembers(): Promise<MemberWithProfile[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data: members } = await supabase
    .from('workspace_members')
    .select('workspace_id, user_id, role, joined_at')
    .eq('workspace_id', workspaceId)
    .order('joined_at', { ascending: true })

  if (!members || members.length === 0) return []

  const userIds = members.map((m) => m.user_id)

  // Buscar perfis via auth.users exposto por view (ou rpc) — usamos auth.getUser por membro
  // Como não há tabela profiles, consultamos via Supabase Admin API (service role) na action
  // Aqui retornamos dados básicos que serão enriquecidos pela Server Action quando necessário
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Busca metadata dos usuários via RPC segura
  const { data: profiles } = await supabase.rpc('get_users_basic_info', {
    p_user_ids: userIds,
  })

  const profileMap = new Map<string, { email: string; name: string }>()

  if (profiles) {
    for (const p of profiles as { id: string; email: string; name: string }[]) {
      profileMap.set(p.id, { email: p.email, name: p.name })
    }
  }

  // Fallback: se RPC não existir, preenche com dados do usuário atual
  if (!profiles && currentUser) {
    profileMap.set(currentUser.id, {
      email: currentUser.email ?? '',
      name: currentUser.user_metadata?.full_name ?? currentUser.email ?? 'Usuário',
    })
  }

  return members.map((m) => {
    const profile = profileMap.get(m.user_id)
    return {
      workspaceId: m.workspace_id,
      userId: m.user_id,
      role: m.role as 'admin' | 'member',
      joinedAt: m.joined_at,
      email: profile?.email ?? '',
      name: profile?.name ?? 'Usuário',
    }
  })
}

export async function getMemberRole(workspaceId: string): Promise<'admin' | 'member' | null> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  return (data?.role as 'admin' | 'member') ?? null
}

export async function getPendingInvites(): Promise<PendingInvite[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data } = await supabase
    .from('workspace_invites')
    .select('id, email, role, expires_at, created_at')
    .eq('workspace_id', workspaceId)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  return (data ?? []).map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role as 'admin' | 'member',
    expiresAt: inv.expires_at,
    createdAt: inv.created_at,
  }))
}

export async function getMemberCount(workspaceId: string): Promise<number> {
  const supabase = await getSupabaseServerClient()
  const { count } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
  return count ?? 0
}
