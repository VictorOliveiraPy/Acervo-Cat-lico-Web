# Compêndio Católico — Frontend (Next.js)

Interface de leitura do acervo católico curado em 11 categorias: **santos,
papas, concílios, milagres eucarísticos, doutores da Igreja, catecismo,
crisma, história, Nossa Senhora, livros e orações**. Consome a API do
repositório irmão
[`Compendio-Catolico-API`](https://github.com/VictorOliveiraPy/Compendio-Catolico-API).

## Como executar

Requer Node.js 18.17+.

```bash
npm install
cp .env.example .env.local   # ajuste API_URL se necessário
npm run dev
```

- App: <http://localhost:3000>
- Por padrão aponta para a API de produção em `https://acervo-cat-lico-api-jqtz.onrender.com/api`
  (ver `lib/api.ts` → `getApiBaseUrl()`).

## Comandos de desenvolvimento

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm test -- --run   # vitest
npm run build       # build de produção
npm audit           # dependências vulneráveis
```

Para pôr vídeos do estúdio (projeto `videos-py`, ao lado deste) em `/reels`, do mais novo
para o mais antigo (precisa de Node 22.18+ e FFmpeg; `npx wrangler login` uma vez antes):

```bash
R2_BUCKET=nome-do-bucket node scripts/add-reel.ts santos sao-francisco-de-assis [outro-slug...]
```

O primeiro argumento é o tema do filtro (lista em `REEL_TEMAS`, `lib/reels.ts`). O script
comprime o MP4 para 720p, envia para `reels/` no R2, grava a capa em `public/reels/` e põe
título e legenda (lidos do `.md` do estúdio) em `lib/reels.json`.

## Estrutura

```
.
├── app/                        # App Router (Next.js 14)
│   ├── page.tsx                 # home — lista de categorias
│   ├── busca/page.tsx            # busca textual
│   ├── academia/                 # Academia da Fé: índice e lições
│   └── [categoria]/
│       ├── page.tsx               # listagem paginada
│       └── [slug]/page.tsx        # detalhe de uma entrada
├── components/                 # UI (cards, navegação, paginação, etc.)
├── lib/
│   ├── api.ts                   # cliente HTTP + validação Zod das respostas
│   ├── schemas.ts                # schemas Zod espelhando os modelos do backend
│   ├── services/acervoService.ts # chamadas de alto nível por página
│   ├── search.ts / pagination.ts / entryDisplay.ts / categories.ts
│   └── *.test.ts                 # testes unitários (vitest)
└── ...config (next.config.js, tailwind.config.ts, tsconfig.json)
```

### Decisões que valem explicação

- **Validação de contrato em runtime com Zod.** Cada resposta da API passa
  por um schema Zod antes de virar prop de componente — se o backend mudar
  um formato sem avisar, o erro aparece na borda (`lib/api.ts`), não
  espalhado pela UI.
- **`apiGet<S extends ZodType>(...): Promise<z.output<S>>`.** Não
  `ZodType<T>` como parâmetro — isso forçaria `Input = Output` e quebra com
  campos `.default()` no schema (tipos diferentes ficam "unrelated" para o
  TypeScript). Ver histórico do projeto (`dev-agent`) para o caso real que
  motivou essa correção.
- **App Router + server components onde dá.** Sem client-side data fetching
  desnecessário; interatividade (`SearchField`, paginação) isolada em
  componentes client explícitos.

## Configuração

| Variável | Default (dev) | Descrição |
|---|---|---|
| `API_URL` | `https://acervo-cat-lico-api-jqtz.onrender.com/api` | Base URL da API (ver `Compendio-Catolico-API`) |

Em produção (Vercel), configure `API_URL` apontando para a URL
pública do backend no Render, com `/api` no final. Ver `DEPLOY.md`.

---

> Este repositório é o irmão de
> [`Compendio-Catolico-API`](https://github.com/VictorOliveiraPy/Compendio-Catolico-API)
> (backend FastAPI) — mesma convenção usada em `melhorperfil-api`/`melhorperfil-web`
> e `santo-guardiao-api`/`santo-guardiao-web`.
