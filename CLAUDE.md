# CLAUDE.md — PipeFlow CRM

Documentação de referência do projeto para desenvolvimento assistido por IA.

---

## O que é este projeto

**PipeFlow CRM** é uma plataforma web SaaS multi-empresa de gestão de clientes e vendas. Inclui pipeline Kanban com drag-and-drop, cadastro de leads/contatos, registro de atividades, dashboard de métricas, sistema de workspaces com controle de acesso e monetização via Stripe.

PRD completo: [docs/PRD.md](docs/PRD.md)

---

## Como rodar o projeto

```bash
npm install
npm run dev       # http://localhost:3000
```

Variáveis de ambiente necessárias: `.env.local` (ver `.env.example`)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 — App Router |
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Linguagem | TypeScript 5 (strict) |
| Banco / Auth | Supabase (PostgreSQL + RLS + Auth) |
| Pagamento | Stripe (Checkout + Webhooks + Customer Portal) |
| E-mail | Resend |
| Drag-and-drop | @dnd-kit |
| Gráficos | Recharts |
| Deploy | Vercel + Supabase (free tier) |

---

## Estrutura de Pastas

```
pipeflow-crm/
├── docs/
│   └── PRD.md
├── src/
│   ├── app/
│   │   ├── (auth)/             ← login, cadastro, recuperação de senha
│   │   ├── (dashboard)/        ← app autenticado
│   │   │   ├── pipeline/       ← Kanban de vendas
│   │   │   ├── leads/          ← lista e detalhe de leads
│   │   │   └── dashboard/      ← métricas e funil
│   │   ├── api/
│   │   │   └── webhooks/
│   │   │       └── stripe/     ← webhook Stripe
│   │   └── (marketing)/        ← landing page pública
│   ├── components/
│   │   ├── ui/                 ← componentes base shadcn/ui
│   │   ├── kanban/             ← Board, Column, Card, DragOverlay
│   │   ├── leads/              ← LeadForm, LeadTable, ActivityTimeline
│   │   └── dashboard/          ← MetricCard, FunnelChart, DealsTable
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       ← Supabase browser client
│   │   │   └── server.ts       ← Supabase server client (cookies)
│   │   ├── stripe/
│   │   │   └── index.ts        ← Stripe helpers
│   │   └── resend/
│   │       └── index.ts        ← helpers de e-mail
│   └── types/
│       └── index.ts            ← tipos globais TypeScript
├── supabase/
│   └── migrations/             ← SQL migrations versionadas
├── public/
├── CLAUDE.md
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Convenções de Código

- **TypeScript strict** em todos os arquivos — sem `any`
- **Server Components por padrão**; adicionar `"use client"` apenas quando necessário (interatividade, hooks, eventos)
- Funções e variáveis em **camelCase** (inglês): `fetchLeads`, `workspaceId`
- Componentes React em **PascalCase**: `LeadCard`, `KanbanBoard`
- Nenhum comentário desnecessário — nomes descritivos já documentam
- Imports absolutos via `@/` (configurado no tsconfig)
- Sem `console.log` em produção

---

## Banco de Dados (Supabase)

### Tabelas principais

| Tabela | Descrição |
|---|---|
| `workspaces` | Empresas/times cadastrados |
| `workspace_members` | Relação usuário ↔ workspace (role: admin/member) |
| `leads` | Contatos/clientes cadastrados |
| `deals` | Negócios vinculados a leads (pipeline) |
| `activities` | Histórico de interações (ligação, e-mail, reunião, nota) |
| `subscriptions` | Status da assinatura Stripe por workspace |

### Regras de ouro

- **RLS em todas as tabelas** — isolamento por `workspace_id`
- Políticas RLS verificam `workspace_members` antes de qualquer acesso
- Migrations versionadas em `supabase/migrations/` — nunca alterar o banco manualmente em produção
- Usar `supabase/server.ts` em Server Components e API Routes; `supabase/client.ts` em Client Components

---

## Autenticação e Multi-workspace

- Auth via Supabase (e-mail/senha + magic link)
- Cada usuário pode pertencer a múltiplos workspaces
- `workspace_id` ativo fica armazenado no contexto de sessão / cookie
- Papéis: `admin` (acesso total) e `member` (leads e negócios apenas)
- Convite de colaboradores envia e-mail via Resend com link tokenizado

---

## Monetização

| Plano | Limite | Preço |
|---|---|---|
| Free | 2 colaboradores, 50 leads | Gratuito |
| Pro | Ilimitado | R$49/mês |

- Checkout via Stripe Checkout Session
- Webhook `/api/webhooks/stripe` atualiza tabela `subscriptions`
- Customer Portal do Stripe para cancelamento/upgrade
- Limites verificados no servidor antes de criar lead/convidar membro

---

## Pipeline Kanban — Etapas

1. Novo Lead
2. Contato Realizado
3. Proposta Enviada
4. Negociação
5. Fechado Ganho
6. Fechado Perdido

Drag-and-drop implementado com `@dnd-kit`. Cada movimento persiste imediatamente via Supabase (optimistic update no cliente).

---

## Identidade Visual

- **Inspiração:** HubSpot CRM + Pipedrive
- **Paleta principal:** azul profundo `#1E3A5F`, branco `#FFFFFF`, cinza claro `#F4F6F8`
- **Acento:** azul elétrico `#2563EB` (ações primárias)
- **Sucesso/Ganho:** verde `#16A34A` | **Perda:** vermelho `#DC2626`
- **Tipografia:** Inter (Google Fonts)
- **Componentes:** shadcn/ui com tema customizado (New York style)
- **Layout:** sidebar fixa à esquerda + área de conteúdo à direita

---

## O que NÃO fazer neste projeto

- Não usar Pages Router do Next.js — apenas App Router
- Não adicionar frameworks CSS além de Tailwind
- Não usar outros provedores de Auth além do Supabase
- Não expor chaves Stripe/Supabase no cliente — apenas variáveis `NEXT_PUBLIC_*` quando necessário
- Não criar lógica de negócio em Client Components — manter no servidor
- Não adicionar funcionalidades fora do escopo do PRD sem aprovação

---

## Preferências do Usuário

- Comunicação sempre em **português brasileiro**
- Usuário é empreendedor não técnico — explicar decisões de forma didática
- Priorizar clareza e funcionalidade acima de otimizações prematuras
- Cada milestone deve ser testável de forma independente antes de avançar
