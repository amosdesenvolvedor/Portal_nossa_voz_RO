# ROUTES - Nossa Voz RO

## Estrutura publica (Prompt 03)

| Rota | Finalidade | Tipo | Status atual | Fonte futura de dados |
| --- | --- | --- | --- | --- |
| / | Home jornalistica publica | Estatica | Home editorial demonstrativa ativa | DB/CMS para curadoria futura |
| /design-system | Validacao interna de componentes visuais | Estatica | Ativa | Mantida para evolucao do DS |
| /noticias | Hub de noticias e categorias | Estatica | Placeholder ativo | DB (news, category) |
| /noticias/[categoria] | Listagem por categoria | Dinamica | Estrutural com validacao de slug temporario | DB (category, news) |
| /noticias/[categoria]/[slug] | Pagina de noticia | Dinamica | Materia demonstrativa ativa | DB (news + relations) |
| /municipios | Hub de cobertura regional | Estatica | Placeholder ativo | DB (municipality, region) |
| /municipios/[slug] | Pagina por municipio | Dinamica | Estrutural | DB (municipality, news) |
| /busca | Entrada para busca publica | Estatica | Placeholder ativo | Indice/busca (Prompt futuro) |
| /sobre | Institucional | Estatica | Placeholder ativo | Conteudo institucional |
| /contato | Institucional | Estatica | Placeholder ativo | Conteudo institucional + canais oficiais |
| /publicidade | Comercial | Estatica | Placeholder ativo | Modulo de publicidade |
| /autores | Hub de autores | Estatica | Placeholder ativo | DB (users/authors) |
| /autores/[slug] | Perfil de autor | Dinamica | Estrutural | DB (author + news) |
| /politica-de-privacidade | Institucional juridica | Estatica | Placeholder ativo | Conteudo juridico oficial |
| not-found | Tratamento de 404 | Sistema | Ativo | N/A |

## Observacoes

- Slugs publicos sao amigaveis e legiveis.
- Arrays de categorias na navegacao sao temporarios e centralizados em `src/config/site.ts`.
- Fonte de verdade editorial sera o banco de dados nas proximas etapas.

## Estrutura administrativa (Prompt 08)

| Rota | Finalidade | Tipo | Status atual | Protecao |
| --- | --- | --- | --- | --- |
| /admin/login | Autenticacao administrativa | Estatica | Ativa | Publica (noindex) |
| /admin | Dashboard editorial | Estatica | Ativa com dados demonstrativos | Sessao obrigatoria |
| /admin/noticias | Listagem administrativa de noticias | Estatica + filtros de query | Ativa com dados demonstrativos | Sessao obrigatoria |
| /admin/noticias/nova | Editor inicial por blocos + IA assistiva | Estatica interativa | Ativa (sem persistencia final) | Sessao obrigatoria |
| /admin/noticias/[id] | Detalhe estrutural de noticia administrativa | Dinamica | Estrutural com base demonstrativa | Sessao obrigatoria |
| /admin/revisao | Fila de itens em revisao | Estatica | Ativa com base demonstrativa | Sessao obrigatoria |
| /admin/categorias | Estrutura administrativa de categorias | Estatica | Ativa com base demonstrativa | Sessao obrigatoria |
| /admin/municipios | Estrutura administrativa geografica | Estatica | Ativa com base demonstrativa | Sessao obrigatoria |
| /admin/tags | Estrutura administrativa de tags | Estatica | Ativa com base demonstrativa | Sessao obrigatoria |
| /admin/autores | Estrutura administrativa de autores | Estatica | Ativa com base demonstrativa | Sessao obrigatoria |
| /admin/publicidade | Estrutura administrativa de slots de publicidade | Estatica | Ativa com base estrutural | Sessao obrigatoria |
| /admin/configuracoes | Estrutura administrativa de configuracoes | Estatica | Ativa com estado de IA | Sessao obrigatoria |

## Endpoints internos administrativos (Prompt 08)

| Rota | Finalidade | Tipo | Protecao |
| --- | --- | --- | --- |
| /api/auth/[...nextauth] | Sessao e autenticacao NextAuth | API | Interna da solucao de auth |
| /api/admin/ai/suggest | Assistencia editorial com IA para admin | API POST | Sessao + role + rate limit |
| /api/admin/workflow/preview-transition | Validacao server-side de transicao editorial (demonstrativa) | API POST | Sessao + policy de role |
