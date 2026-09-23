# ROUTES - Nossa Voz RO

## Estrutura publica (Prompt 03)

| Rota | Finalidade | Tipo | Status atual | Fonte futura de dados |
| --- | --- | --- | --- | --- |
| / | Home jornalistica publica | Estatica | Home conectada ao DB com fallback inicial | DB/CMS para curadoria futura |
| /design-system | Validacao interna de componentes visuais | Estatica | Ativa | Mantida para evolucao do DS |
| /noticias | Hub de noticias e categorias | Estatica | Feed publico persistente | DB (news, category) |
| /noticias/[categoria] | Listagem por categoria | Dinamica | Persistente para noticias publicadas | DB (category, news) |
| /noticias/[categoria]/[slug] | Pagina de noticia | Dinamica | Persistente para noticia publicada | DB (news + relations) |
| /municipios | Hub de cobertura regional | Estatica | Diretorio persistente de municipios ativos | DB (municipality, region) |
| /municipios/[slug] | Pagina por municipio | Dinamica | Persistente com noticias publicadas | DB (municipality, news) |
| /busca | Entrada para busca publica | Estatica | Placeholder ativo | Indice/busca (Prompt futuro) |
| /sobre | Institucional | Estatica | Placeholder ativo | Conteudo institucional |
| /contato | Institucional | Estatica | Placeholder ativo | Conteudo institucional + canais oficiais |
| /publicidade | Comercial | Estatica | Placeholder ativo | Modulo de publicidade |
| /autores | Hub de autores | Estatica | Lista persistente de perfis ativos | DB (users/authors) |
| /autores/[slug] | Perfil de autor | Dinamica | Persistente com assinaturas publicadas | DB (author + news) |
| /politica-de-privacidade | Institucional juridica | Estatica | Placeholder ativo | Conteudo juridico oficial |
| /sitemap.xml | Sitemap dinamico para descoberta | Sistema | Ativo | DB (conteudo publico) |
| /robots.txt | Politica de crawling por ambiente | Sistema | Ativo | Configuracao SEO |
| not-found | Tratamento de 404 | Sistema | Ativo | N/A |

## Observacoes

- Slugs publicos sao amigaveis e legiveis.
- Fonte de verdade editorial publica agora e o banco de dados para conteudo publicado.
- Descoberta publica considera apenas conteudo `PUBLISHED`.
- Rotas internas (`/admin`, `/design-system`) permanecem fora da indexacao.

## Estrutura administrativa (Prompt 08)

| Rota | Finalidade | Tipo | Status atual | Protecao |
| --- | --- | --- | --- | --- |
| /admin/login | Autenticacao administrativa | Estatica | Ativa | Publica (noindex) |
| /admin | Dashboard editorial | Estatica | Ativa com dados demonstrativos | Sessao obrigatoria |
| /admin/noticias | Listagem administrativa de noticias | Estatica + filtros de query | Ativa com API persistente | Sessao obrigatoria |
| /admin/noticias/nova | Editor inicial por blocos + IA assistiva | Estatica interativa | Ativa com API persistente | Sessao obrigatoria |
| /admin/noticias/[id] | Detalhe estrutural de noticia administrativa | Dinamica | Estrutural com base demonstrativa | Sessao obrigatoria |
| /admin/revisao | Fila de itens em revisao | Estatica | Ativa com API persistente | Sessao obrigatoria |
| /admin/categorias | Estrutura administrativa de categorias | Estatica | Ativa com API persistente | Sessao obrigatoria |
| /admin/municipios | Estrutura administrativa geografica | Estatica | Ativa com API persistente | Sessao obrigatoria |
| /admin/tags | Estrutura administrativa de tags | Estatica | Ativa com API persistente | Sessao obrigatoria |
| /admin/autores | Estrutura administrativa de autores | Estatica | Ativa com API persistente | Sessao obrigatoria |
| /admin/publicidade | Estrutura administrativa de slots de publicidade | Estatica | Ativa com base estrutural | Sessao obrigatoria |
| /admin/configuracoes | Estrutura administrativa de configuracoes | Estatica | Ativa com estado de IA | Sessao obrigatoria |

## Endpoints internos administrativos (Prompt 08)

| Rota | Finalidade | Tipo | Protecao |
| --- | --- | --- | --- |
| /api/auth/[...nextauth] | Sessao e autenticacao NextAuth | API | Interna da solucao de auth |
| /api/admin/ai/suggest | Assistencia editorial com IA para admin | API POST | Sessao + role + rate limit |
| /api/admin/workflow/preview-transition | Validacao server-side de transicao editorial | API POST | Sessao + policy de role |
| /api/admin/news | Listagem e criacao de noticia (rascunho) | API GET/POST | Sessao + role |
| /api/admin/news/[id] | Leitura e atualizacao de noticia | API GET/PATCH | Sessao + role |
| /api/admin/news/[id]/workflow | Transicao de status editorial persistente | API POST | Sessao + policy de role |
| /api/admin/categories | Listagem e criacao de categorias | API GET/POST | Sessao + role |
| /api/admin/categories/[id] | Atualizacao de categoria | API PATCH | Sessao + role |
| /api/admin/municipalities | Listagem e criacao de municipios | API GET/POST | Sessao + role |
| /api/admin/municipalities/[id] | Atualizacao de municipio | API PATCH | Sessao + role |
| /api/admin/tags | Listagem e criacao de tags | API GET/POST | Sessao + role |
| /api/admin/tags/[id] | Atualizacao de tag | API PATCH | Sessao + role |
| /api/admin/authors | Listagem e ativacao de perfil autor | API GET/POST | Sessao + role |
| /api/admin/authors/[id] | Atualizacao de perfil autor | API PATCH | Sessao + role |
