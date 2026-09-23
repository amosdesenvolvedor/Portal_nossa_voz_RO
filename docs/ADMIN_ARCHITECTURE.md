# ADMIN ARCHITECTURE - Nossa Voz RO

## Objetivo

Estabelecer a fundacao do painel administrativo editorial em `/admin`, separado da experiencia publica, com autenticacao real, controle por papeis e fluxo editorial seguro.

## Separacao publico/admin

- area publica: `/`
- area administrativa: `/admin`

A area administrativa possui shell proprio e nao reutiliza `PublicHeader`/`PublicFooter`.

## Rotas administrativas desta etapa

- `/admin/login`
- `/admin`
- `/admin/noticias`
- `/admin/noticias/nova`
- `/admin/noticias/[id]`
- `/admin/revisao`
- `/admin/categorias`
- `/admin/municipios`
- `/admin/tags`
- `/admin/autores`
- `/admin/publicidade`
- `/admin/configuracoes`

## Shell administrativo

Componentes principais:
- `AdminShell`
- `AdminSidebarNav`
- `AdminMobileNav`
- `AdminSignOutButton`
- `AdminPageHeader`
- `AdminStatusBadge`

Diretrizes aplicadas:
- foco em clareza e produtividade
- sidebar para desktop
- menu mobile para navegacao rapida
- identificacao de usuario e papel
- logout funcional

## Workflow editorial

Estados tecnicos preservados:
- `DRAFT`
- `IN_REVIEW`
- `PUBLISHED`
- `ARCHIVED`

Rotulos na UI:
- Rascunho
- Em revisao
- Publicado
- Arquivado

Transicoes centralizadas em policy:
- `DRAFT -> IN_REVIEW`
- `IN_REVIEW -> DRAFT`
- `IN_REVIEW -> PUBLISHED`
- `PUBLISHED -> ARCHIVED`
- `ARCHIVED -> DRAFT`

Observacao:
- a validacao de permissao de transicao ocorre server-side
- as transicoes agora persistem no banco e geram trilha de auditoria

## Roles e autorizacao

Papeis suportados:
- `ADMIN`
- `EDITOR`
- `AUTHOR`

Policies centralizadas em `src/lib/auth/policies.ts`:
- acesso administrativo
- uso de assistencia por IA
- permissao de publicacao
- transicoes de status permitidas por papel

Regra aplicada:
- `AUTHOR` nao publica
- `EDITOR` e `ADMIN` sao papeis publicadores

## Noticias administrativas

`/admin/noticias`:
- listagem com status, categoria, autor, municipio e atualizacao
- filtros visuais para status, municipio e autor
- versao desktop em tabela
- versao mobile em cards

`/admin/noticias/nova`:
- formulario editorial inicial
- bloco de dados principais
- edicao de corpo estruturado por blocos tipados
- acoes de workflow demonstrativas com validacao server-side de permissao

`/admin/noticias/[id]`:
- pagina estrutural para detalhe por identificador

## Editor por blocos

Compatibilidade preservada com:
- `paragraph`
- `heading`
- `list`
- `quote`

Capacidades implementadas:
- adicionar bloco
- editar bloco
- remover bloco
- mover para cima/baixo

Nao foi adotado HTML arbitrario nem `dangerouslySetInnerHTML`.

## Assistencia por IA no admin

Endpoint interno protegido:
- `POST /api/admin/ai/suggest`

Fluxo:
1. editor aciona a tarefa
2. servidor valida autenticacao/autorizacao
3. servidor chama camada de IA existente (`requestEditorialSuggestion`)
4. resposta volta como sugestao separada
5. editor decide se aplica manualmente ao campo alvo

Regras preservadas:
- IA nao publica
- IA nao altera status editorial
- IA nao sobrescreve conteudo automaticamente

Tratamento de erro:
- falha de configuracao
- timeout
- limite
- modelo indisponivel
- falhas do provedor

Mensagem de preservacao de conteudo:
- em erro de IA, texto do editor permanece intacto

## Protecao basica de uso da IA

Foi adicionada limitacao em memoria por usuario autenticado no endpoint administrativo para reduzir abuso na etapa atual.

Observacao:
- controle distribuido/robusto sera evoluido em infraestrutura futura

## Persistencia administrativa atual (Prompt 09)

Camada de servico:
- `src/lib/services/editorial-service.ts`

Validacao de payload:
- `src/lib/editorial/validation.ts`

Normalizacao de erros HTTP:
- `src/lib/utils/http-errors.ts`

Endpoints administrativos persistentes:
- `GET/POST /api/admin/news`
- `GET/PATCH /api/admin/news/[id]`
- `POST /api/admin/news/[id]/workflow`
- `GET/POST /api/admin/categories`
- `PATCH /api/admin/categories/[id]`
- `GET/POST /api/admin/municipalities`
- `PATCH /api/admin/municipalities/[id]`
- `GET/POST /api/admin/tags`
- `PATCH /api/admin/tags/[id]`
- `GET/POST /api/admin/authors`
- `PATCH /api/admin/authors/[id]`

Auditoria:
- eventos persistidos em `EditorialAuditEvent` para criacao, atualizacao e mudancas de status

Regra preservada:
- IA segue apenas como assistencia; publicacao continua sendo acao humana autorizada
