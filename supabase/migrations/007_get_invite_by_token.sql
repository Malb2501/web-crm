-- ============================================================
-- 007_get_invite_by_token.sql
-- RPC pública para validar token de convite antes do login
-- Expõe apenas email, workspace_name e status — sem dados sensíveis
-- ============================================================

create or replace function get_invite_by_token(p_token text)
returns jsonb
language sql
security definer
stable
as $$
  select jsonb_build_object(
    'email',          wi.email,
    'workspace_name', w.name,
    'accepted',       wi.accepted_at is not null,
    'expired',        wi.expires_at < now()
  )
  from workspace_invites wi
  join workspaces w on w.id = wi.workspace_id
  where wi.token = p_token
  limit 1;
$$;

-- Acessível por qualquer pessoa (incluindo não autenticados) para exibir a tela de convite
grant execute on function get_invite_by_token(text) to anon, authenticated;
