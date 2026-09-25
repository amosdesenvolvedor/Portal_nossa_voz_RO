# SEO AND DISCOVERY - Prompt 10

## Objetivo

Implementar a camada técnica de descoberta pública para o portal, cobrindo:
- metadata base e dinâmica
- canonical
- Open Graph
- Twitter/X cards
- JSON-LD
- sitemap
- robots

Regra editorial central:
- somente conteúdo `PUBLISHED` é elegível para descoberta pública.

## Configuração de URL pública

Variável principal:
- `NEXT_PUBLIC_SITE_URL`

Fallback seguro para desenvolvimento:
- `NEXTAUTH_URL`
- se ambas ausentes/inválidas, fallback interno para `http://localhost:3000`

Implementação:
- `src/lib/seo/config.ts`
- `src/lib/seo/urls.ts`

Helper central:
- `absoluteUrl(path)`
- normaliza paths e evita barras duplicadas no resultado.

## Variáveis de ambiente relacionadas

Arquivo atualizado:
- `.env.example`

Variáveis:
- `NEXT_PUBLIC_SITE_URL=`
- `SEO_ALLOW_INDEXING=false`

Observação de deploy:
- em produção, configurar `NEXT_PUBLIC_SITE_URL` com a URL pública definitiva.
- não foi definido domínio fictício neste prompt.

## Metadata base

Arquivo:
- `src/app/layout.tsx`

Campos principais:
- `metadataBase`
- `title` com template
- `description` institucional factual
- `alternates.canonical`
- `openGraph` base (`website`, `pt_BR`)
- `twitter` base (`summary_large_image`)
- `robots` com política por ambiente

Idioma:
- `lang="pt-BR"` mantido no root layout.

## Metadata por rota

### Home
- `src/app/page.tsx`
- metadata específica da marca e canonical de `/`.

### Notícias
- `src/app/noticias/page.tsx`
- metadata estática para o hub público.

### Categoria
- `src/app/noticias/[categoria]/page.tsx`
- `generateMetadata` dinâmico com base em conteúdo publicado.
- canonical absoluto por slug.

### Matéria
- `src/app/noticias/[categoria]/[slug]/page.tsx`
- `generateMetadata` dinâmico com notícia `PUBLISHED`.
- sem publicação em status privado.
- canonical absoluto da rota real.
- Open Graph `article` com:
  - `publishedTime`
  - `modifiedTime`
  - `authors`
  - `section`
  - `tags`

### Municípios
- índice: `src/app/municipios/page.tsx`
- detalhe: `src/app/municipios/[slug]/page.tsx`
- metadata dinâmica no detalhe baseada em município persistido.

### Autores
- índice: `src/app/autores/page.tsx`
- detalhe: `src/app/autores/[slug]/page.tsx`
- metadata dinâmica baseada em nome/bio do perfil público.
- sem exposição de email, role administrativa ou IDs internos.

### Institucionais
- `src/app/sobre/page.tsx`
- `src/app/contato/page.tsx`
- `src/app/publicidade/page.tsx`
- `src/app/politica-de-privacidade/page.tsx`
- metadata estática com canonical.

### Busca
- `src/app/busca/page.tsx`
- decisão: `noindex, follow`.

### Design system
- `src/app/design-system/page.tsx`
- política: `noindex, nofollow`.

### Admin
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- política mantida: `noindex, nofollow`.

## Open Graph e imagem social

Configuração central:
- `src/lib/seo/metadata.ts`

Estratégia de imagem:
1. matéria usa `heroMediaAsset` (`/media/:id`) quando disponível
2. fallback secundário usa `heroImageUrl` legado quando existente
3. fallback final usa imagem social padrão do portal

Asset social padrão criado:
- `public/brand/nossa-voz-ro-social.svg`
- dimensão declarada: `1200x630`
- alt padrão: `Nossa Voz RO — A Voz de Quem Vive Aqui`

## Twitter/X cards

Estratégia:
- `summary_large_image`
- sem `@handle` inventado
- título/descrição/imagem consistentes com Open Graph

## JSON-LD

Helper central:
- `src/lib/seo/json-ld.ts`

Tipo implementado na matéria:
- `NewsArticle`

Campos preenchidos com dados reais quando disponíveis:
- `headline`
- `description`
- `mainEntityOfPage`
- `datePublished`
- `dateModified`
- `articleSection`
- `keywords`
- `author` (`Person`)
- `publisher` (`Organization`)
- `image`

Prioridade para `image` da matéria:
1. `heroMediaAsset` público (`/media/:id`)
2. `heroImageUrl` legado
3. imagem social padrão do portal

Serialização segura:
- `JSON.stringify`
- escape de caracteres críticos para inserção em `<script type="application/ld+json">`

## Sitemap

Arquivo:
- `src/app/sitemap.ts`

Inclui:
- rotas públicas estáticas essenciais
- categorias ativas com conteúdo publicado
- municípios ativos
- autores públicos ativos
- notícias `PUBLISHED`

Não inclui:
- `/admin`
- `/admin/login`
- `/design-system`
- `/busca`
- `/api`
- notícias em `DRAFT`, `IN_REVIEW`, `ARCHIVED`

`lastmod`:
- usa datas reais (`updatedAt`) quando disponíveis.

## Robots

Arquivo:
- `src/app/robots.ts`

Comportamento por ambiente:
- `SEO_ALLOW_INDEXING=false` (local/staging): `Disallow: /`
- `SEO_ALLOW_INDEXING=true` (produção):
  - `Allow: /`
  - `Disallow: /admin/`
  - `Disallow: /api/`
  - `Disallow: /design-system`

Sitemap:
- sempre publicado em `Sitemap: <SITE_URL>/sitemap.xml`

## Conteúdo privado e descoberta

Regra aplicada no código de consulta pública:
- `DRAFT`: privado
- `IN_REVIEW`: privado
- `PUBLISHED`: público e descobrível
- `ARCHIVED`: fora da descoberta ativa

## Dependências

- nenhuma nova dependência foi adicionada para SEO.
- implementação feita com APIs nativas do Next.js e utilitários internos.
