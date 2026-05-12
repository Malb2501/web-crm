# PLAN.md — PipeFlow CRM

> Plano de execução por milestones — interface primeiro, backend depois.
> Cada milestone é um incremento testável e independente.

---

## Visão Geral

| # | Milestone | Branch | Foco |
|---|---|---|---|
| M1 | Setup & Fundação | `setup/foundation` | Projeto, design system, layout base |
| M2 | Landing Page | `feat/landing-page` | Página pública de marketing |
| M3 | Autenticação UI | `feat/auth-ui` | Telas de login/cadastro (mock) |
| M4 | Shell do App | `feat/app-shell` | Sidebar, layout autenticado, navegação |
| M5 | Leads UI | `feat/leads-ui` | Lista, formulário e detalhe de leads |
| M6 | Kanban UI | `feat/kanban-ui` | Pipeline drag-and-drop com dados mockados |
| M7 | Dashboard UI | `feat/dashboard-ui` | Métricas, gráfico de funil |
| M8 | Supabase & Auth real | `feat/supabase-auth` | Banco, RLS, login funcional |
| M9 | Leads & Atividades backend | `feat/leads-backend` | CRUD real de leads e atividades |
| M10 | Kanban backend | `feat/kanban-backend` | CRUD de deals, persistência do pipeline |
| M11 | Multi-workspace | `feat/workspaces` | Criação de workspaces, convites por e-mail |
| M12 | Monetização | `feat/stripe` | Stripe Checkout, webhook, planos |
| M13 | Onboarding | `feat/onboarding` | Fluxo guiado para novos usuários |
| M14 | Busca & Filtros | `feat/search-filters` | Busca global, filtros em leads/deals |
| M15 | Deploy | `feat/deploy` | Vercel + Supabase prod, variáveis, CI |

---

## M1 — Setup & Fundação

**Branch:** `setup/foundation`
**Objetivo:** Projeto Next.js funcionando com design system configurado e layout-base pronto para receber as telas.

### Entregas

- [x] Inicializar projeto com `create-next-app` (TypeScript, App Router, Tailwind)
- [x] Instalar e configurar shadcn/ui (New York style, tema customizado)
- [x] Configurar paleta de cores no `tailwind.config.ts` (`primary: #1E3A5F`, `accent: #2563EB`)
- [x] Instalar dependências: `recharts`, `@dnd-kit/core`, `@dnd-kit/sortable`, `resend`
- [x] Configurar `tsconfig.json` com path alias `@/*`
- [x] Criar `.env.example` com todas as variáveis necessárias
- [x] Criar `src/types/index.ts` com tipos globais (`Lead`, `Deal`, `Activity`, `Workspace`, `WorkspaceMember`)
- [x] Configurar fonte Inter no `layout.tsx` raiz
- [x] Verificar `npm run dev` sem erros

**Commit final:** `feat: project setup with Next.js, shadcn/ui, and design system`

---

## M2 — Landing Page

**Branch:** `feat/landing-page`
**Objetivo:** Página pública `/` apresentando o PipeFlow CRM com seções de marketing e links para login/cadastro.

### Entregas

- [x] Criar rota `src/app/(marketing)/page.tsx`
- [x] Componente `HeroSection` — headline, subtítulo, CTA "Começar grátis" e "Ver demonstração"
- [x] Componente `FeaturesSection` — 4 blocos: Pipeline Kanban, Gestão de Leads, Dashboard, Multi-empresa
- [x] Componente `PricingSection` — cards Free vs Pro com lista de benefícios e botão de CTA
- [x] Componente `FooterSection` — logo, links institucionais
- [x] Navbar pública com logo + botões "Entrar" e "Começar grátis"
- [x] Layout responsivo (mobile-first, breakpoints sm/md/lg)
- [x] Testar no browser em 360px e 1280px

**Commit final:** `feat: public landing page with hero, features, and pricing sections`

---

## M3 — Autenticação UI

