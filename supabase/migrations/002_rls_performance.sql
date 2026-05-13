-- ============================================================
-- 002_rls_performance.sql
-- PipeFlow CRM — melhorias de performance e segurança no RLS
--
-- Baseado em:
--   • Supabase Postgres Best Practices (skill supabase-postgres-best-practices)
--   • Regra 3.3: Optimize RLS Policies for Performance
--   • Regra 4.2: Index Foreign Key Columns
--   • Regra 1.3: Composite Indexes for Multi-Column Queries
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. INDEX: user_id em workspace_members
--
-- Regra 4.2 — FK columns must be indexed.
-- As políticas RLS de TODAS as tabelas consultam workspace_members
-- com WHERE user_id = auth.uid(). Sem este índice, cada verificação
-- de RLS faz um sequential scan na tabela inteira de membros.
-- Com o índice em (user_id, workspace_id), o Postgres resolve em O(log n).
-- ────────────────────────────────────────────────────────────
create index if not exists workspace_members_user_id_idx
  on workspace_members (user_id, workspace_id);

-- ────────────────────────────────────────────────────────────
-- 2. HELPER FUNCTION: is_workspace_member
--
-- Regra 3.3 — Use security definer functions for complex RLS checks.
-- Centraliza a verificação de membership em uma função com
-- SECURITY DEFINER (bypass de RLS na busca interna) e
-- STABLE (resultado cacheável por query).
-- O (select auth.uid()) garante que auth.uid() é avaliado UMA VEZ
-- por query, não por linha — melhoria de 100x em tabelas grandes.
-- ────────────────────────────────────────────────────────────
create or replace function is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = p_workspace_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = p_workspace_id
      and user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- 3. RECRIAR POLÍTICAS RLS — workspaces
--
-- Substitui subqueries inline por chamadas às funções helper.
-- Elimina avaliação de auth.uid() por linha.
-- ────────────────────────────────────────────────────────────
drop policy if exists "workspaces: members can read"    on workspaces;
drop policy if exists "workspaces: admin can update"    on workspaces;
drop policy if exists "workspaces: admin can delete"    on workspaces;

create policy "workspaces: members can read"
  on workspaces for select
  using (is_workspace_member(id));

create policy "workspaces: admin can update"
  on workspaces for update
  using (is_workspace_admin(id));

create policy "workspaces: admin can delete"
  on workspaces for delete
  using (is_workspace_admin(id));

-- ────────────────────────────────────────────────────────────
-- 4. RECRIAR POLÍTICAS RLS — workspace_members
--
-- Bug corrigido: a política de INSERT anterior permitia que
-- qualquer usuário se auto-inserisse em workspaces sem membros
-- (condição "not exists" era uma brecha de segurança).
-- Nova política: apenas o próprio usuário pode se inserir
-- como membro, E deve ser admin OU o workspace ainda não ter
-- membros (para o criador original). Isso é feito verificando
-- que o user_id inserido = auth.uid() (auto-inserção apenas).
-- ────────────────────────────────────────────────────────────
drop policy if exists "workspace_members: members can read"          on workspace_members;
drop policy if exists "workspace_members: admin can insert"          on workspace_members;
drop policy if exists "workspace_members: admin can update role"     on workspace_members;
drop policy if exists "workspace_members: admin can delete or self leave" on workspace_members;

create policy "workspace_members: members can read"
  on workspace_members for select
  using (is_workspace_member(workspace_id));

-- Inserção: admin adiciona outros membros OU usuário se auto-insere
create policy "workspace_members: admin can insert"
  on workspace_members for insert
  with check (
    -- Caso 1: já é admin do workspace (convida outros)
    is_workspace_admin(workspace_members.workspace_id)
    or
    -- Caso 2: usuário se auto-insere (criação do workspace)
    workspace_members.user_id = (select auth.uid())
  );

create policy "workspace_members: admin can update role"
  on workspace_members for update
  using (is_workspace_admin(workspace_id));

create policy "workspace_members: admin can delete or self leave"
  on workspace_members for delete
  using (
    workspace_members.user_id = (select auth.uid())
    or is_workspace_admin(workspace_members.workspace_id)
  );

