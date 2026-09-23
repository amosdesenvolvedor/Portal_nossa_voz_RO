# AUTHENTICATION - Nossa Voz RO

## Solucao adotada

- `next-auth` (Credentials Provider)
- sessao via `JWT`
- validacao de credenciais no servidor
- senha validada por hash com `bcryptjs`

## Variaveis de ambiente

- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `DATABASE_URL`

`NEXTAUTH_URL` deve apontar para a URL canonica do ambiente. `AUTH_SECRET` deve
ser uma chave aleatoria exclusiva do ambiente e nunca ser versionada.

## Modelo de usuario

`User` recebeu campo:
- `passwordHash` (nullable)

Motivo:
- armazenar senha apenas como hash forte
- viabilizar login administrativo por credenciais sem texto puro

## Bootstrap do primeiro administrador

Script:
- `npm run admin:bootstrap`

Comportamento:
- le `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
- gera hash (`bcryptjs`)
- cria ou atualiza usuario com papel `ADMIN`
- idempotente por email (`upsert`)

Importante:
- nao ha credenciais hardcoded
- nao exibe senha em logs

## Login

Rota:
- `/admin/login`

Caracteristicas:
- formulario acessivel (labels explicitas)
- mensagem de erro generica
- sem revelar existencia de usuario

## Protecao de rotas

Middleware:
- `src/middleware.ts`
- protege `/admin/*`
- excecao: `/admin/login`
- usuario autenticado em `/admin/login` e redirecionado para `/admin`

## Validacao server-side de sessao

Layout protegido:
- `src/app/admin/(protected)/layout.tsx`

Fluxo:
- valida sessao server-side antes de renderizar conteudo administrativo
- usuario sem sessao e redirecionado para login

## Logout

- implementado via `next-auth` (`signOut`)
- redireciona para `/admin/login`

## Autorizacao

Policies centralizadas em:
- `src/lib/auth/policies.ts`

Regras principais:
- papeis suportados: `ADMIN`, `EDITOR`, `AUTHOR`
- publicacao permitida apenas para `EDITOR` e `ADMIN`
- transicoes de status validadas por policy

## Seguranca

- sem segredo em `NEXT_PUBLIC_*`
- sem autenticação baseada apenas em localStorage/cookie booleano/url
- sem senha em texto puro no banco
- sem logs de senha/token/chave
- rotas admin com `noindex` e `nofollow`

## Observacao de evolucao

Nesta etapa o fluxo editorial ainda e demonstrativo para persistencia. No Prompt 09, as acoes administrativas serao conectadas ao banco com mutacoes persistentes e auditoria completa.
