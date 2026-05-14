-- ============================================================
-- 004_workspace_invites.sql
-- PipeFlow CRM — tabela de convites de workspace
-- ============================================================

create table workspace_invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email        text not null,
  role         workspace_role not null default 'member',
  token        text not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by   uuid references auth.users(id) on delete set null,
  accepted_at  timestamptz,
  expires_at   timestamptz not null default (now() + interval '7 days'),
  created_at   timestamptz not null default now()
);

create index workspace_invites_workspace_id_idx on workspace_invites(workspace_id);
create index workspace_invites_token_idx        on workspace_invites(token);
create index workspace_invites_email_idx        on workspace_invites(email);

alter table workspace_invites enable row level security;

-- Leitura: admin do workspace enxerga convites pendentes
create policy "workspace_invites: admin can read"
  on workspace_invites for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_invites.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- Inserção: admin do workspace cria convites
create policy "workspace_invites: admin can insert"
  on workspace_invites for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_invites.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- Atualização: qualquer autenticado pode aceitar (marcar accepted_at) pelo token
-- A lógica de segurança fica na Server Action (valida token + expiração)
create policy "workspace_invites: authenticated can update"
  on workspace_invites for update
  using (auth.uid() is not null);

-- Exclusão: admin pode cancelar convites
create policy "workspace_invites: admin can delete"
  on workspace_invites for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspace_invites.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );
