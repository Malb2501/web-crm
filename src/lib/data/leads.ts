import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import type { Lead, Activity } from '@/types'
import type { LeadStatus } from '@/types'

export type LeadWithOwner = Lead & {
  ownerName: string | null
  ownerEmail: string | null
}

export type LeadFilters = {
  search?: string
  status?: LeadStatus | 'all'
}

export async function getLeads(filters: LeadFilters = {}): Promise<LeadWithOwner[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  let query = supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.search) {
    const term = filters.search.trim()
    query = query.or(`name.ilike.%${term}%,company.ilike.%${term}%,email.ilike.%${term}%`)
  }

  const { data, error } = await query
  if (error || !data) return []

  // Busca nomes dos owners em paralelo via auth.users não é possível via RLS anon,
  // então retornamos sem enriquecer — owner será resolvido via user_metadata no futuro
  return data.map(row => ({
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    email: row.email ?? '',
    phone: row.phone ?? undefined,
    company: row.company ?? undefined,
    jobTitle: row.job_title ?? undefined,
    status: row.status,
    ownerId: row.owner_id ?? '',
    createdAt: row.created_at,
    ownerName: null,
    ownerEmail: null,
  }))
}

export async function getLead(id: string): Promise<LeadWithOwner | null> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return null

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    workspaceId: data.workspace_id,
    name: data.name,
    email: data.email ?? '',
    phone: data.phone ?? undefined,
    company: data.company ?? undefined,
    jobTitle: data.job_title ?? undefined,
    status: data.status,
    ownerId: data.owner_id ?? '',
    createdAt: data.created_at,
    ownerName: null,
    ownerEmail: null,
  }
}

export async function getLeadActivities(leadId: string): Promise<Activity[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('lead_id', leadId)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(row => ({
    id: row.id,
    leadId: row.lead_id,
    workspaceId: row.workspace_id,
    type: row.type,
    description: row.description,
    authorId: row.author_id ?? '',
    createdAt: row.created_at,
  }))
}

export async function getLeadDeals(leadId: string) {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return []

  const { data, error } = await supabase
    .from('deals')
    .select('id, title, value, stage')
    .eq('lead_id', leadId)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data
}