**Branch:** `feat/auth-ui`
**Objetivo:** Telas de autenticação com visual completo, funcionando com mock (sem Supabase ainda).

### Entregas

- [x] Criar grupo de rotas `src/app/(auth)/`
- [x] Página `/login` — formulário e-mail + senha, link "Esqueci minha senha", link "Criar conta"
- [x] Página `/signup` — formulário nome + e-mail + senha, checkbox de termos
- [x] Página `/forgot-password` — campo e-mail + botão enviar
- [x] Layout compartilhado do grupo auth (logo centralizado, fundo com gradiente da paleta)
- [x] Componente `AuthCard` reutilizável (container branco com sombra)
- [x] Validação de formulário client-side (campos obrigatórios, formato de e-mail)
- [x] Estados de loading nos botões de submit
- [x] Testar fluxo visual completo no browser

**Commit final:** `feat: authentication screens (login, signup, forgot-password)`

---

## M4 — Shell do App

**Branch:** `feat/app-shell`
**Objetivo:** Layout autenticado completo com sidebar, navegação entre seções e placeholder de conteúdo. Rota protegida por mock de sessão.

### Entregas

- [x] Criar grupo de rotas `src/app/(dashboard)/`
- [x] Layout `src/app/(dashboard)/layout.tsx` com sidebar + área de conteúdo
- [x] Componente `Sidebar` — logo, itens de navegação (Dashboard, Pipeline, Leads), rodapé com avatar do usuário
- [x] Componente `WorkspaceSwitcher` — dropdown com nome do workspace ativo (mockado)
- [x] Componente `UserMenu` — dropdown com "Configurações" e "Sair"
- [x] Rotas placeholder: `/dashboard`, `/pipeline`, `/leads`
- [x] Navegação ativa destacada na sidebar (item selecionado)
- [x] Sidebar recolhível em mobile (hambúrguer)
- [x] Testar navegação entre seções e comportamento mobile

**Commit final:** `feat: authenticated app shell with sidebar and navigation`

---

## M5 — Leads UI

**Branch:** `feat/leads-ui`
**Objetivo:** Telas completas de gestão de leads com dados mockados, sem persistência real.

### Entregas

- [x] Página `/leads` — tabela com colunas: nome, empresa, e-mail, status, responsável, data de criação
- [x] Componente `LeadTable` com paginação (10 itens/página)
- [x] Barra de ações: botão "Novo Lead" + campo de busca funcional + filtros por status
- [x] Componente `LeadForm` em modal/sheet — campos: nome, e-mail, telefone, empresa, cargo, status
- [x] Página `/leads/[id]` — perfil completo do lead
  - [x] Seção de dados cadastrais (editar via sheet acessível pela lista)
  - [x] Seção "Negócios vinculados" (lista mockada)
  - [x] Componente `ActivityTimeline` — lista cronológica de atividades mockadas
  - [x] Formulário inline "Registrar atividade" (tipo, descrição)
- [x] Estados: empty state quando não há leads ou filtro sem resultados
- [x] Testar listagem, abertura do modal e navegação para detalhe

**Commit final:** `feat: leads management UI (list, form, detail, activity timeline)`

---

## M6 — Kanban UI

**Branch:** `feat/kanban-ui`
**Objetivo:** Pipeline Kanban visual com drag-and-drop funcional usando dados mockados.

### Entregas

- [x] Página `/pipeline` com layout horizontal de colunas
- [x] Componente `KanbanBoard` — container das 6 colunas
- [x] Componente `KanbanColumn` — cabeçalho com nome da etapa + contador + valor total
- [x] Componente `DealCard` — título, lead vinculado, valor (R$), responsável, prazo (badge colorido se vencido)
- [x] Drag-and-drop entre colunas com `@dnd-kit` (optimistic update no estado local)
- [x] Modal "Novo Negócio" — campos: título, lead vinculado, valor estimado, responsável, prazo, etapa
- [x] Modal de detalhe do negócio ao clicar no card
- [x] Colunas "Fechado Ganho" (verde) e "Fechado Perdido" (vermelho) com estilo diferenciado
- [x] Scroll horizontal em telas menores
- [x] Testar drag-and-drop entre todas as colunas

