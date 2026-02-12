# BetTracker

> Plataforma profissional de análise de transações de apostas desportivas

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 Funcionalidades

- **Dashboard** — 9 KPIs com resultado líquido, ROI, win rate e tendências
- **5 Tipos de Gráficos** — Balanço cumulativo, resultados mensais, distribuição, histograma, MoM
- **Insights Automáticos** — Análise de performance, padrões e recomendações
- **Multi-Perfil** — Gere múltiplas contas, visão combinada, comparação lado a lado
- **Upload CSV** — Suporte multi-formato com deteção automática e resolução de conflitos
- **Exportação** — PDF, PNG, CSV e exportação individual de gráficos
- **Tema Claro/Escuro** — Design premium dark-first
- **Autenticação** — Login, registo, recuperação de password
- **Responsivo** — Desktop, tablet e mobile

## 📦 Estrutura

```
bet-tracker/
├── apps/
│   ├── web/              # Next.js 15 (App Router)
│   └── mobile/           # React Native + Expo (futuro)
├── packages/
│   ├── core/             # Lógica partilhada (cálculos, parsers, tipos)
│   ├── config/           # Configurações TypeScript, ESLint
│   └── ui/               # Design system tokens (futuro)
├── supabase/             # Migrations e Edge Functions
└── turbo.json            # Turborepo pipeline
```

## 🛠 Setup

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Conta Supabase

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/your-username/bet-tracker.git
cd bet-tracker

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example apps/web/.env.local
# Editar com as tuas credenciais Supabase

# Aplicar migration na Supabase
# (copiar conteúdo de supabase/migrations/00001_initial_schema.sql para o SQL Editor)

# Iniciar em desenvolvimento
pnpm dev
```

### Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 🏗 Stack

| Camada | Tecnologia |
|---|---|
| Web | Next.js 15, React 19, Tailwind v4 |
| Estado | Zustand, TanStack Query v5 |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| Gráficos | Recharts |
| Validação | Zod |
| Monorepo | Turborepo, pnpm workspaces |
| Testes | Vitest, React Testing Library |

## 📝 Licença

MIT
