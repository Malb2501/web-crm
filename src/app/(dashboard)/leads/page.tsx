import { getLeads } from '@/lib/data/leads'
import { LeadsView } from '@/components/leads/LeadsView'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const params = await searchParams
  const leads = await getLeads({
    search: params.search,
    status: params.status as 'all' | undefined,
  })

  return <LeadsView initialLeads={leads} />
}
