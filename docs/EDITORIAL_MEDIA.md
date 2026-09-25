# EDITORIAL MEDIA WORKFLOW - Prompt 11.2

## Objetivo

Implementar um fluxo editorial completo de imagens com:
- upload seguro
- associacao de multiplas imagens por noticia
- imagem principal (hero)
- metadados editoriais (`alt`, `caption`, `credit`)
- blur manual reversivel
- suporte a imagem gerada por IA com uso sempre manual

## Modelo de dados

Arquivos:
- `prisma/schema.prisma`
- `prisma/migrations/20260925171922_add_editorial_media_workflow/migration.sql`

Entidades principais:
- `MediaAsset`
- `NewsMediaAsset` (join many-to-many com metadados e ordenacao)

Relacionamentos:
- noticia pode ter varias imagens associadas
- noticia pode definir `heroMediaAssetId` como imagem principal
- `MediaAsset.origin` diferencia `UPLOADED` e `AI_GENERATED`

## Armazenamento de arquivos

Arquivos:
- `src/lib/storage/types.ts`
- `src/lib/storage/config.ts`
- `src/lib/storage/local-storage.ts`
- `src/lib/storage/media-storage.ts`

Decisao:
- binario nao e salvo no PostgreSQL
- banco guarda apenas metadados e chaves de storage
- provider atual local para desenvolvimento (`/.local_storage/` ignorado pelo git)

## Processamento de imagem

Arquivo:
- `src/lib/media/editorial-media.ts`

Regras de entrada:
- formatos aceitos: JPEG, PNG, WebP
- limite de tamanho: `MEDIA_MAX_FILE_SIZE_BYTES`
- validacao de dimensoes e total de pixels
- normalizacao server-side antes de persistir

## Endpoints administrativos

Arquivos:
- `src/app/api/admin/media/upload/route.ts`
- `src/app/api/admin/media/[id]/route.ts`
- `src/app/api/admin/media/generate/route.ts`

Acoes:
- upload de imagem com validacao e metadados
- atualizacao de metadados e flag de sensibilidade
- aplicar/remover blur manual
- gerar imagem por IA (quando provider suportar)

## Exposicao publica de imagem

Arquivo:
- `src/app/media/[id]/route.ts`

Comportamento:
- entrega de imagem por id publico (`/media/:id`)
- original privado nao e exposto por URL previsivel
- sem vazamento de chaves internas de storage nas respostas administrativas

## Integracao no editor

Arquivos:
- `src/components/admin/AdminNewsEditorForm.tsx`
- `src/app/admin/(protected)/noticias/nova/page.tsx`
- `src/app/admin/(protected)/noticias/[id]/page.tsx`
- `src/lib/editorial/validation.ts`
- `src/lib/editorial/article-blocks.ts`
- `src/lib/services/editorial-service.ts`

Fluxo no admin:
- enviar imagem
- editar `alt/caption/credit`
- definir/remover imagem principal
- inserir bloco de imagem no corpo da materia
- aplicar/remover blur
- associar e desassociar imagens da noticia

## Renderizacao publica

Arquivos:
- `src/components/article/ArticleBody.tsx`
- `src/app/noticias/[categoria]/[slug]/page.tsx`

Comportamento:
- bloco `image` renderiza imagem associada por id
- se origem for `AI_GENERATED`, legenda indica que a imagem foi gerada por IA
- imagem principal alimenta metadata social e JSON-LD (quando definida)

## IA visual: politica editorial

Princípios:
- IA visual nao publica noticia
- IA visual nao altera workflow da noticia
- IA visual nao insere imagem automaticamente na materia
- editor humano deve decidir explicitamente usar ou descartar a sugestao visual

Estado atual:
- endpoint retorna indisponibilidade controlada (`503`) quando nao ha provider multimodal configurado
- nao existe fallback com imagem fake/sintetica local

## Validacao tecnica executada

Resultados observados em runtime local:
- upload anonimo: `401`
- upload valido autenticado: `200`
- formato invalido: `415`
- arquivo acima do limite: `413`
- criacao de noticia com imagem associada + hero: `200`
- transicao workflow para `IN_REVIEW` e `PUBLISHED`: `200`
- pagina publica com imagem e metadata: `200`
- blur e unblur: `200`
- endpoint de IA visual sem provider: `503` controlado
