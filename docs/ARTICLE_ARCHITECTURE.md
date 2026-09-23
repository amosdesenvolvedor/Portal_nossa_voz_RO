# ARTICLE ARCHITECTURE - Nossa Voz RO

## Objetivo

Definir a pagina individual de noticia publica em `/noticias/[categoria]/[slug]` com foco em leitura, semantica, compartilhamento e evolucao futura para dados reais.

## Fonte de dados temporaria

Arquivo:
- `src/data/article-demo.ts`

Diretriz:
- fixture demonstrativa tipada
- sem dependencia de Prisma nesta etapa
- slugs validos mapeados explicitamente
- slugs inexistentes retornam `notFound()` em vez de parecerem noticias reais

## Estrutura da pagina

Ordem principal:
1. breadcrumbs
2. categoria linkavel
3. titulo H1
4. subtitulo/resumo
5. autoria e metadata
6. imagem principal
7. legenda/credito
8. publicidade superior
9. corpo editorial
10. publicidade intermediaria
11. tags
12. compartilhamento
13. noticias relacionadas
14. publicidade final

## Largura de leitura

- token reutilizado: `--reading-max`
- utilitarios usados: `max-w-reading` e classe `.reading-column`
- objetivo: manter o texto principal em faixa confortavel de leitura mesmo quando o container geral e mais largo

## Corpo editorial tipado

Arquivo:
- `src/lib/editorial/article-blocks.ts`

Blocos suportados nesta etapa:
- `paragraph`
- `heading` (`h2`, `h3`)
- `list`
- `quote`

Conteudo inline suportado:
- texto simples
- destaque semantico (`strong`, `em`)
- link controlado

Renderer:
- `src/components/article/ArticleBody.tsx`

Diretriz futura:
- manter blocos tipados para compatibilidade com futuro editor administrativo
- evitar HTML arbitrario e `dangerouslySetInnerHTML`

## Imagem principal

- hero responsiva com `next/image` quando `src` existir
- `EditorialImagePlaceholder` quando nao houver imagem
- `EditorialImageCaption` para legenda e credito sem espaco vazio desnecessario

## Compartilhamento

Componente:
- `src/components/article/ShareActions.tsx`

Acoes:
- copiar link via Clipboard API
- compartilhamento nativo via Web Share API quando suportado
- WhatsApp
- Facebook
- X

Regra:
- URL de compartilhamento obtida no cliente a partir da pagina atual
- nenhum dominio de producao inventado server-side

## Publicidade

Slots reutilizados:
- `ARTICLE_TOP`
- `ARTICLE_MIDDLE`
- `ARTICLE_BOTTOM`

Implementacao:
- componente `AdSlot`
- sem rede de anuncios nesta fase

## Relacionados

- secao demonstrativa com `NewsCard`
- estrategia temporaria baseada em fixture e lista explicita de slugs relacionados
- sem algoritmo automatico nesta etapa

## Metadata

- `generateMetadata` na rota da noticia
- campos atuais: `title`, `description`
- Open Graph, Twitter Cards, canonical e JSON-LD ficam para Prompt 10

## Acessibilidade

- um unico H1 por materia
- breadcrumbs semanticos
- figure/figcaption na hero
- links reais no conteudo
- feedback acessivel em compartilhamento
- ordem de leitura preservada em mobile e desktop