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

## Integracao administrativa implementada (Prompt 08)

Integracao ativa no painel:
- pagina administrativa de edicao inicial em `/admin/noticias/nova`
- endpoint interno protegido em `POST /api/admin/ai/suggest`

## UX editorial atualizada (Prompt 11.1)

Experiencia visual consolidada como Assistencia Editorial IA:

- IA posicionada como copiloto, sem dominar o editor
- acoes rapidas em linguagem editorial:
	- Revisar ortografia
	- Melhorar clareza
	- Sugerir titulo
	- Sugerir subtitulo
	- Resumir texto
	- Sugerir tags
- campo livre para pedidos contextuais da noticia atual
- exibicao de resultado como Sugestao separada do texto original
- acoes explicitas por sugestao:
	- Aplicar sugestao
	- Copiar
	- Descartar
	- Gerar outra sugestao
- opcao de desfazer ultima aplicacao no formulario
- no mobile, painel de IA em area dedicada acionada por botao

Regras aplicadas na integracao:
- apenas usuario autenticado do admin pode acionar IA
- permissao passa por policy centralizada de role
- protecao basica de taxa por usuario autenticado no endpoint
- prompts continuam server-side (nenhum prompt no frontend)
- resposta sempre exibida como sugestao separada
- aplicacao da sugestao exige acao explicita do editor
- falhas de IA nao apagam conteudo do formulario
- falha da IA nao bloqueia escrita, edicao, salvamento ou workflow

Garantias editoriais mantidas:
- IA nao altera status para `PUBLISHED`
- IA nao publica conteudo
- IA nao aprova conteudo
- autoridade editorial continua humana
- IA sugere, humano revisa, humano aplica, humano salva, humano autorizado publica

## Assistencia visual IA (Prompt 11.2)

Extensao implementada para fluxo de imagem editorial:
- endpoint interno protegido em `POST /api/admin/media/generate`
- estado de disponibilidade exposto no admin para nao prometer capacidade inexistente
- uso de imagem gerada depende de acao humana explicita no editor

Politica aplicada:
- nenhuma imagem gerada por IA e inserida automaticamente em noticia
- nenhuma imagem gerada por IA publica noticia automaticamente
- nenhuma transicao de workflow e disparada por sugestao visual

Comportamento sem provider multimodal configurado:
- retorno controlado com HTTP `503`
- payload com erro sem efeito colateral editorial
- proibido fallback com imagem fake/local para simular geracao real

## Validacao tecnica realizada

Teste minimo real executado no fluxo administrativo autenticado:
- uma chamada real via `POST /api/admin/ai/suggest`
- modelo utilizado: `openrouter/free`
- tarefa validada: `proofread`
- texto de entrada curto e neutro

Resultado observado:
- resposta HTTP `200`
- sugestao retornada com sucesso
- sem exposicao de segredo no cliente
- sem publicacao automatica
- sem alteracao automatica de status
- aplicacao da sugestao permanece manual (acao explicita do editor)

Observacao:
- a validacao confirma integracao funcional backend-admin-provedor no ambiente local, preservando a regra editorial: toda saida continua sendo `SUGESTAO_EDITORIAL`.