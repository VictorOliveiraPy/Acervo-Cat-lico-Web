# Compêndio Católico — front (Next.js)

Site em https://compendio-catolico.com. A API fica em `../Acervo-Cat-lico-API`.
Português na raiz; espanhol e inglês em `/es` e `/en` (`lib/i18n.ts`).

## Comandos

```bash
npm run typecheck        # tsc
npm run lint
npm test -- --run        # unitários (Vitest)
npm run test:e2e         # jornadas no navegador (Playwright); sobe o site sozinho
npm run test:mutation    # testes mutantes (Stryker) nas regras de lib/
deploy/publicar.sh web   # publica o front na VPS (api / sem argumento: tudo)
```

Se `cd` falhar com `fnm: command not found`, rode os binários direto:
`node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`.

## Como trabalhar

**TDD em três camadas.** O teste vem antes do código:
- **Unitário** para regra de negócio: funções puras em `lib/` (ex.: `lib/conquistas.ts`
  e `lib/conquistas.test.ts`). Lógica nova sai do componente para `lib/` e ganha teste.
- **Integração** fica na API (`tests/interface` de lá), onde as rotas são testadas.
- **E2E** para jornadas: `e2e/*.spec.ts`. Feature nova que muda uma jornada ganha
  ou ajusta um teste ali.

**Testes mutantes** dizem se os testes pegam erro de verdade. Depois de mexer numa
regra de `lib/`, rode `npm run test:mutation` e mate os mutantes que sobreviverem
naquele arquivo (teste novo, não `// Stryker disable`).

**Pronto** é: typecheck, lint, unitários e E2E passando, e a mudança vista no site
rodando quando ela for visual.

## Modelos e subagentes

- Edição de código fica no modelo principal (Opus 5.5). Comece em esforço `medium`;
  suba para `high` antes de trocar de modelo.
- Leitura barata vai para os subagentes Haiku de `.claude/agents/`:
  `explorador` (achar onde algo está) e `leitor-de-logs` (resumir saída de teste e build).
  Assim o contexto principal fica enxuto.
- Trabalho paralelo e independente (outra feature, outro repositório) vai para um
  worker do Orca, cada um no seu worktree.

## Cuidados

- Tudo que é texto da interface existe em pt, es e en (`lib/i18n.ts`); o dicionário
  tipado não compila se faltar chave.
- `middleware.ts` só deixa passar caminhos conhecidos (`lib/routing.ts`): rota nova
  precisa entrar lá.
- O perfil não guarda dado novo sem passar pela API; conquistas e afins são calculados
  do que o perfil já tem.
