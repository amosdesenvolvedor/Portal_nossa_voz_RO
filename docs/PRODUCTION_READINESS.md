# Production Readiness Checklist (Entrada para Prompt 12)

## Estado atual

- Aplicação validada localmente com hardening de segurança, SEO e fluxo editorial.
- Este documento lista pendências que dependem de VM/infraestrutura de produção.

## Checklist obrigatório para produção

- [ ] domínio
- [ ] DNS
- [ ] PostgreSQL produção
- [ ] `DATABASE_URL` produção
- [ ] `AUTH_SECRET` produção
- [ ] `NEXTAUTH_URL` produção
- [ ] `NEXT_PUBLIC_SITE_URL` produção
- [ ] `SEO_ALLOW_INDEXING` (habilitar apenas quando validado)
- [ ] `OPENROUTER_API_KEY` em segredo de produção
- [ ] Nginx
- [ ] HTTPS
- [ ] HSTS após HTTPS validado
- [ ] systemd/process manager
- [ ] firewall
- [ ] backup com `pg_dump`
- [ ] restore test
- [ ] migration deploy
- [ ] estratégia de bootstrap/admin para produção
- [ ] external smoke test
- [ ] sitemap produção
- [ ] robots produção
- [ ] OG public fetch
- [ ] revisão de logs pós-deploy

## Pendência crítica de backup

- Prompt 09 já havia registrado indisponibilidade de `pg_dump` no ambiente.
- Prompt 11 reconfirmou que `pg_dump` continua indisponível.
- Produção **não pode ser considerada pronta** sem estratégia real de backup e teste de restauração.

## Segurança operacional pendente

- Gestão de segredos em ambiente de produção (fora de `.env` local).
- Revisão final de headers/CSP em domínio real com proxy reverso.
- Validação de políticas de retenção de logs e monitoramento.

## Observações de rollout

- Não habilitar indexação pública antes da validação final de domínio, HTTPS e robots em produção.
- Não habilitar HSTS antes de garantir HTTPS estável no domínio final.