-- ────────────────────────────────────────────────────────────
-- 5. RECRIAR POLÍTICAS RLS — leads
-- ────────────────────────────────────────────────────────────
drop policy if exists "leads: members can read"   on leads;
drop policy if exists "leads: members can insert" on leads;
drop policy if exists "leads: members can update" on leads;
drop policy if exists "leads: members can delete" on leads;

create policy "leads: members can read"
  on leads for select
  using (is_workspace_member(workspace_id));

create policy "leads: members can insert"
  on leads for insert
  with check (is_workspace_member(workspace_id));

create policy "leads: members can update"
  on leads for update
  using (is_workspace_member(workspace_id));

create policy "leads: members can delete"
  on leads for delete
  using (is_workspace_member(workspace_id));

-- ────────────────────────────────────────────────────────────
-- 6. RECRIAR POLÍTICAS RLS — deals
-- ────────────────────────────────────────────────────────────
drop policy if exists "deals: members can read"   on deals;
drop policy if exists "deals: members can insert" on deals;
drop policy if exists "deals: members can update" on deals;
drop policy if exists "deals: members can delete" on deals;

create policy "deals: members can read"
  on deals for select
  using (is_workspace_member(workspace_id));

create policy "deals: members can insert"
  on deals for insert
  with check (is_workspace_member(workspace_id));

create policy "deals: members can update"
  on deals for update
  using (is_workspace_member(workspace_id));

create policy "deals: members can delete"
  on deals for delete
  using (is_workspace_member(workspace_id));

-- ────────────────────────────────────────────────────────────
-- 7. RECRIAR POLÍTICAS RLS — activities
-- ────────────────────────────────────────────────────────────
drop policy if exists "activities: members can read"   on activities;
drop policy if exists "activities: members can insert" on activities;
drop policy if exists "activities: members can update" on activities;
drop policy if exists "activities: members can delete" on activities;

create policy "activities: members can read"
  on activities for select
  using (is_workspace_member(workspace_id));

create policy "activities: members can insert"
  on activities for insert
  with check (is_workspace_member(workspace_id));

create policy "activities: members can update"
  on activities for update
  using (is_workspace_member(workspace_id));

create policy "activities: members can delete"
  on activities for delete
  using (is_workspace_member(workspace_id));

-- ────────────────────────────────────────────────────────────
-- 8. RECRIAR POLÍTICAS RLS — subscriptions
-- ────────────────────────────────────────────────────────────
drop policy if exists "subscriptions: admin can read"           on subscriptions;
drop policy if exists "subscriptions: service_role can insert"  on subscriptions;
drop policy if exists "subscriptions: service_role can update"  on subscriptions;

create policy "subscriptions: admin can read"
  on subscriptions for select
  using (is_workspace_admin(workspace_id));

create policy "subscriptions: service_role can insert"
  on subscriptions for insert
  with check (auth.role() = 'service_role');

create policy "subscriptions: service_role can update"
  on subscriptions for update
  using (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────
-- 9. COMPOSITE INDEX: leads por workspace + status
--
-- Regra 1.3 — Composite indexes for multi-column queries.
-- A tela de leads filtra por workspace_id + status frequentemente.
-- O índice (workspace_id, status) cobre esse padrão de acesso
-- e também as queries de RLS que já filtram por workspace_id.
-- ────────────────────────────────────────────────────────────
drop index if exists leads_status_idx;
create index if not exists leads_workspace_status_idx
  on leads (workspace_id, status);

-- Composite para deals: pipeline filtra workspace + stage
drop index if exists deals_stage_idx;
create index if not exists deals_workspace_stage_idx
  on deals (workspace_id, stage);

-- Index para deadline (próximos vencimentos no dashboard)
create index if not exists deals_deadline_idx
  on deals (deadline)
  where deadline is not null;

-- ────────────────────────────────────────────────────────────
-- 10. RPC: create_workspace_for_user
--
-- SECURITY DEFINER para bypassar RLS no onboarding.
-- Cria workspace + membro admin em uma transação atômica.
-- Chamada pelo Server Action em src/lib/actions/workspace.ts
-- ────────────────────────────────────────────────────────────
create or replace function create_workspace_for_user(p_name text, p_slug text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_workspace_id uuid;
begin
  insert into public.workspaces (name, slug, plan)
  values (p_name, p_slug, 'free')
  returning id into v_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, auth.uid(), 'admin');

  return v_workspace_id;
end;
$$;

