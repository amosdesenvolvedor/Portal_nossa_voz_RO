# Security Hardening (Prompt 11)

## Escopo

Hardening aplicado sobre autenticação, autorização, validação, headers, CSP, proteção de origem, rate limiting, cache, XSS, IDOR e preparação para produção sem alterar a arquitetura editorial existente.

## Superfície de ameaça (resumo)

- Painel admin (`/admin/**`) e APIs administrativas (`/api/admin/**`)
- Fluxo editorial de criação/edição/publicação
- Login com credenciais (NextAuth)
- Endpoint de IA (`/api/admin/ai/suggest`)
- Renderização pública de conteúdo editorial persistido

## Controles implementados

## Autenticação e sessão

- Mantida estratégia JWT do NextAuth com campos mínimos de sessão (`id`, `name`, `email`, `role`).
- Login com erro genérico (sem enumeração por mensagem).
- `callback` de redirect endurecido para bloquear open redirect cross-origin.
- `useSecureCookies` explícito em produção.
- Rate limiting de tentativas de login (janela local em memória por email+IP).

## Autorização server-side

- Correção de IDOR em notícias:
  - listagem admin agora respeita escopo do autor (apenas itens próprios para `AUTHOR`).
  - leitura por ID respeita escopo do ator quando não privilegiado.
  - edição por ID exige ownership (`createdById`/`authorId`) para `AUTHOR`.
- Transição de workflow exige policy + ownership para não privilegiados.
- Mutations de categorias/tags/municípios/autores restritas a `EDITOR`/`ADMIN`.

## Mass assignment / workflow bypass

- Bloqueado envio arbitrário de campos sensíveis em mutations de notícia por seleção explícita server-side.
- Atualização comum não altera status de publicação.
- Campos de auditoria/publicação seguem derivados server-side.
- `AUTHOR` não consegue reatribuir autoria livremente durante update.

## CSRF/origin/content-type

- Guardas em mutations administrativas:
  - validação de origem (comparação `Origin` vs `Host` + `Sec-Fetch-Site` quando presente).
  - exigência de `Content-Type: application/json` em endpoints JSON mutáveis.

## Rate limiting

- Login: rate limit local por email+IP.
- Mutations administrativas: rate limit local por usuário/escopo.
- IA: rate limit local por usuário (`/api/admin/ai/suggest`).

Observação: implementação local em memória é adequada para single-instance atual; em múltiplas instâncias exigirá storage compartilhado.

## Headers de segurança e CSP

- Implementado no middleware:
  - `Content-Security-Policy`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy`
- HSTS aplicado somente em produção quando requisição HTTPS (`x-forwarded-proto=https`).
- `next.config.ts`: `poweredByHeader: false`.

## Cache e privacidade de resposta

- Respostas de APIs administrativas passam a `private, no-store`.
- Erros retornados ao cliente permanecem sanitizados (`INTERNAL_ERROR` sem stack).

## XSS, links e JSON-LD

- Renderização editorial continua por blocos estruturados (sem HTML arbitrário).
- Links externos com `target="_blank"` agora usam `rel="noopener noreferrer"`.
- JSON-LD mantém serialização segura com escaping (`\u003c`) para evitar breakout de `<script>`.

## Segredos

- `AUTH_SECRET` e `OPENROUTER_API_KEY` seguem em contexto server-side.
- Nenhum segredo intencional foi adicionado ao client bundle.

## Validação de ambiente em produção

- Guard em middleware para falhar de forma segura (503) quando variáveis críticas de produção estiverem ausentes:
  - `AUTH_SECRET`
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXT_PUBLIC_SITE_URL`

## Testes de segurança executados neste prompt

- Não autenticado:
  - `/admin` redireciona para login.
  - `/api/admin/news` retorna 401.
- Login:
  - erro para credencial inválida e email inexistente é indistinguível (401 + `CredentialsSignin`).
  - callback externo em login/logout retorna fallback seguro para origem local.
- Origin/CSRF:
  - mutation com `Origin` incompatível retorna 403.
- Content-Type:
  - mutation com `text/plain` retorna 415.
- Input inválido:
  - payload malformado retorna 400 `VALIDATION_ERROR`.
- Mass assignment:
  - tentativa de injetar `status/publishedById/createdById` em create/update não é aplicada.
- Workflow bypass:
  - update comum não força publicação (`status` permanece `DRAFT`).
- IDOR:
  - `AUTHOR` tentando editar notícia de terceiro via ID recebe 403 e banco permanece inalterado.
- Author publish forbidden:
  - `AUTHOR` tentando publicar recebe 403 e notícia permanece `IN_REVIEW`.
- Rate limiting:
  - IA retorna 429 após janela controlada de tentativas.
  - login bloqueia tentativa válida após sequência de inválidas na mesma janela.
- XSS/JSON-LD:
  - payload de teste renderizado como texto escapado.
  - teste de `</script>` no título não quebra script JSON-LD.

## Dependências e riscos remanescentes

- `npm audit` aponta vulnerabilidades em `next`/`postcss` e `sharp`.
- Correção automática disponível para `next` exige major (`16.x`), adiada por risco de regressão fora do escopo deste prompt.
- `sharp` permanece pendente de atualização compatível validada.

## Limitações conhecidas

- Sem rate limit distribuído (somente memória local).
- Sem WAF/IDS/observabilidade avançada neste prompt.
- Sem hardening de infraestrutura (TLS/Nginx/firewall/systemd), reservado para Prompt 12.
