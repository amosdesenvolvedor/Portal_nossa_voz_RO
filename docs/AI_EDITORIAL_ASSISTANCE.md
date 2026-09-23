# AI EDITORIAL ASSISTANCE - Nossa Voz RO

## Finalidade

Preparar uma camada server-side de assistencia editorial para apoiar o futuro painel administrativo sem expor segredo ao navegador e sem permitir publicacao automatica.

## Provedor inicial

- OpenRouter

## Variaveis de ambiente

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

Valor inicial sugerido para modelo:
- `openrouter/free`

## Arquitetura

Diretorio:
- `src/lib/ai`

Arquivos:
- `config.ts`: provider, model, timeout, limites de entrada e endpoint
- `types.ts`: contratos tipados de request, result e erro controlado
- `openrouter.ts`: comunicacao HTTP server-side com o provedor
- `editorial.ts`: regras editoriais, prompts e servico de sugestao

## Funcoes permitidas nesta etapa

- sugerir titulo
- sugerir subtitulo
- resumir texto
- revisar ortografia
- melhorar clareza
- sugerir tags
- produzir rascunho inicial a partir de informacoes fornecidas pelo editor

## Funcoes proibidas nesta etapa

- publicacao automatica
- alteracao automatica de conteudo publicado
- scraping automatico
- coleta automatica de noticias
- postagem automatica
- geracao periodica autonoma

## Regra editorial obrigatoria

- IA gera apenas `SUGESTAO_EDITORIAL`
- humano revisa
- humano decide
- humano publica

## Seguranca

- `OPENROUTER_API_KEY` existe apenas no servidor
- nenhuma chave publica `NEXT_PUBLIC_*`
- nenhum acesso ao provedor em componentes React
- nenhum segredo em fixture, logs ou localStorage
- a pagina publica de noticia nao depende do servico de IA para renderizar

## Tratamento de erros

Erros controlados previstos:
- `UNCONFIGURED`
- `INVALID_INPUT`
- `INPUT_TOO_LARGE`
- `TIMEOUT`
- `UNAUTHORIZED`
- `RATE_LIMITED`
- `MODEL_UNAVAILABLE`
- `INVALID_RESPONSE`
- `PROVIDER_ERROR`

Falhas do provedor retornam resultado controlado, sem quebrar a aplicacao publica.

## Limites e configuracao

- provider centralizado: `openrouter`
- modelo centralizado por ambiente
- timeout centralizado
- limite de texto de entrada
- limite de contexto adicional
- limite de saida do provedor

## Prompt editorial de seguranca

O servico instrui explicitamente a IA a:
- nao inventar nomes
- nao inventar numeros
- nao inventar datas
- nao inventar declaracoes
- nao inventar fontes
- nao inventar acontecimentos
- nao transformar hipotese em fato
- sinalizar falta de informacao em vez de preencher lacunas

## Integracao futura com painel

Fluxo previsto:
1. editor envia texto/base factual ao backend autenticado
2. backend chama `requestEditorialSuggestion`
3. resposta volta como sugestao editavel
4. conteudo final so pode ser salvo/publicado por usuario humano autorizado

Direcao futura:
- registrar `isAiAssisted = true` quando sugestoes forem efetivamente aproveitadas
- trocar provedor mantendo o contrato de `editorial.ts`