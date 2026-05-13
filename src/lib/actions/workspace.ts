'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { InsertDTO } from '@/types/supabase'

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

  const baseSlug = toSlug(name)
  const slug = `${baseSlug}-${Date.now().toString(36)}`

  const wsInsert: InsertDTO<'workspaces'> = { name, slug, plan: 'free' }
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert(wsInsert)
    .select('id')
    .single()

  if (wsError || !workspace) {
    redirect('/onboarding?error=Erro+ao+criar+workspace')
  }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: user.id, role: 'admin' })

  if (memberError) {
    redirect('/onboarding?error=Erro+ao+configurar+workspace')
  }

  redirect('/dashboard')
}
