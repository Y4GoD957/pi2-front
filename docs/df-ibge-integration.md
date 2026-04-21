# Integracao DF + IBGE + Heat Map

## Decisao adotada

O frontend foi preparado para operar com foco exclusivo no Distrito Federal.

A arquitetura agora considera duas camadas para o heat map:

1. `fallback` atual:
   - usa os dados reais do Supabase ja disponiveis no projeto
   - agrupa setores/localidades do DF
   - calcula um indice composto de vulnerabilidade
   - renderiza blocos tematicos no frontend

2. `real` recomendado:
   - consome uma API propria em FastAPI
   - a API consolida indicadores do IBGE/SIDRA
   - a API entrega geometrias reais do DF processadas com GeoPandas
   - o frontend troca automaticamente para polygons SVG reais quando esse endpoint existir

## Fonte oficial recomendada

- API de Agregados do IBGE / SIDRA:
  - https://servicodados.ibge.gov.br/api/docs/agregados?versao=3
- API de Localidades do IBGE:
  - https://servicodados.ibge.gov.br/api/docs/localidades
- Malhas Geograficas do IBGE:
  - https://servicodados.ibge.gov.br/api/docs/malhas?versao=3
- Malha de Setores Censitarios / Bairros:
  - https://www.ibge.gov.br/geociencias/organizacao-do-territorio/estrutura-territorial/26565-malhas-de-setores-censitarios-divisoes-intramunicipais.html

## Recomendacao de backend

Escolha recomendada: FastAPI.

Motivos:
- melhor tipagem
- contratos claros
- integracao mais simples com processamento geoespacial em Python
- encaixe melhor com frontend TypeScript

## Contrato sugerido para a API propria

### GET `/df/dashboard`

Retorna:
- indicadores consolidados do DF
- filtros validos
- tendencia temporal
- comparacoes internas
- leitura Likert

### GET `/df/heatmap`

Retorna:
- `areas[]`
- cada area com:
  - `id`
  - `label`
  - `metricLabel`
  - `metricValue`
  - `normalizedValue`
  - `reportCount`
  - `year`
  - `svgPath`

O `svgPath` deve vir pronto para renderizacao em SVG no frontend.

## Pipeline recomendado em Python

1. Baixar malha oficial do DF por setores censitarios ou bairros
2. Ler com GeoPandas
3. Unificar CRS e atributos
4. Cruzar com a base analitica por chave territorial compativel
5. Produzir geometrias simplificadas para web
6. Expor payload consolidado via FastAPI

## Limitacao atual

As tabelas `fato_educacao` e `fato_socioeconomico` apresentadas na modelagem ainda nao possuem chave territorial suficiente para um join geografico intramunicipal confiavel.

Sem isso, o heat map real depende de:
- uma view analitica consolidada
- ou uma tabela intermediaria no backend
- ou uma estrutura enriquecida no Supabase
