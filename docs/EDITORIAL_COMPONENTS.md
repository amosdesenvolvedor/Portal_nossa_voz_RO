# EDITORIAL COMPONENTS - Nossa Voz RO

## Objetivo

Consolidar uma camada reutilizavel para apresentacao editorial sem acoplamento ao banco, preservando a Home aprovada e reduzindo duplicacao de logica em rotas atuais e futuras.

## Camada de tipos de apresentacao

Arquivo:
- `src/lib/editorial/presentation.ts`

Tipos principais:
- `EditorialPresentationImage`
- `EditorialPresentationTag`
- `EditorialPresentationMeta`
- `EditorialPresentationLink`

Diretriz:
- contratos da UI ficam independentes do modelo Prisma
- adaptadores futuros podem mapear dados reais para esses contratos

## Helpers editoriais

Arquivos:
- `src/lib/editorial/date.ts`
- `src/lib/editorial/urls.ts`

Responsabilidades:
- formatacao deterministica de data/hora em `pt-BR` com timezone `America/Porto_Velho`
- construcao centralizada de URLs de noticias e categorias

## Componentes editoriais reutilizaveis

Diretorio:
- `src/components/editorial`

Componentes:
- `EditorialMeta`: data/publicacao, municipio e autor
- `EditorialByline`: assinatura curta de autoria
- `EditorialTagList`: lista de tags com ou sem link
- `EditorialImageCaption`: legenda e credito de imagem
- `EditorialEmptyState`: estado vazio para listas/paginas
- `EditorialPagination`: paginacao por links com acessibilidade

## Evolucao de componentes existentes

- `NewsCard`:
  - variantes `standard`, `horizontal`, `compact`
  - metadados via `EditorialMeta`
- `FeaturedStory`:
  - URL via helper central `buildNewsHref`
  - metadados via `EditorialMeta`
- `CategorySection`:
  - URLs centralizadas
- `Home`:
  - reducao de montagem manual de URLs
  - uso de `EditorialMeta` em destaques secundarios

## Rota de validacao

`/design-system` passou a demonstrar:
- variantes de `NewsCard`
- metadados, byline, tags
- legenda/credito
- empty state
- paginacao acessivel

## Integracao futura

Em listas reais (`/noticias`, `/municipios/[slug]`, `/autores/[slug]`):
- manter os componentes desta camada
- trocar apenas a fonte de dados por queries/repositorios
- usar adaptadores para mapear modelos de banco em contratos de apresentacao