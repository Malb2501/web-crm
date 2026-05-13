'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import type { ActivityType } from '@/types'

export type ActivityActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createActivity(formData: {
  leadId: string
  type: ActivityType
  description: string
}): Promise<ActivityActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Não autenticado' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { success: false, error: 'Workspace não encontrado' }

  if (!formData.description.trim()) {
    return { success: false, error: 'Descrição é obrigatória' }
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      lead_id: formData.leadId,
      workspace_id: workspaceId,
      author_id: user.id,
      type: formData.type,
      description: formData.description.trim(),
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath(`/leads/${formData.leadId}`)
  return { success: true, id: data.id }
}
