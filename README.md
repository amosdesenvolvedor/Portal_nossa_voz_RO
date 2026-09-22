# Nossa Voz RO

Portal jornalistico regional de Rondonia.

Slogan: A VOZ DE QUEM VIVE AQUI

## Stack

- Next.js (App Router)
- TypeScript (strict)
- React
- Tailwind CSS
- PostgreSQL
- Prisma ORM

## Requisitos

- Node.js 18.18+ (recomendado 20+ em ambiente de producao)
- npm 9+

## Configuracao inicial

1. Instale dependencias:

```bash
npm install
```

2. Configure ambiente:

```bash
cp .env.example .env
```

3. Ajuste a string de conexao `DATABASE_URL` no arquivo `.env`.

4. Gere o cliente Prisma:

```bash
npm run prisma:generate
```

5. Rode localmente:

```bash
npm run dev
```

## Scripts

- `npm run dev` inicia ambiente local
- `npm run build` gera build de producao
- `npm run start` executa build
- `npm run lint` executa lint
- `npm run typecheck` valida TypeScript
- `npm run prisma:generate` gera cliente Prisma
- `npm run prisma:studio` abre Prisma Studio

## Documentacao tecnica

Arquitetura inicial em `docs/PROJECT_ARCHITECTURE.md`.
