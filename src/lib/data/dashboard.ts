import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import type { DealStage } from '@/types'
import { STAGE_CONFIG } from '@/components/pipeline/StageBadge'

export type DashboardMetric = {
  current: number
  delta: number
}

export type DashboardMetrics = {
  totalLeads: DashboardMetric
  openDeals: DashboardMetric
  pipelineValue: DashboardMetric
  conversionRate: DashboardMetric
}

export type FunnelDataPoint = {
  stage: DealStage
  label: string
  color: string
  count: number
  value: number
}

export type UpcomingDeal = {
  id: string
  title: string
  stage: DealStage
  value: number
  deadline: string
  ownerName: string | null
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()

  if (!workspaceId) {
    return {
      totalLeads:     { current: 0, delta: 0 },
      openDeals:      { current: 0, delta: 0 },
      pipelineValue:  { current: 0, delta: 0 },
      conversionRate: { current: 0, delta: 0 },
    }
  }

  const [leadsResult, dealsResult] = await Promise.all([
    supabase
      .from('leads')
      .select('id, status, created_at')
      .eq('workspace_id', workspaceId),
    supabase
      .from('deals')
      .select('id, stage, value, created_at')
      .eq('workspace_id', workspaceId),
  ])

  const leads = leadsResult.data ?? []
  const deals = dealsResult.data ?? []

  const totalLeads = leads.length
  const openDeals  = deals.filter(d =>
    d.stage !== 'closed_won' && d.stage !== 'closed_lost'
  ).length
  const pipelineValue = deals
    .filter(d => d.stage !== 'closed_lost')
    .reduce((s, d) => s + d.value, 0)

  const converted = leads.filter(l => l.status === 'converted').length
  const conversionRate = totalLeads > 0
    ? Math.round((converted / totalLeads) * 100)
    : 0

  // delta fixo em 0 por ora — exigiria dados históricos com períodos anteriores
  return {
    totalLeads:     { current: totalLeads,     delta: 0 },
    openDeals:      { current: openDeals,      delta: 0 },
    pipelineValue:  { current: pipelineValue,  delta: 0 },
    conversionRate: { current: conversionRate, delta: 0 },
  }
}

export async function getFunnelData(): Promise<FunnelDataPoint[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data, error } = await supabase
    .from('deals')
    .select('stage, value')
    .eq('workspace_id', workspaceId)

  if (error || !data) return []

  const STAGES: DealStage[] = [
    'new_lead', 'contacted', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost',
  ]

  return STAGES.map(stage => {
    const stageDeals = data.filter(d => d.stage === stage)
    const cfg = STAGE_CONFIG[stage]
    return {
      stage,
      label: cfg.label,
      color: cfg.color,
      count: stageDeals.length,
      value: stageDeals.reduce((s, d) => s + d.value, 0),
    }
  })
}

export async function getUpcomingDeals(): Promise<UpcomingDeal[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const today = new Date()
  const in7days = new Date(today)
  in7days.setDate(today.getDate() + 7)

  const { data, error } = await supabase
    .from('deals')
    .select('id, title, stage, value, deadline, owner_id')
    .eq('workspace_id', workspaceId)
    .not('deadline', 'is', null)
    .gte('deadline', today.toISOString().split('T')[0])
    .lte('deadline', in7days.toISOString().split('T')[0])
    .not('stage', 'in', '("closed_won","closed_lost")')
    .order('deadline', { ascending: true })

  if (error || !data) return []

  return data.map(d => ({
    id: d.id,
    title: d.title,
    stage: d.stage as DealStage,
    value: d.value,
    deadline: d.deadline!,
    ownerName: null,
  }))
}