**Extras entregues:**
- Menu ⋯ em cada card (hover) com Editar, Mover para…, Marcar como Ganho/Perdido, Excluir
- Toolbar com chips de "Em pipeline" (R$) e "Ganho" (R$) atualizados em tempo real
- Design inspirado no Pipedrive: borda esquerda colorida por estágio, stagger animation nas colunas
- 18 deals mockados distribuídos nos 6 estágios

**Commit final:** `feat: M6 — Kanban Pipeline UI com drag-and-drop (#kanban-ui)`

---

## M7 — Dashboard UI

**Branch:** `feat/dashboard-ui`
**Objetivo:** Página de métricas com cards de KPI e gráfico de funil, dados mockados.

### Entregas

- [x] Página `/dashboard` com grid de métricas
- [x] Componente `MetricCard` — ícone, label, valor, variação % vs mês anterior
- [x] 4 cards: Total de Leads, Negócios Abertos, Valor do Pipeline (R$), Taxa de Conversão (%)
- [x] Componente `FunnelChart` com Recharts — barras verticais por etapa do pipeline com cores do STAGE_CONFIG
- [x] Componente `DealsTable` — tabela "Prazos Próximos" (próximos 7 dias) com link para /pipeline
- [x] Layout responsivo: cards em grid 2x2 no mobile, 4x1 no desktop
- [x] Skeleton loaders para todos os componentes
- [x] Testar renderização dos gráficos e responsividade

**Extras entregues:**
- Título de cada negócio na tabela é link clicável para `/pipeline`
- Badge ⚠️ em deals com ≤ 2 dias para o prazo
- Valores calculados a partir dos mocks reais (15 leads, R$ 202.560 pipeline, 50% conversão)
- `src/lib/mock/dashboard.ts` centraliza toda a lógica de métricas derivadas

**Commit final:** `feat: merge M7 dashboard UI into master`

---

## M8 — Supabase & Auth Real

**Branch:** `feat/supabase-auth`
**Objetivo:** Conectar autenticação real via Supabase, criar schema do banco com RLS, proteger rotas.

### Entregas

- [x] Criar projeto no Supabase e configurar variáveis de ambiente
- [x] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [x] Criar `src/lib/supabase/client.ts` (browser) e `src/lib/supabase/server.ts` (cookies)
- [ ] Migration `001_initial_schema.sql`:
  - [ ] Tabela `workspaces` (`id`, `name`, `slug`, `plan`, `created_at`)
  - [ ] Tabela `workspace_members` (`workspace_id`, `user_id`, `role`, `joined_at`)
  - [ ] Tabela `leads` (`id`, `workspace_id`, `name`, `email`, `phone`, `company`, `role`, `status`, `owner_id`, `created_at`)
  - [ ] Tabela `deals` (`id`, `workspace_id`, `lead_id`, `title`, `value`, `stage`, `owner_id`, `deadline`, `created_at`)
  - [ ] Tabela `activities` (`id`, `lead_id`, `workspace_id`, `type`, `description`, `author_id`, `created_at`)
  - [ ] Tabela `subscriptions` (`workspace_id`, `stripe_customer_id`, `stripe_subscription_id`, `plan`, `status`, `updated_at`)
- [ ] Políticas RLS em todas as tabelas (via `workspace_members`)
- [ ] Middleware Next.js para proteger rotas do grupo `(dashboard)`
- [ ] Conectar formulários de login e cadastro ao Supabase Auth
- [ ] Redirecionar após login para `/dashboard`, após logout para `/login`
- [ ] Criar workspace automaticamente no primeiro login (trigger ou Server Action)
- [ ] Testar login, logout, e proteção de rota no browser

**Commit final:** `feat: Supabase auth integration and database schema with RLS`

---

## M9 — Leads & Atividades Backend

