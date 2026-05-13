import { getLeads } from '@/lib/data/leads'
import { LeadsView } from '@/components/leads/LeadsView'
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

  const leads = await getLeads({ search: params.search, status })

  return <LeadsView initialLeads={leads} />
}
