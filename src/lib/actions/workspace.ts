'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

export async function createWorkspace(formData: FormData) {
  const name = (formData.get('workspaceName') as string)?.trim()

  if (!name || name.length < 2) {
    redirect('/onboarding?error=Nome+inv%C3%A1lido')
  }

  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const slug = `${toSlug(name)}-${Date.now().toString(36)}`

  const { error } = await supabase.rpc('create_workspace_for_user', {
    p_name: name,
    p_slug: slug,
  })

  if (error) {
    redirect('/onboarding?error=Erro+ao+criar+workspace')
  }

  redirect('/dashboard')
}

export type WorkspaceActionResult = { error: string } | { success: true }

export async function createWorkspaceFromModal(
  formData: FormData
): Promise<WorkspaceActionResult> {
  const name = (formData.get('name') as string)?.trim()

  if (!name || name.length < 2) {
    return { error: 'O nome deve ter pelo menos 2 caracteres.' }
  }

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada.' }

  const slug = `${toSlug(name)}-${Date.now().toString(36)}`

  const { error } = await supabase.rpc('create_workspace_for_user', {
    p_name: name,
    p_slug: slug,
  })

  if (error) return { error: 'Erro ao criar workspace. Tente novamente.' }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateWorkspace(
  formData: FormData
): Promise<WorkspaceActionResult> {
  const name = (formData.get('name') as string)?.trim()

  if (!name || name.length < 2) {
    return { error: 'O nome deve ter pelo menos 2 caracteres.' }
  }

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada.' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrado.' }

  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (member?.role !== 'admin') {
    return { error: 'Apenas administradores podem editar o workspace.' }
  }

  const { error } = await supabase
    .from('workspaces')
    .update({ name })
    .eq('id', workspaceId)

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/', 'layout')
  revalidatePath('/settings/workspace')
  return { success: true }
}
