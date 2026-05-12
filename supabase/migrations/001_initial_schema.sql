-- ============================================================
-- 001_initial_schema.sql
-- PipeFlow CRM — schema inicial com RLS
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- EXTENSÕES
-- ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- ENUMS
-- ────────────────────────────────────────────────────────────
create type workspace_plan as enum ('free', 'pro');
create type workspace_role as enum ('admin', 'member');
create type lead_status    as enum ('new', 'contacted', 'proposal', 'converted', 'lost');
create type deal_stage     as enum ('new_lead', 'contacted', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost');
create type activity_type  as enum ('call', 'email', 'meeting', 'note');
create type subscription_status as enum ('active', 'past_due', 'canceled', 'trialing');

-- ────────────────────────────────────────────────────────────
-- TABELA: workspaces
-- ────────────────────────────────────────────────────────────
create table workspaces (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text not null unique,
  plan                 workspace_plan not null default 'free',
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now()
);

alter table workspaces enable row level security;

-- Leitura: membro do workspace
create policy "workspaces: members can read"
  on workspaces for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspaces.id
        and workspace_members.user_id = auth.uid()
    )
  );

-- Inserção: qualquer usuário autenticado cria seu workspace
create policy "workspaces: authenticated users can create"
  on workspaces for insert
  with check (auth.uid() is not null);

-- Atualização: apenas admin do workspace
create policy "workspaces: admin can update"
  on workspaces for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspaces.id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- Exclusão: apenas admin do workspace
create policy "workspaces: admin can delete"
  on workspaces for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = workspaces.id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────
-- TABELA: workspace_members
-- ────────────────────────────────────────────────────────────
create table workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         workspace_role not null default 'member',
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

alter table workspace_members enable row level security;

-- Leitura: qualquer membro do workspace enxerga os outros membros
create policy "workspace_members: members can read"
  on workspace_members for select
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
    )
  );

-- Inserção: admin do workspace adiciona membros
create policy "workspace_members: admin can insert"
  on workspace_members for insert
  with check (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
    -- Permite também auto-inserção (primeiro admin ao criar workspace)
    or not exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
    )
  );

-- Atualização de papel: apenas admin
create policy "workspace_members: admin can update role"
  on workspace_members for update
  using (
    exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- Exclusão: admin remove membros ou o próprio usuário sai
create policy "workspace_members: admin can delete or self leave"
  on workspace_members for delete
  using (
    workspace_members.user_id = auth.uid()
    or exists (
      select 1 from workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────
-- TABELA: leads
-- ────────────────────────────────────────────────────────────
create table leads (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name         text not null,
  email        text,
  phone        text,
  company      text,
  job_title    text,
  status       lead_status not null default 'new',
  owner_id     uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index leads_workspace_id_idx on leads(workspace_id);
create index leads_owner_id_idx     on leads(owner_id);
create index leads_status_idx       on leads(status);

alter table leads enable row level security;

create policy "leads: members can read"
  on leads for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = leads.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "leads: members can insert"
  on leads for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = leads.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "leads: members can update"
  on leads for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = leads.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "leads: members can delete"
  on leads for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = leads.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- TABELA: deals
-- ────────────────────────────────────────────────────────────
create table deals (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  lead_id      uuid references leads(id) on delete set null,
  title        text not null,
  value        numeric(12, 2) not null default 0,
  stage        deal_stage not null default 'new_lead',
  owner_id     uuid references auth.users(id) on delete set null,
  deadline     date,
  created_at   timestamptz not null default now()
);

create index deals_workspace_id_idx on deals(workspace_id);
create index deals_lead_id_idx      on deals(lead_id);
create index deals_stage_idx        on deals(stage);
create index deals_owner_id_idx     on deals(owner_id);

alter table deals enable row level security;

create policy "deals: members can read"
  on deals for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "deals: members can insert"
  on deals for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "deals: members can update"
  on deals for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "deals: members can delete"
  on deals for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = deals.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- TABELA: activities
-- ────────────────────────────────────────────────────────────
create table activities (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references leads(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  type         activity_type not null,
  description  text not null,
  author_id    uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index activities_lead_id_idx      on activities(lead_id);
create index activities_workspace_id_idx on activities(workspace_id);
create index activities_author_id_idx    on activities(author_id);

alter table activities enable row level security;

create policy "activities: members can read"
  on activities for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = activities.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "activities: members can insert"
  on activities for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = activities.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "activities: members can update"
  on activities for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = activities.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

create policy "activities: members can delete"
  on activities for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = activities.workspace_id
        and workspace_members.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- TABELA: subscriptions
-- ────────────────────────────────────────────────────────────
create table subscriptions (
  workspace_id             uuid primary key references workspaces(id) on delete cascade,
  stripe_customer_id       text unique,
  stripe_subscription_id   text unique,
  plan                     workspace_plan not null default 'free',
  status                   subscription_status not null default 'active',
  updated_at               timestamptz not null default now()
);

alter table subscriptions enable row level security;

-- Leitura: apenas admin do workspace
create policy "subscriptions: admin can read"
  on subscriptions for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = subscriptions.workspace_id
        and workspace_members.user_id = auth.uid()
        and workspace_members.role = 'admin'
    )
  );

-- Inserção e atualização: apenas service_role (webhook Stripe)
-- Usuários normais não manipulam assinaturas diretamente
create policy "subscriptions: service_role can insert"
  on subscriptions for insert
  with check (auth.role() = 'service_role');

create policy "subscriptions: service_role can update"
  on subscriptions for update
  using (auth.role() = 'service_role');

-- ────────────────────────────────────────────────────────────
-- TRIGGER: cria subscription free ao criar workspace
-- ────────────────────────────────────────────────────────────
create or replace function create_default_subscription()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into subscriptions (workspace_id, plan, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

create trigger on_workspace_created
  after insert on workspaces
  for each row execute function create_default_subscription();
