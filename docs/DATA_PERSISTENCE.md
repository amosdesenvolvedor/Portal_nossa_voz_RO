# DATA PERSISTENCE - Prompt 09

## Objetivo

Consolidar PostgreSQL + Prisma como fonte de verdade editorial para:
- noticias
- workflow de status
- trilha de auditoria
- taxonomias (categorias, municipios, tags)
- perfis publicos de autores

## Modelo de dados aplicado

Arquivo base:
- `prisma/schema.prisma`

Evolucoes principais:
- `News.contentBlocks` (JSON) para armazenar blocos editoriais tipados.
- Campos de hero na noticia:
  - `heroImageUrl`
  - `heroImageAlt`
  - `heroImageCaption`
  - `heroImageCredit`
- Relacao de autoria designada:
  - `News.authorId` -> `User`
- Campos de perfil publico em `User`:
  - `publicSlug`
  - `bio`
  - `avatarUrl`
  - `isAuthorProfileActive`
- Flags de publicacao municipal em `Municipality`:
  - `isActive`
  - `featured`
- Auditoria editorial append-only:
  - enum `EditorialAuditAction`
  - model `EditorialAuditEvent`

Indices editoriais adicionados para leitura publica:
- `@@index([status, publishedAt])`
- `@@index([categoryId, status, publishedAt])`
- `@@index([municipalityId, status, publishedAt])`
- `@@index([authorId, status, publishedAt])`

## Migracao

Migracao aplicada:
- `prisma/migrations/20260923102847_persist_editorial_prompt09/migration.sql`

Status validado:
- `npx prisma migrate status` -> schema atualizado e sem drift.

## Seed editorial base

Script idempotente:
- `scripts/seed-editorial-base.mjs`

Comando:
- `npm run seed:editorial`

Escopo do seed:
- categorias base
- regioes e municipios iniciais
- tags iniciais

## Servicos e validacao

Camadas centrais:
- `src/lib/services/editorial-service.ts`
- `src/lib/editorial/validation.ts`
- `src/lib/utils/http-errors.ts`

Funcoes relevantes:
- CRUD de noticias (criar rascunho, atualizar, listar, detalhe)
- transicao de workflow persistente com policy por papel
- gravacao de eventos de auditoria por operacao
- CRUD de categorias, municipios, tags e perfis de autor
- consultas publicas somente para conteudo `PUBLISHED`

## Endpoints administrativos persistentes

Noticias e workflow:
- `GET/POST /api/admin/news`
- `GET/PATCH /api/admin/news/[id]`
- `POST /api/admin/news/[id]/workflow`

Taxonomias e autores:
- `GET/POST /api/admin/categories`
- `PATCH /api/admin/categories/[id]`
- `GET/POST /api/admin/municipalities`
- `PATCH /api/admin/municipalities/[id]`
- `GET/POST /api/admin/tags`
- `PATCH /api/admin/tags/[id]`
- `GET/POST /api/admin/authors`
- `PATCH /api/admin/authors/[id]`

## Integracao publica com DB

Rotas publicas conectadas ao banco:
- `/`
- `/noticias`
- `/noticias/[categoria]`
- `/noticias/[categoria]/[slug]`
- `/municipios`
- `/municipios/[slug]`
- `/autores`
- `/autores/[slug]`

Regra de visibilidade:
- apenas noticias com status `PUBLISHED` aparecem publicamente.

## Seguranca e governanca

Regras preservadas:
- IA permanece assistiva, sem publicacao automatica.
- `AUTHOR` nao publica; transicao para `PUBLISHED` depende de `EDITOR` ou `ADMIN`.
- Todas as mutacoes administrativas exigem sessao autenticada.
- Erros de dominio/validacao sao normalizados em respostas HTTP consistentes.

## Validacao executada

- `npm run typecheck` -> OK
- `npm run lint` -> OK
- `npm run build` -> OK
- `npx prisma generate` -> OK
- `npx prisma migrate status` -> OK

## Observacao operacional

Foi realizada tentativa de backup logico antes da migracao estrutural. O utilitario local de dump nao estava disponivel no ambiente naquele momento, e a limitacao foi registrada durante a execucao da tarefa.
