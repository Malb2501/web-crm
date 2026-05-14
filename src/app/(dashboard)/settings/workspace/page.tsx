import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getMemberRole } from '@/lib/data/members'
import { WorkspaceSettingsForm } from '@/components/settings/WorkspaceSettingsForm'

export default async function WorkspaceSettingsPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const [role, workspaceResult] = await Promise.all([
    getMemberRole(workspaceId),
    supabase.from('workspaces').select('id, name, plan, created_at').eq('id', workspaceId).single(),
  ])

  const workspace = workspaceResult.data
  if (!workspace) redirect('/dashboard')

  return (
    <WorkspaceSettingsForm
      workspace={{ id: workspace.id, name: workspace.name, plan: workspace.plan, createdAt: workspace.created_at }}
      isAdmin={role === 'admin'}
    />
  )
}
