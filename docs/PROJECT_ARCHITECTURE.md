# PROJECT ARCHITECTURE - Nossa Voz RO

## 1. Objetivo do projeto

Construir um portal jornalistico regional de Rondonia com foco inicial na Zona da Mata e BR-429, preparado para crescer em escopo editorial, operacao e audiencia sem reescritas estruturais.

Slogan oficial: A VOZ DE QUEM VIVE AQUI.

## 2. Stack utilizada

- Next.js (App Router)
- TypeScript em modo strict
- React
- Tailwind CSS
- PostgreSQL
- Prisma ORM

## 3. Estrutura de diretorios (fase 01)

- `src/app`: rotas e layouts do App Router
- `src/lib/domain`: constantes tipadas de dominio editorial
- `prisma`: schema inicial de dados
- `docs`: documentacao tecnica do projeto
- `public`: arquivos publicos estaticos

## 4. Decisoes arquitetonicas

1. App Router do Next.js como base de renderizacao
- Mantem opcoes para SSR, SSG, metadata dinamica e rotas escalaveis para SEO.

2. Dominio editorial separado em `src/lib/domain`
- Regras e enumeracoes de negocio ficam desacopladas da camada de UI.

3. Prisma como camada de acesso a dados
- Schema inicial contempla entidades centrais sem implementar todo o banco nesta fase.

4. Tipagem estrita
- Projeto permanece com TypeScript strict para reduzir regressao futura.

5. Fundacao mobile-first
- Estrutura de UI provisoria ja responsiva para smartphone/tablet/desktop.

## 5. Modelo editorial planejado (alto nivel)

Entidades principais:
- News (noticia)
- Category (categoria)
- Municipality (municipio)
- Region (regiao)
- Tag
- User

Estados editoriais previstos:
- DRAFT
- IN_REVIEW
- PUBLISHED
- ARCHIVED

Regra fundamental de IA:
- Conteudo assistido por IA nunca publica automaticamente.
- Publicacao deve ser acao humana autorizada.

## 6. Estrategia de usuarios e permissoes

Papeis base previstos:
- ADMIN
- EDITOR
- AUTHOR

A autenticacao/autorizacao completa nao foi implementada nesta fase, mas o dominio e o schema ja contemplam evolucao para RBAC.

## 7. Estrategia regional

A modelagem inicial permite vincular noticias a:
- municipio
- regiao

Objetivo futuro:
- paginas por municipio em formato de slug, ex.: `/municipios/rolim-de-moura`
- paginas por regiao e agregacoes editoriais regionais

## 8. Estrategia futura de IA

Fase atual:
- sem integracao com provedores de IA

Direcao futura:
- gerar rascunhos, sugerir titulos/subtitulos/tags, resumo e revisao
- todo resultado de IA entra como rascunho ou revisao pendente

## 9. Estrategia futura de publicidade

Posicoes previstas para modularizacao futura:
- HOME_TOP
- HOME_MIDDLE
- SIDEBAR
- ARTICLE_TOP
- ARTICLE_MIDDLE
- ARTICLE_BOTTOM
- CATEGORY_TOP

## 10. SEO (decisao inicial)

Direcao de URL para noticia:
- `/noticias/[categoria]/[slug-da-noticia]`

Motivos:
- melhora legibilidade semantica
- favorece arquitetura de categorias indexaveis
- permite evolucao para breadcrumbs e metadata dinamica

Observacao:
- implementacao completa de sitemap, canonical, robots, Open Graph e dados estruturados fica para fases posteriores.

## 11. Seguranca (fundacao)

- Variaveis sensiveis em ambiente (`.env`), nunca no codigo
- `.env*` ignorado por git
- Modelagem pronta para principio de menor privilegio via papeis
- Controle de acesso de rotas administrativas sera implementado em fase futura

## 12. Limites desta fase (nao implementado propositalmente)

- painel administrativo
- autenticacao completa
- editor completo de noticias
- integracao de IA
- modulo funcional de publicidade
- API completa e auditoria detalhada
- layout final da home e pagina final de noticia

## 13. Evolucao de design system (Prompt 02)

