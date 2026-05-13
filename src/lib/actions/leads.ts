'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import type { LeadStatus } from '@/types'

export type LeadActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createLead(formData: {
  name: string
  email: string
  phone: string
  company: string
  jobTitle: string
  status: LeadStatus
}): Promise<LeadActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  // Verifica limite do plano Free
  const { count } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  if ((sub?.plan ?? 'free') === 'free' && (count ?? 0) >= 50) {
    return { success: false, error: 'Limite de 50 leads atingido no plano Free' }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      workspace_id: workspaceId,
      owner_id: user.id,
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      job_title: formData.jobTitle.trim() || null,
      status: formData.status,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/leads')
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true, id: data.id }
}

export async function updateLead(
  id: string,
  formData: {
    name: string
    email: string
    phone: string
    company: string
    jobTitle: string
    status: LeadStatus
  }
): Promise<LeadActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  const { error } = await supabase
    .from('leads')
    .update({
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      job_title: formData.jobTitle.trim() || null,
      status: formData.status,
    })
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  revalidatePath('/dashboard')
  return { success: true, id }
}

export async function deleteLead(id: string): Promise<LeadActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/leads')
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true, id }
}
