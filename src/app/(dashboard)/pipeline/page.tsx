import { getDeals, getLeadsForSelect } from '@/lib/data/deals'
import { KanbanBoard } from '@/components/pipeline/KanbanBoard'

export default async function PipelinePage() {
  const [deals, leads] = await Promise.all([
    getDeals(),
    getLeadsForSelect(),
  ])

  return (
    <div className="flex h-full flex-col">
      <KanbanBoard initialDeals={deals} availableLeads={leads} />
    </div>
  )
}