- Tokens visuais centralizados em `src/app/globals.css` e `tailwind.config.ts`
- Componentes base criados em `src/components/ui`
- Rota interna de validacao visual em `/design-system`
- Documentacao complementar em `docs/DESIGN_SYSTEM.md`

## 14. Arquitetura publica e navegacao (Prompt 03)

- Shell publico centralizado no layout raiz com:
	- Header base
	- Footer base
	- skip link para acessibilidade
- Rotas publicas estruturadas com App Router:
	- `/`
	- `/noticias`
	- `/noticias/[categoria]`
	- `/noticias/[categoria]/[slug]`
	- `/municipios`
	- `/municipios/[slug]`
	- `/busca`
	- `/sobre`
	- `/contato`
	- `/publicidade`
	- `/autores`
	- `/autores/[slug]`
	- `/politica-de-privacidade`
- Componente reutilizavel de breadcrumbs para paginas publicas.

## 15. Estrategia temporaria de categorias e municipios

- Configuracao de navegacao centralizada em `src/config/site.ts`.
- Categorias de menu continuam temporarias e tipadas, sem se tornarem fonte definitiva.
- Fonte de verdade futura para categorias, municipios e regioes: banco de dados.

## 16. Server e Client Components

- Server Components seguem como padrao para paginas e estrutura publica.
- Client Components isolados apenas quando necessarios:
	- menu mobile interativo no header.

## 17. Documentacao de rotas

- Mapa detalhado em `docs/ROUTES.md` com finalidade, tipo, status e fonte futura dos dados.

## 18. Home editorial (Prompt 04)

- Home publica evoluida para composicao jornalistica com:
	- manchete principal
	- destaques secundarios
	- ultimas noticias
	- secao regional
	- editorias em destaque
	- bloco de municipios
	- slots de publicidade estruturais
	- sidebar em telas amplas
- Dados da Home centralizados em `src/data/home-demo.ts` como fonte temporaria tipada.
- Componentes especificos da Home em `src/components/home`.
- Integracao futura prevista para curadoria editorial e dados reais sem reescrever a camada de apresentacao.

## 19. Camada editorial reutilizavel (Prompt 05)

- Tipos de apresentacao editorial centralizados em `src/lib/editorial/presentation.ts`.
- Helpers editoriais centralizados:
	- `src/lib/editorial/date.ts`
	- `src/lib/editorial/urls.ts`
- Componentes reutilizaveis em `src/components/editorial`:
	- `EditorialMeta`
	- `EditorialByline`
	- `EditorialTagList`
	- `EditorialImageCaption`
	- `EditorialEmptyState`
	- `EditorialPagination`
- `NewsCard` evoluido com variantes reutilizaveis (`standard`, `horizontal`, `compact`) mantendo API simples.
- Home preservada visualmente com reducao de duplicacao de metadados e montagem de URLs.
- Documentacao complementar: `docs/EDITORIAL_COMPONENTS.md`.

## 20. Pagina de noticia publica (Prompt 06)

- Rota publica consolidada em `src/app/noticias/[categoria]/[slug]/page.tsx`.
- Conteudo demonstrativo tipado em `src/data/article-demo.ts`.
- Blocos editoriais tipados em `src/lib/editorial/article-blocks.ts`.
- Renderer controlado em `src/components/article/ArticleBody.tsx` sem HTML arbitrario.
- Largura de leitura reutilizavel baseada em `--reading-max`.
- Compartilhamento client-side isolado em `src/components/article/ShareActions.tsx`.
- Documentacao complementar: `docs/ARTICLE_ARCHITECTURE.md`.

## 21. Fundacao de assistencia editorial com IA (Prompt 06)

- Integracao inicial server-side com OpenRouter em `src/lib/ai`.
- Modelo configuravel por ambiente (`OPENROUTER_MODEL`) sem espalhar nome de modelo pela aplicacao.
- Chave mantida apenas no servidor (`OPENROUTER_API_KEY`).
- Respostas tratadas como sugestao editorial, nunca como publicacao.
- Falhas do provedor retornam erro controlado e nao derrubam o portal publico.
- Documentacao complementar: `docs/AI_EDITORIAL_ASSISTANCE.md`.
