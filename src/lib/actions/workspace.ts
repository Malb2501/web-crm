'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'

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
