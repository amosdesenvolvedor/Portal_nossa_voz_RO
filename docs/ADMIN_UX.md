# ADMIN UX - Nossa Voz RO

## Objetivo

Refinar a experiencia do painel administrativo para uso editorial diario com aprendizado rapido, foco em conteudo e apoio de IA como copiloto.

## Referencia de familiaridade

A interacao foi desenhada com referencia de familiaridade de apps de comunicacao modernos:

- navegacao clara
- lista facil de escanear
- area principal de trabalho
- acoes contextuais
- feedback imediato

A implementacao NAO copia identidade visual de terceiros. A marca e os tokens do Nossa Voz RO foram preservados.

## Diagnostico da UX anterior

Problemas encontrados antes da mudanca:

- linguagem excessivamente tecnica e com textos de etapa/prototipo
- lista de noticias densa (tabela pesada no desktop)
- experiencia de edicao nao unificada entre criar e editar noticia
- acao Nova noticia sem destaque suficiente
- assistencia de IA util, mas com descoberta e contexto pouco amigaveis
- feedback de status pouco humano para fluxo editorial diario

## Nova arquitetura visual

### Desktop

- shell com sidebar agrupada por contexto: Editorial, Organizacao e Sistema
- acao + Nova noticia destacada na navegacao
- home editorial com saudacao e acoes diretas
- area de edicao priorizando conteudo e fluxo de rascunho/revisao/publicacao
- assistencia editorial IA em painel lateral recolhivel

### Tablet

- layout adaptado para uma coluna principal com assistencia acessivel sem comprimir campos
- filtros e listas em formato de leitura simples

### Mobile

- editor ocupa a area principal
- botao Assistencia IA explicito
- painel de IA em sheet de base com fechamento simples
- retorno ao editor sem perda de estado local do formulario

## Navegacao

- sidebar com hierarquia editorial
- drawer mobile com mesmas secoes da navegacao principal
- caminhos principais sempre visiveis:
  - Painel
  - Noticias
  - Nova noticia
  - Revisao

## Nova noticia (pagina principal)

Melhorias aplicadas:

- cabecalho de contexto com status e indicador de alteracoes nao salvas
- acao primaria Salvar rascunho sempre acessivel
- workflow em acoes contextuais (Enviar para revisao, Publicar, Arquivar, Voltar para rascunho)
- secoes claras:
  - Conteudo
  - Classificacao
  - Corpo da noticia
- titulo com maior destaque visual
- corpo com largura confortavel para escrita

## Assistencia Editorial IA

A experiencia foi centralizada no editor de Nova noticia e Edicao:

- nome visual: Assistencia Editorial IA
- mensagem de acolhimento curta e objetiva
- acoes rapidas:
  - Revisar ortografia
  - Melhorar clareza
  - Sugerir titulo
  - Sugerir subtitulo
  - Resumir texto
  - Sugerir tags
- campo livre para pedido contextual
- resultado exibido como Sugestao, sem alteracao automatica
- acoes sobre sugestao:
  - Aplicar sugestao
  - Copiar
  - Descartar
  - Gerar outra sugestao
- opcao de desfazer ultima aplicacao
- estados de feedback com aria-live para processamento/sucesso/erro

## Estados editoriais e workflow

Os estados continuam os mesmos, com labels em portugues:

- DRAFT -> Rascunho
- IN_REVIEW -> Em revisao
- PUBLISHED -> Publicado
- ARCHIVED -> Arquivado

As transicoes continuam server-side e sob policy existente.

## Acessibilidade e interacao

Ajustes principais:

- foco visivel em links, botoes e campos
- alvos de toque adequados para acoes principais
- feedback textual de status e erros
- anuncios discretos via aria-live em eventos da IA e do salvamento
- hierarquia visual simplificada para leitura por novos usuarios

## Seguranca e limites preservados

Nenhuma alteracao de regra de negocio:

- autenticacao e autorizacao mantidas
- workflow editorial mantido
- endpoints e hardening preservados
- OPENROUTER_API_KEY permanece server-side
- sem publicacao automatica por IA
- sem persistencia automatica de sugestao de IA

## Decisoes responsivas

- Desktop: IA lateral persistente e recolhivel
- Tablet: layout simplificado e sem esmagar o editor
- Mobile: IA em painel acionavel, editor como area principal