**Branch:** `feat/leads-backend`
**Objetivo:** Substituir dados mockados de leads e atividades por dados reais do Supabase.

### Entregas

- [ ] Server Action `createLead` — insere lead com `workspace_id` do contexto
- [ ] Server Action `updateLead` — edição de dados cadastrais
- [ ] Server Action `deleteLead` — remoção com confirmação
- [ ] Server Component em `/leads` — busca lista de leads via `supabase/server.ts`
- [ ] Server Component em `/leads/[id]` — busca lead + atividades vinculadas
- [ ] Server Action `createActivity` — registra atividade vinculada ao lead
- [ ] Busca e filtros reais: parâmetros de URL (`?search=`, `?status=`, `?owner=`)
- [ ] Validação server-side com `zod` antes de persistir
- [ ] Verificação de limite do plano Free (máx. 50 leads) antes de criar
- [ ] Testar CRUD completo: criar, editar, detalhar, registrar atividade, deletar

**Commit final:** `feat: leads and activities connected to Supabase with real data`

---

## M10 — Kanban Backend

**Branch:** `feat/kanban-backend`
**Objetivo:** Substituir dados mockados do pipeline por deals reais com persistência do drag-and-drop.

### Entregas

- [ ] Server Component em `/pipeline` — busca deals agrupados por stage
- [ ] Server Action `createDeal` — cria negócio vinculado a lead e workspace
- [ ] Server Action `updateDeal` — edição de campos do negócio
- [ ] Server Action `moveDeal` — atualiza campo `stage` ao arrastar (chamado pelo client component)
- [ ] Server Action `deleteDeal` — remoção com confirmação
- [ ] Otimistic update no `KanbanBoard`: move o card localmente antes da resposta do servidor
- [ ] Revalidação de cache com `revalidatePath('/pipeline')` após cada mutação
- [ ] Testar arrastar cards entre colunas com persistência após reload

**Commit final:** `feat: kanban pipeline connected to Supabase with persistent drag-and-drop`

---

## M11 — Multi-workspace

**Branch:** `feat/workspaces`
**Objetivo:** Usuários podem criar e alternar entre workspaces, convidar colaboradores por e-mail.

### Entregas

- [ ] Página `/settings/workspace` — editar nome do workspace
- [ ] Página `/settings/members` — listar membros, alterar papel (admin/member), remover
- [ ] Fluxo "Criar novo workspace" via modal no `WorkspaceSwitcher`
- [ ] Server Action `inviteMember` — gera token de convite e envia e-mail via Resend
- [ ] Página `/invite/[token]` — aceitar convite e entrar no workspace
- [ ] `WorkspaceSwitcher` conectado: lista workspaces reais do usuário, persiste seleção em cookie
- [ ] Middleware atualiza `workspace_id` ativo no contexto ao trocar de workspace
- [ ] Verificação de limite do plano Free (máx. 2 membros) antes de convidar
- [ ] Testar: criar workspace, convidar por e-mail, aceitar convite, alternar workspaces

**Commit final:** `feat: multi-workspace with member invites and workspace switching`

---

## M12 — Monetização

**Branch:** `feat/stripe`
**Objetivo:** Planos Free e Pro funcionais com Stripe Checkout, webhook e Customer Portal.

### Entregas

- [ ] Criar produto e preço no Stripe Dashboard (R$49/mês recorrente)
- [ ] Instalar `stripe` SDK e configurar `src/lib/stripe/index.ts`
- [ ] Página `/settings/billing` — exibe plano atual, botão "Fazer upgrade" e "Gerenciar assinatura"
- [ ] Server Action `createCheckoutSession` — cria Stripe Checkout Session e redireciona
- [ ] Server Action `createPortalSession` — abre Customer Portal do Stripe
- [ ] Rota `src/app/api/webhooks/stripe/route.ts` — processa eventos:
  - [ ] `checkout.session.completed` → ativa plano Pro na tabela `subscriptions`
  - [ ] `customer.subscription.deleted` → rebaixa para Free
  - [ ] `invoice.payment_failed` → marca assinatura como inadimplente
