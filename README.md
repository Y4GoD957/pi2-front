# EduCenso Frontend

Frontend da plataforma EduCenso, construído com React, TypeScript, Vite, Tailwind CSS e shadcn/ui.

O objetivo do projeto é servir como base para uma plataforma de análise de dados educacionais e socioeconômicos, com foco em dashboards, comparativos entre regiões, matriz Likert, relatórios e autenticação por usuário.

## Estado atual da aplicação

Atualmente o frontend possui uma base funcional para autenticação e navegação da área logada:

- login mockado
- persistência de sessão em `localStorage`
- rotas públicas e protegidas com `react-router-dom`
- layout autenticado com `header` fixo e `sidebar` lateral
- navegação inicial entre painel principal e perfil
- página de cadastro mockada para futura integração com API

Credenciais mockadas atuais:

- e-mail: `admin@educenso.dev`
- senha: `123456`

## Stack principal

- React 19
- TypeScript
- Vite
- pnpm
- Tailwind CSS
- shadcn/ui
- React Router DOM
- lucide-react

## Como executar

### Requisitos

- Node.js
- pnpm

### Instalação

```bash
pnpm install
```

### Ambiente de desenvolvimento

```bash
pnpm dev
```

Aplicação disponível em `http://localhost:5173`.

### Build de produção

```bash
pnpm build
```

### Preview local da build

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

## Scripts disponíveis

- `pnpm dev`: inicia o servidor de desenvolvimento do Vite
- `pnpm build`: executa `tsc -b` e gera a build de produção
- `pnpm preview`: sobe uma visualização local da build gerada
- `pnpm lint`: executa o ESLint no projeto

## Funcionalidades implementadas hoje

### Autenticação

- login mockado via `src/services/auth/authService.ts`
- validação de formulário no frontend
- persistência de sessão em `localStorage`
- restauração automática da sessão ao recarregar a página
- logout com limpeza da sessão local

### Navegação

- redirecionamento automático entre área pública e privada
- rotas públicas:
  - `/login`
  - `/register`
- rotas protegidas:
  - `/app`
  - `/app/profile`

### Área autenticada

- `header` fixo no topo
- `sidebar` lateral com animação de entrada e saída no desktop
- menu móvel para telas menores
- botão de perfil no topo
- botão de logout no topo

### Páginas base

- dashboard inicial com blocos placeholder para futuras features
- perfil com dados do usuário autenticado
- cadastro com UI pronta para futura integração com backend

## Arquitetura atual

O projeto segue organização por responsabilidade e por feature.

Princípios atuais:

- rotas centralizadas em `src/app/routes`
- autenticação isolada em `src/features/auth`
- layout da área logada separado da lógica de rota
- serviços concentrados em `src/services`
- tipos reutilizáveis em `src/types`
- componentes de UI base em `src/components/ui`

Essa estrutura foi pensada para facilitar a substituição do mock atual por uma API real no futuro, reduzindo impacto no restante da aplicação.

## Estrutura de pastas

```text
src/
├── app/
│   └── routes/
├── assets/
├── components/
│   └── ui/
├── features/
│   ├── app/
│   │   └── layouts/
│   ├── auth/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── providers/
│   ├── dashboard/
│   │   └── pages/
│   └── profile/
│       └── pages/
├── lib/
├── services/
│   └── auth/
├── types/
├── App.tsx
├── index.css
└── main.tsx
```

## Responsabilidade de cada pasta

### `src/app`

Camada de composição global da aplicação.

- `routes/`: define os caminhos, redirecionamentos e montagem principal das rotas

Responsabilidade:
- centralizar navegação global
- evitar que `App.tsx` concentre regras demais

### `src/assets`

Arquivos estáticos usados pela interface.

Exemplos:
- logo
- imagens
- ícones locais, quando houver

### `src/components`

Componentes compartilhados entre features.

### `src/components/ui`

Componentes base de interface, reaproveitáveis e desacoplados da regra de negócio.

Exemplos:
- `Button`
- `Input`
- `Card`
- `Label`
- `Alert`

Responsabilidade:
- oferecer blocos visuais padronizados
- servir de base para as features

### `src/features`

Agrupa o código por domínio funcional da aplicação.

Essa é a principal organização do projeto.

### `src/features/app`

Contém estruturas da área autenticada que não pertencem a uma única feature de negócio.

- `layouts/`: layout da aplicação logada, como `AppShell`

Responsabilidade:
- compor a casca da área autenticada
- manter `header`, `sidebar` e `Outlet`

### `src/features/auth`

Concentra toda a responsabilidade de autenticação.

Subpastas:

- `components/`: guards e componentes auxiliares de autenticação
- `contexts/`: contexto React da autenticação
- `hooks/`: hook `useAuth`
- `pages/`: telas de login e cadastro
- `providers/`: `AuthProvider`

Responsabilidade:
- login e logout
- sessão do usuário
- proteção de rotas
- páginas públicas relacionadas ao acesso

### `src/features/dashboard`

Contém páginas da área principal do sistema.

Hoje:
- página base inicial do dashboard

Futuro esperado:
- filtros
- indicadores
- comparativos
- visões analíticas

### `src/features/profile`

Contém telas e componentes relacionados ao perfil do usuário autenticado.

Hoje:
- página de perfil com dados do usuário mockado

### `src/lib`

Utilitários compartilhados de baixo acoplamento.

Hoje:
- helpers como `cn` para composição de classes CSS

### `src/services`

Camada de acesso a dados e integração com backend ou mocks.

### `src/services/auth`

Serviços de autenticação.

Hoje:

- `authService.ts`: login mockado
- `authSession.ts`: persistência e leitura da sessão no `localStorage`

Responsabilidade:
- centralizar integração de auth
- facilitar troca futura do mock por API real

### `src/types`

Tipos TypeScript reutilizáveis entre múltiplas áreas.

Hoje:
- tipos de autenticação, payload e usuário

## Fluxo atual de autenticação

1. O usuário acessa `/login`
2. O formulário valida e envia credenciais para o serviço mockado
3. O `AuthProvider` recebe o usuário autenticado
4. A sessão é persistida em `localStorage`
5. O usuário é redirecionado para `/app`
6. Ao recarregar a página, a sessão é restaurada automaticamente
7. No logout, a sessão local é removida e o usuário volta para `/login`

## Rotas

### Públicas

- `/login`
- `/register`

### Protegidas

- `/app`
- `/app/profile`

## Direção arquitetural para a futura API

O código atual já foi organizado para facilitar a migração do mock para backend real.

O impacto esperado dessa futura mudança deve se concentrar principalmente em:

- `src/services/auth/authService.ts`
- `src/services/auth/authSession.ts`
- `src/features/auth/providers/AuthProvider.tsx`

Isso evita mexer de forma relevante em:

- páginas
- layout autenticado
- estrutura de rotas
- componentes base de UI

## Próximos passos sugeridos

- integrar login e cadastro com API real
- criar uma camada HTTP centralizada para autenticação e dados analíticos
- adicionar guards com estados de carregamento e expiração de sessão
- implementar dashboard real com filtros e indicadores
- expandir a feature de perfil com edição e preferências do usuário

## Observações

- o backend ainda não está integrado
- o cadastro atual é visual e preparatório
- a autenticação atual é mockada e destinada à evolução posterior
