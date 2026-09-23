# HOME ARCHITECTURE - Nossa Voz RO

## Objetivo

Definir a composicao da Home publica com hierarquia jornalistica, sem dependencia de banco nesta fase.

## Fonte de dados temporaria

Arquivo:
- `src/data/home-demo.ts`

Caracteristicas:
- dados demonstrativos tipados
- sem fatos reais sensiveis
- sem aleatoriedade em runtime
- estrutura pronta para substituicao por queries futuras
- campos `publishedAtISO` adicionados para metadados deterministas em componentes reutilizaveis

## Hierarquia editorial implementada

1. Manchete principal (FeaturedStory)
2. Destaques secundarios
3. Ultimas noticias (cronologia)
4. Nossa regiao (foco territorial)
5. Slot publicitario intermediario
6. Bloco de municipios
7. Editorias em destaque (Politica, Agricultura, Policia)
8. Entradas de Empregos e Classificados
9. Chamada para mais noticias

Em desktop:
- conteudo principal + sidebar

Em mobile:
- fluxo de coluna unica com prioridade editorial preservada

## Componentes da Home

- `FeaturedStory`
- `LatestNewsList`
- `CategorySection`
- `MunicipalityDirectory`
- `AdSlot`

Componentes reutilizados:
- `Container`
- `SectionHeading`
- `NewsCard`
- `Divider`
- `Badge`
- `EditorialMeta`

## Publicidade (estrutura)

Slots preparados:
- HOME_TOP
- HOME_MIDDLE
- SIDEBAR

Estado atual:
- apenas marcadores visuais "Espaco publicitario"
- sem integracao com rede de anuncios

## Curadoria futura

A estrutura foi organizada para permitir, futuramente:
- definicao de manchete principal
- ordenacao de destaques
- controle de secoes exibidas
- configuracao de banners
- curadoria por Marcos no painel

## Comportamento com poucos conteudos

A composicao aceita listas com quantidade variavel (1, 2 ou varias entradas) sem depender de contagem fixa para renderizar secoes principais.

## Integracao futura com banco

Estrategia prevista:
- substituir `home-demo.ts` por camada de consulta (services/repositories)
- preservar contratos de dados por tipo para minimizar refatoracao de UI
- preservar camada editorial reutilizavel documentada em `docs/EDITORIAL_COMPONENTS.md`
