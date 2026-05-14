import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getWorkspaceMembers, getMemberRole, getPendingInvites } from '@/lib/data/members'
import { MembersPageClient } from '@/components/settings/MembersPageClient'

export default async function MembersPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const [members, pendingInvites, role, workspaceResult] = await Promise.all([
    getWorkspaceMembers(),
    getPendingInvites(),
    getMemberRole(workspaceId),
    supabase.from('workspaces').select('plan').eq('id', workspaceId).single(),
  ])

  const plan = workspaceResult.data?.plan ?? 'free'

  return (
    <MembersPageClient
      members={members}
      pendingInvites={pendingInvites}
      currentUserId={user.id}
      isAdmin={role === 'admin'}
      plan={plan}
    />
  )
}
