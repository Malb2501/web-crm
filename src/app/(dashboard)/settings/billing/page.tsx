import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { BillingPageClient } from '@/components/billing/BillingPageClient'

export default async function BillingPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) redirect('/onboarding')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, stripe_customer_id')
    .eq('workspace_id', workspaceId)
    .single()

  return (
    <BillingPageClient
      plan={sub?.plan ?? 'free'}
      status={sub?.status ?? 'active'}
      hasCustomer={!!sub?.stripe_customer_id}
    />
  )
}
