import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getOccupiedSlots } from '@/lib/data/members'
import { BillingPageClient } from '@/components/billing/BillingPageClient'
import { FREE_LEAD_LIMIT, FREE_MEMBER_LIMIT } from '@/lib/limits'

export default async function BillingPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const [subResult, leadCountResult, occupiedSlots] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('plan, status, stripe_customer_id')
      .eq('workspace_id', workspaceId)
      .single(),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
    getOccupiedSlots(workspaceId),
  ])

  return (
    <BillingPageClient
      plan={subResult.data?.plan ?? 'free'}
      status={subResult.data?.status ?? 'active'}
      hasCustomer={!!subResult.data?.stripe_customer_id}
      leadCount={leadCountResult.count ?? 0}
      memberCount={occupiedSlots}
      leadLimit={FREE_LEAD_LIMIT}
      memberLimit={FREE_MEMBER_LIMIT}
    />
  )
}