- [ ] Página `/payment/success` e `/payment/cancel` (redirect após checkout)
- [ ] Banner de upgrade exibido quando limite Free é atingido
- [ ] Testar com Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)

**Commit final:** `feat: Stripe subscription with checkout, webhook, and customer portal`

---

## M13 — Onboarding

**Branch:** `feat/onboarding`
**Objetivo:** Fluxo guiado que orienta novos usuários na primeira utilização do CRM.

### Entregas

- [ ] Detectar usuários sem leads/deals no primeiro login (`onboarding_completed = false` em `workspaces`)
- [ ] Modal/página de boas-vindas: "Configure seu primeiro workspace"
  - [x] Step 1 — Nome do workspace (versão UI mockada entregue no M3)
  - [ ] Step 2 — Convidar colaboradores (opcional, pulável)
  - [ ] Step 3 — Criar primeiro lead guiado
- [ ] Checklist de onboarding no dashboard (dismissível) com itens:
  - [ ] Criar primeiro lead
  - [ ] Mover um negócio no pipeline
  - [ ] Registrar uma atividade
  - [ ] Convidar um colaborador
- [ ] Marcar `onboarding_completed = true` após checklist completo
- [ ] Testar fluxo completo com conta nova do zero

**Commit final:** `feat: user onboarding flow with guided steps and checklist`

---

## M14 — Busca & Filtros

**Branch:** `feat/search-filters`
**Objetivo:** Busca global e filtros avançados em leads e pipeline.

### Entregas

- [ ] Componente `GlobalSearch` na navbar — busca por leads e deals em tempo real (debounce 300ms)
- [ ] Filtros em `/leads`:
  - [ ] Por status (Novo, Em contato, Proposta, Convertido, Perdido)
  - [ ] Por responsável (dropdown de membros do workspace)
  - [ ] Por período de criação (date range picker)
- [ ] Filtros em `/pipeline`:
  - [ ] Por responsável
  - [ ] Por prazo (vencido, esta semana, este mês)
- [ ] Parâmetros de filtro na URL (compartilháveis e persistidos no reload)
- [ ] Estado "sem resultados" com CTA para limpar filtros
- [ ] Testar combinação de filtros e busca simultânea

**Commit final:** `feat: global search and advanced filters for leads and pipeline`

---

## M15 — Deploy

**Branch:** `feat/deploy`
**Objetivo:** Aplicação em produção no Vercel com banco Supabase de produção, domínio configurado e CI básico.

### Entregas

- [ ] Criar projeto no Vercel e conectar ao repositório GitHub
- [ ] Configurar todas as variáveis de ambiente de produção no Vercel Dashboard
- [ ] Configurar projeto Supabase de produção (separado do desenvolvimento)
- [ ] Rodar migrations no Supabase de produção
- [ ] Configurar domínio customizado no Vercel (se disponível)
- [ ] Atualizar URLs de callback no Supabase Auth (produção)
- [ ] Atualizar webhook URL no Stripe Dashboard (produção)
- [ ] Testar fluxo completo em produção: cadastro → workspace → lead → pipeline → upgrade
- [ ] Configurar GitHub Action para deploy automático no merge para `main`
- [ ] Verificar HTTPS, headers de segurança e ausência de erros no console

**Commit final:** `feat: production deployment on Vercel with CI and environment config`

---

## Ordem de Prioridade

```
M1 Setup → M2 Landing → M3 Auth UI → M4 Shell → M5 Leads UI → M6 Kanban UI
→ M7 Dashboard UI → M8 Supabase Auth → M9 Leads Backend → M10 Kanban Backend
→ M11 Workspaces → M12 Stripe → M13 Onboarding → M14 Busca → M15 Deploy
```

> **Regra:** Nenhum milestone começa antes do anterior ser testado e aprovado.
> Interface mockada primeiro — valida UX sem depender de infraestrutura.
> Backend entra a partir do M8, conectando as telas já prontas a dados reais.
