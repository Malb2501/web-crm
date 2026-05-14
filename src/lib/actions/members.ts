'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspaceId } from '@/lib/data/workspaces'
import { getMemberCount } from '@/lib/data/members'
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

  // Verificar papel do usuário atual
  const { data: currentMember } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (currentMember?.role !== 'admin') {
    return { error: 'Apenas administradores podem convidar membros.' }
  }

  // Buscar dados do workspace (nome + plano)
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name, plan')
    .eq('id', workspaceId)
    .single()

  if (!workspace) return { error: 'Workspace não encontrado.' }

  // Verificar limite do plano Free
  if (workspace.plan === 'free') {
    const memberCount = await getMemberCount(workspaceId)
    if (memberCount >= FREE_MEMBER_LIMIT) {
      return {
        error: `O plano Free permite no máximo ${FREE_MEMBER_LIMIT} membros. Faça upgrade para o plano Pro para convidar mais colaboradores.`,
      }
    }
  }

  // Verificar se já é membro (via auth.users lookup pelo email)
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

  // Criar convite
  const { data: invite, error: inviteError } = await supabase
    .from('workspace_invites')
    .insert({
      workspace_id: workspaceId,
      email,
      role,
      invited_by: user.id,
    })
    .select('token')
    .single()

  if (inviteError || !invite) {
    return { error: 'Erro ao criar convite. Tente novamente.' }
  }

  // Enviar e-mail
  const inviterName = user.user_metadata?.full_name ?? user.email ?? 'Alguém'
  const { error: emailError } = await sendInviteEmail({
    to: email,
    inviterName,
    workspaceName: workspace.name,
    token: invite.token,
  })

  if (emailError) {
    // Desfaz o convite se o e-mail falhar
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

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', targetUserId)

  if (error) return { error: 'Erro ao remover membro.' }

  revalidatePath('/settings/members')
  return { success: true }
}

export async function acceptInvite(token: string): Promise<ActionResult & { workspaceId?: string }> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Você precisa estar logado para aceitar este convite.' }

  const { data: invite } = await supabase
    .from('workspace_invites')
    .select('id, workspace_id, email, role, accepted_at, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (!invite) return { error: 'Convite inválido ou não encontrado.' }
  if (invite.accepted_at) return { error: 'Este convite já foi utilizado.' }
  if (new Date(invite.expires_at) < new Date()) return { error: 'Este convite expirou.' }

  // Verificar se já é membro
  const { data: existing } = await supabase
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', invite.workspace_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!existing) {
    // Verificar limite Free antes de inserir
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('plan')
      .eq('id', invite.workspace_id)
      .single()

    if (workspace?.plan === 'free') {
      const memberCount = await getMemberCount(invite.workspace_id)
      if (memberCount >= FREE_MEMBER_LIMIT) {
        return { error: 'O workspace atingiu o limite de membros do plano Free.' }
      }
    }

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: invite.workspace_id,
        user_id: user.id,
        role: invite.role,
      })

    if (memberError) return { error: 'Erro ao entrar no workspace.' }
  }

  // Marcar convite como aceito
  await supabase
    .from('workspace_invites')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id)

  return { success: true, workspaceId: invite.workspace_id }
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

  // Persiste workspace ativo em cookie via Supabase session metadata
  // Usamos update de metadata do usuário para armazenar a preferência
  await supabase.auth.updateUser({
    data: { active_workspace_id: workspaceId },
  })

  revalidatePath('/', 'layout')
  return { success: true }
}
