'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getOccupiedSlots } from '@/lib/data/members'
import { sendInviteEmail } from '@/lib/resend'

const FREE_MEMBER_LIMIT = 2

export type ActionResult = { error: string } | { success: true }

export async function inviteMember(formData: FormData): Promise<ActionResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const role = (formData.get('role') as string) === 'admin' ? 'admin' : 'member'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'E-mail inválido.' }
  }

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada. Faça login novamente.' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrado.' }

  const { data: currentMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (currentMember?.role !== 'admin') {
    return { error: 'Apenas administradores podem convidar membros.' }
  }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) return { error: 'Workspace não encontrado.' }

  // Bug 1 fix: conta membros + convites pendentes juntos
  if (workspace.plan === 'free') {
    const occupied = await getOccupiedSlots(workspaceId)
    if (occupied >= FREE_MEMBER_LIMIT) {
      return {
        error: `O plano Free permite no máximo ${FREE_MEMBER_LIMIT} membros. Faça upgrade para o plano Pro para convidar mais colaboradores.`,
      }
    }
  }

  const { data: existingInvite } = await supabase
    .from('workspace_invites')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('email', email)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (existingInvite) {
    return { error: 'Já existe um convite pendente para este e-mail.' }
  }

  const { data: invite, error: inviteError } = await supabase
    .from('workspace_invites')
    .insert({ workspace_id: workspaceId, email, role, invited_by: user.id })
    .select('token')
    .single()

  if (inviteError || !invite) {
    return { error: 'Erro ao criar convite. Tente novamente.' }
  }

  const inviterName = user.user_metadata?.full_name ?? user.email ?? 'Alguém'

  // Bug 7 fix: sendInviteEmail retorna Promise<{ data, error }> do Resend SDK
  const { error: emailError } = await sendInviteEmail({
    to: email,
    inviterName,
    workspaceName: workspace.name,
    token: invite.token,
  })

  if (emailError) {
    await supabase.from('workspace_invites').delete().eq('token', invite.token)
    return { error: 'Erro ao enviar e-mail de convite. Verifique as configurações do Resend.' }
  }

  revalidatePath('/settings/members')
  return { success: true }
}

export async function cancelInvite(inviteId: string): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada.' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrado.' }

  const { error } = await supabase
    .from('workspace_invites')
    .delete()
    .eq('id', inviteId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: 'Erro ao cancelar convite.' }

  revalidatePath('/settings/members')
  return { success: true }
}

async function countAdmins(supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>, workspaceId: string): Promise<number> {
  const { count } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('role', 'admin')
  return count ?? 0
}

export async function updateMemberRole(
  targetUserId: string,
  newRole: 'admin' | 'member'
): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada.' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrado.' }

  if (user.id === targetUserId) {
    return { error: 'Você não pode alterar seu próprio papel.' }
  }

  // Bug 6 fix: impede rebaixar o único admin
  if (newRole === 'member') {
    const adminCount = await countAdmins(supabase, workspaceId)
    if (adminCount <= 1) {
      return { error: 'O workspace precisa ter pelo menos um administrador.' }
    }
  }

  const { error } = await supabase
    .from('workspace_members')
    .update({ role: newRole })
    .eq('workspace_id', workspaceId)
    .eq('user_id', targetUserId)

  if (error) return { error: 'Erro ao atualizar papel do membro.' }

  revalidatePath('/settings/members')
  return { success: true }
}

export async function removeMember(targetUserId: string): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada.' }

  const workspaceId = await getActiveWorkspaceId()
  if (!workspaceId) return { error: 'Workspace não encontrado.' }

  if (user.id === targetUserId) {
    return { error: 'Use a opção "Sair do workspace" para se remover.' }
  }

  // Bug 5 fix: impede remover o único admin
  const { data: targetMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', targetUserId)
    .maybeSingle()

  if (targetMember?.role === 'admin') {
    const adminCount = await countAdmins(supabase, workspaceId)
    if (adminCount <= 1) {
      return { error: 'Não é possível remover o único administrador do workspace.' }
    }
  }

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', targetUserId)

  if (error) return { error: 'Erro ao remover membro.' }

  revalidatePath('/settings/members')
  return { success: true }
}

// Bug 2 fix: usa RPC accept_workspace_invite (SECURITY DEFINER) para contornar RLS
// Bug 4 fix: faz switchWorkspace após aceite bem-sucedido
export async function acceptInvite(token: string): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Você precisa estar logado para aceitar este convite.' }

  const { data, error } = await supabase.rpc('accept_workspace_invite', { p_token: token })

  if (error) return { error: 'Erro ao processar convite. Tente novamente.' }

  const result = data as { error?: string; success?: boolean; workspace_id?: string }

  if (result.error) return { error: result.error }

  // Bug 4 fix: ativa o workspace recém-aceito
  if (result.workspace_id) {
    await supabase.auth.updateUser({
      data: { active_workspace_id: result.workspace_id },
    })
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function switchWorkspace(workspaceId: string): Promise<ActionResult> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada.' }

  const { data: member } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) return { error: 'Você não tem acesso a este workspace.' }

  await supabase.auth.updateUser({
    data: { active_workspace_id: workspaceId },
  })

  revalidatePath('/', 'layout')
  return { success: true }
}
