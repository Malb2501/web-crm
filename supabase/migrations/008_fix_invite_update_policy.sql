-- ============================================================
-- 008_fix_invite_update_policy.sql
-- Remove a policy de UPDATE aberta em workspace_invites.
-- O UPDATE de accepted_at agora é feito exclusivamente pela
-- RPC accept_workspace_invite (SECURITY DEFINER), que roda
-- com privilégio do dono e valida todas as regras internamente.
-- Usuários comuns não precisam de UPDATE direto na tabela.
-- ============================================================

drop policy if exists "workspace_invites: authenticated can update" on workspace_invites;
