import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import type { Deal, DealStage } from '@/types'

export type DealWithLead = Deal & {
  leadName: string | null
  leadCompany: string | null
}

export async function getDeals(): Promise<DealWithLead[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data, error } = await supabase
    .from('deals')
    .select('*, leads(id, name, company)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(row => {
    const lead = row.leads as { id: string; name: string; company: string | null } | null
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      leadId: row.lead_id ?? '',
      lead: lead ? { id: lead.id, name: lead.name, company: lead.company ?? undefined } : undefined,
      title: row.title,
      value: row.value,
      stage: row.stage as DealStage,
      ownerId: row.owner_id ?? '',
      deadline: row.deadline ?? undefined,
      createdAt: row.created_at,
      leadName: lead?.name ?? null,
      leadCompany: lead?.company ?? null,
    }
  })
}

export async function getLeadsForSelect() {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data, error } = await supabase
    .from('leads')
    .select('id, name, company')
    .eq('workspace_id', workspaceId)
    .order('name')

  if (error || !data) return []
  return data
}
