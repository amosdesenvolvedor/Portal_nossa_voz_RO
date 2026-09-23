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
- a validacao de permissao de transicao ja ocorre server-side em endpoint administrativo demonstrativo
- persistencia definitiva do workflow sera conectada no Prompt 09

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

## Fixtures temporarias

Fonte temporaria centralizada:
- `src/data/admin-demo.ts`

Uso:
- dashboard
- listagens administrativas
- filas de revisao
- paginas estruturais de categorias/municipios/tags/autores

Nao representa persistencia real.

## Integracao com Prompt 09

Esta etapa deixa preparado:
- auth e sessao administrativas
- policies de papel e workflow
- shell e navegacao do admin
- pontos de integracao para CRUD real
- editor estruturado para persistencia em banco
- assistencia de IA integrada ao painel

Prompt 09 conectara:
- repositories/services
- queries/mutations
- CRUD persistente
- workflow persistente
- auditoria persistente
