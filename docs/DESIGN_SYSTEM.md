# DESIGN SYSTEM - Nossa Voz RO

## 1. Identidade da marca

Nome: Nossa Voz RO
Slogan: A VOZ DE QUEM VIVE AQUI

Direcao visual:
- credibilidade
- clareza
- proximidade com a comunidade
- identidade regional de Rondonia
- linguagem jornalistica profissional

## 2. Logo

Arquivo oficial integrado:
- public/brand/nossa-voz-ro.png

Detalhes tecnicos:
- formato: PNG (RGBA)
- dimensoes: 1200 x 400
- proporcao: 3:1
- componente reutilizavel: BrandLogo (`src/components/brand/BrandLogo.tsx`)
- uso atual: Header, Footer, Home provisoria e pagina /design-system

Regras:
- manter proporcao 3:1
- nao redesenhar ou substituir identidade oficial
- nao alterar paleta original da marca na imagem
- evitar recortes que removam elementos essenciais da marca

## 3. Paleta oficial (tokens de marca)

Tokens centrais em CSS custom properties:
- --color-brand-primary: #075B49
- --color-brand-secondary: #087E5B
- --color-brand-accent: #F5A900
- --color-brand-accent-light: #FFD447
- --color-text-primary: #17332D
- --color-text-muted: #47736A
- --color-canvas: #F7FBF8
- --color-surface: #FFFFFF

## 4. Cores semanticas

- --color-semantic-success
- --color-semantic-info
- --color-semantic-warning
- --color-semantic-danger
- --color-border-default
- --color-border-strong
- --color-text-disabled
- --color-overlay

Uso:
- semanticas sao auxiliares de estado
- identidade continua priorizando verde e amarelo

## 5. Tipografia

Fonte principal:
- Geist via next/font

Escala:
- display
- h1
- h2
- h3
- h4
- body-lg
- body
- body-sm
- caption

Implementacao:
- tamanhos responsivos com clamp para titulos principais
- classes utilitarias text-display, text-h1, text-h2, text-h3, text-h4, text-body-lg, text-body-sm, text-caption

## 6. Espacamento e container

Tokens:
- --gutter
- --gutter-lg
- --container-max
- --reading-max

Componente:
- Container usa classe container-site para largura controlada em mobile, tablet, desktop e telas amplas

## 7. Radius e bordas

Tokens:
- --radius-sm
- --radius-md
- --radius-lg
- --radius-card

Diretriz:
- arredondamento discreto para linguagem de portal jornalistico

## 8. Sombras

Tokens:
- --shadow-soft
- --shadow-card
- --shadow-elevated

Uso:
- sombras sutis
- hierarquia depende principalmente de espacamento e contraste

## 9. Componentes base desta etapa

- Button: variantes primary, secondary, outline, ghost; estados hover, focus-visible, active e disabled; suporte a icones
- Badge: variantes category, municipality, tag e status
- Container: controle de largura e gutters
- SectionHeading: estrutura padrao para secoes
- Divider: divisor visual simples
- NewsCard: base de noticia com ou sem imagem, metadata e badges

## 10. Links

Padrao:
- links com sublinhado visivel
- hover com variacao de cor
- visited configurado
- foco visivel para teclado

## 11. Acessibilidade

Medidas aplicadas:
- foco visivel em elementos interativos
- contraste priorizado para leitura
- uso de HTML semantico
- botoes disabled com estado visual claro
- botao apenas com icone exige aria-label no uso
- imagem no card com alt definido

## 12. Responsividade

Abordagem:
- mobile-first
- grids adaptativos em /design-system
- titulos com escala responsiva
- cards testados para empilhamento em telas pequenas

## 13. Estrategia para dark mode

Estado atual:
- tema claro como padrao

Preparacao:
- tokens .dark ja definidos para fundo, superficie, texto, bordas e overlay
- componentes consomem tokens, facilitando futura chave de tema sem refatoracao ampla

## 14. Rota de validacao

Rota interna:
- /design-system

Objetivo:
- validar rapidamente paleta, tipografia, botoes, badges, links, headings e news cards antes da Home final (Prompt 04)

## 15. Evolucao editorial reutilizavel (Prompt 05)

`/design-system` passou a validar tambem:
- variantes de `NewsCard` (standard, horizontal, compact)
- `EditorialMeta`
- `EditorialByline`
- `EditorialTagList`
- `EditorialImageCaption`
- `EditorialEmptyState`
- `EditorialPagination`

Referencia:
- `docs/EDITORIAL_COMPONENTS.md`
