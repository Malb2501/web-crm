'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import type { DealStage } from '@/types'

export type DealActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createDeal(formData: {
  title: string
  leadId: string
  value: number
  stage: DealStage
  ownerId: string
  deadline: string
}): Promise<DealActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  const { data, error } = await supabase
    .from('deals')
    .insert({
      workspace_id: workspaceId,
      title: formData.title.trim(),
      lead_id: formData.leadId || null,
      value: formData.value,
      stage: formData.stage,
      owner_id: formData.ownerId || user.id,
      deadline: formData.deadline || null,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true, id: data.id }
}

export async function updateDeal(
  id: string,
  formData: {
    title: string
    leadId: string
    value: number
    stage: DealStage
    ownerId: string
    deadline: string
  }
): Promise<DealActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  const { error } = await supabase
    .from('deals')
    .update({
      title: formData.title.trim(),
      lead_id: formData.leadId || null,
      value: formData.value,
      stage: formData.stage,
      owner_id: formData.ownerId || user.id,
      deadline: formData.deadline || null,
    })
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true, id }
}

export async function moveDeal(id: string, stage: DealStage): Promise<DealActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  const { error } = await supabase
    .from('deals')
    .update({ stage })
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true, id }
}

export async function deleteDeal(id: string): Promise<DealActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true, id }
}
