import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { WorkspaceRow } from '@/types/supabase'

export type WorkspaceWithPlan = Pick<WorkspaceRow, 'id' | 'name' | 'plan'>

export async function getActiveWorkspaceId(): Promise<string | null> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Verifica preferência salva no metadata
  const preferred = user.user_metadata?.active_workspace_id as string | undefined

  if (preferred) {
    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('workspace_id', preferred)
      .eq('user_id', user.id)
      .maybeSingle()
    if (member) return member.workspace_id
  }

  // Fallback: primeiro workspace do usuário
  const { data, error } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (error) return null
  return data?.workspace_id ?? null
}

export async function getUserWorkspaces(): Promise<WorkspaceWithPlan[]> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: members } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)

  if (!members || members.length === 0) return []

  const workspaceIds = members.map((m) => m.workspace_id)

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, plan')
    .in('id', workspaceIds)

  return (workspaces ?? []) as WorkspaceWithPlan[]
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
