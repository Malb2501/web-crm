-- ============================================================
-- 006_accept_invite_rpc.sql
-- RPC segura para aceitar convite de workspace
-- Necessária porque o usuário convidado ainda não é membro,
-- então a RLS de INSERT em workspace_members bloqueia a inserção direta.
-- A função roda com SECURITY DEFINER (privilégio do dono) mas
-- valida token, expiração e limites antes de qualquer escrita.
-- ============================================================

create or replace function accept_workspace_invite(p_token text)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_invite  record;
  v_count   int;
  v_plan    text;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return jsonb_build_object('error', 'Você precisa estar logado para aceitar este convite.');
  end if;

  -- Buscar convite pelo token
  select * into v_invite
  from workspace_invites
  where token = p_token;

  if not found then
    return jsonb_build_object('error', 'Convite inválido ou não encontrado.');
  end if;

  if v_invite.accepted_at is not null then
    return jsonb_build_object('error', 'Este convite já foi utilizado.');
  end if;

  if v_invite.expires_at < now() then
    return jsonb_build_object('error', 'Este convite expirou.');
  end if;

  -- Verificar se já é membro
  if exists (
    select 1 from workspace_members
    where workspace_id = v_invite.workspace_id
      and user_id = v_user_id
  ) then
    -- Já é membro: apenas marca o convite como aceito
    update workspace_invites
    set accepted_at = now()
    where id = v_invite.id;

    return jsonb_build_object('success', true, 'workspace_id', v_invite.workspace_id);
  end if;

  -- Verificar limite do plano Free
  select w.plan into v_plan
  from workspaces w
  where w.id = v_invite.workspace_id;

  if v_plan = 'free' then
    select count(*) into v_count
    from workspace_members
    where workspace_id = v_invite.workspace_id;

    if v_count >= 2 then
      return jsonb_build_object('error', 'O workspace atingiu o limite de membros do plano Free.');
    end if;
  end if;

  -- Inserir membro
  insert into workspace_members (workspace_id, user_id, role)
  values (v_invite.workspace_id, v_user_id, v_invite.role);

  -- Marcar convite como aceito
  update workspace_invites
  set accepted_at = now()
  where id = v_invite.id;

  return jsonb_build_object('success', true, 'workspace_id', v_invite.workspace_id);
end;
$$;

-- Apenas usuários autenticados podem chamar
revoke all on function accept_workspace_invite(text) from public;
grant execute on function accept_workspace_invite(text) to authenticated;
