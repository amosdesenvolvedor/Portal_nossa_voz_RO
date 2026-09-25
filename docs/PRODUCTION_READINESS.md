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
- [ ] provider de storage de mídia em produção (S3/R2/GCS ou equivalente)
- [ ] credenciais de storage em segredo de produção
- [ ] permissões de escrita/leitura validadas para mídia
- [ ] política de lifecycle/retention para mídia editorial
- [ ] estratégia de backup/replicação para ativos de mídia
- [ ] dependência nativa de processamento de imagem (`sharp`) validada na VM/container
- [ ] monitoramento de erro para upload/processamento de mídia

## Pendência crítica de backup

- Prompt 09 já havia registrado indisponibilidade de `pg_dump` no ambiente.
- Prompt 11 reconfirmou que `pg_dump` continua indisponível.
- Produção **não pode ser considerada pronta** sem estratégia real de backup e teste de restauração.

## Segurança operacional pendente

- Gestão de segredos em ambiente de produção (fora de `.env` local).
- Revisão final de headers/CSP em domínio real com proxy reverso.
- Validação de políticas de retenção de logs e monitoramento.

## Prompt 11.2 - observações de mídia editorial

- O banco não armazena binário de imagem; apenas metadados e chaves de storage.
- Produção exige storage externo durável para mídia; diretório local é apenas estratégia de desenvolvimento.
- Fluxo de blur depende de persistência de variações públicas e preservação do original privado.

## Observações de rollout

- Não habilitar indexação pública antes da validação final de domínio, HTTPS e robots em produção.
- Não habilitar HSTS antes de garantir HTTPS estável no domínio final.
