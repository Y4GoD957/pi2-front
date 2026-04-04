# AGENTS.md

## Contexto do projeto

Este projeto é o frontend do EduCenso.
Stack principal:
- React
- TypeScript
- Vite
- pnpm
- shadcn/ui
- Tailwind CSS

O backend será em Python e fornecerá APIs REST para autenticação, localidades, indicadores, analytics e relatórios.

## Objetivo do produto

Construir uma plataforma de análise de dados educacionais e socioeconômicos com foco em:
- cruzamento de indicadores
- dashboards
- comparação entre regiões
- matriz de calor baseada em escala Likert
- relatórios salvos por usuário

## Regras de arquitetura

- Manter organização por features.
- Separar componentes visuais de lógica de negócio.
- Centralizar chamadas HTTP em `src/services`.
- Centralizar tipos em `src/types` quando reutilizáveis.
- Preferir componentes pequenos, reutilizáveis e tipados.
- Não criar código duplicado.
- Não adicionar dependências novas sem pedir confirmação antes.
- Sempre propor a mudança antes de aplicar alterações grandes.
- Antes de editar múltiplos arquivos, explicar resumidamente:
  1. o que será feito
  2. quais arquivos serão alterados
  3. por que a mudança é necessária

## Regras de segurança

- Nunca expor secrets no frontend.
- Nunca assumir regras de negócio sensíveis no cliente se puderem ficar no backend.
- Validação de dados no frontend deve existir, mas sem substituir validação do backend.

## Preferências de implementação

- Usar `pnpm`.
- Usar TypeScript estrito.
- Preferir React Query para dados assíncronos, se já existir no projeto.
- Preferir `fetch` ou cliente HTTP já existente no projeto.
- Usar shadcn/ui para UI base.
- Usar nomenclatura clara em português ou inglês, mas manter consistência no projeto inteiro.

## Banco de dados que este frontend consome

Entidades principais:
- perfil
- usuario
- relatorio
- dim_localidade
- fato_educacao
- fato_socioeconomico
- fato_pandemia
- parametro_likert_indicadores

A junção principal dos dados analíticos ocorre por localidade e ano.

## Regra obrigatória

NUNCA aplicar alterações diretamente sem aprovação explícita.

Antes de qualquer mudança:
1. Mostrar plano
2. Listar arquivos que serão alterados
3. Aguardar confirmação

Após alterações:
- mostrar resumo do que mudou
- sugerir próximos passos
- rodar checks compatíveis com o projeto, se possível