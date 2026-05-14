import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getLeads } from '@/lib/data/leads'
import { LeadsView } from '@/components/leads/LeadsView'
import { FREE_LEAD_LIMIT } from '@/lib/limits'
import type { LeadStatus } from '@/types'

const VALID_STATUSES = new Set<string>(['new', 'contacted', 'proposal', 'converted', 'lost', 'all'])

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const params = await searchParams
  const rawStatus = params.status
  const status = rawStatus && VALID_STATUSES.has(rawStatus)
    ? (rawStatus as LeadStatus | 'all')
    : undefined

  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()

  const [leads, subResult, countResult] = await Promise.all([
    getLeads({ search: params.search, status }),
    workspaceId
      ? supabase.from('subscriptions').select('plan').eq('workspace_id', workspaceId).maybeSingle()
      : Promise.resolve({ data: null }),
    workspaceId
      ? supabase.from('leads').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId)
      : Promise.resolve({ count: 0 }),
  ])

  const plan = (subResult as { data: { plan: string } | null }).data?.plan ?? 'free'
  const totalLeadCount = (countResult as { count: number | null }).count ?? 0

  return (
    <LeadsView
      initialLeads={leads}
      plan={plan}
      totalLeadCount={totalLeadCount}
      leadLimit={FREE_LEAD_LIMIT}
    />
  )
}
