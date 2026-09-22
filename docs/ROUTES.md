# ROUTES - Nossa Voz RO

## Estrutura publica (Prompt 03)

| Rota | Finalidade | Tipo | Status atual | Fonte futura de dados |
| --- | --- | --- | --- | --- |
| / | Home jornalistica publica | Estatica | Home editorial demonstrativa ativa | DB/CMS para curadoria futura |
| /design-system | Validacao interna de componentes visuais | Estatica | Ativa | Mantida para evolucao do DS |
| /noticias | Hub de noticias e categorias | Estatica | Placeholder ativo | DB (news, category) |
| /noticias/[categoria] | Listagem por categoria | Dinamica | Estrutural com validacao de slug temporario | DB (category, news) |
| /noticias/[categoria]/[slug] | Pagina de noticia | Dinamica | Estrutural | DB (news + relations) |
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
