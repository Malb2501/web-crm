import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { WorkspaceRow } from '@/types/supabase'

export type WorkspaceWithPlan = Pick<WorkspaceRow, 'id' | 'name' | 'plan'>

export async function getActiveWorkspaceId(): Promise<string | null> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

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
