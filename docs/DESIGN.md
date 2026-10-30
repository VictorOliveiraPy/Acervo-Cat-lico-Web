# Design do acervo

Decisões de cor, tipografia e composição. Os tokens vivem em
`tailwind.config.ts`, `app/globals.css` e `lib/designTokens.ts` — os três
precisam concordar; quem muda um, muda os outros na mesma tarefa.

## Conceito

Gótico histórico **minimalista**: editorial e institucional, com tipografia
serifada, geometria controlada e cor sóbria. Nada de dark fantasy, anime, RPG
ou pergaminho. A referência aprovada é o Design System 1.0 do Compêndio; a
leitura e a formação vêm antes da decoração. A navegação é superior, sem
sidebar global: o único índice lateral é o sumário contextual do artigo.

## Cor

| Papel | Token | Hex | Onde |
|---|---|---|---|
| Canvas | `canvas` | `#F3F4F1` | Fundo da página |
| Superfície | `surface` | `#FBFCF9` | Cards, painéis |
| Elevado | `raised` | `#FFFFFF` | Campos, rodapé |
| Filete | `border` | `#D2D9D6` | Divisão de 1px |
| Filete forte | `border.strong` | `#AEB9B6` | Campos, botão secundário |
| Texto | `ink` | `#253039` | Corpo e títulos |
| Texto 2º | `ink.muted` | `#41505A` | Resumos, legendas, kicker |
| Acento | `accent` | `#8C313E` | Ação primária, link, foco, `.eyebrow` |
| Acento hover | `accent.hover` | `#722632` | Hover e pressionado |
| Acento lavado | `accent.soft` | `#F5E9EB` | Seleção, realce de busca |
| Azul mineral | `mineral` | `#263E4D` | Bloco da Academia, véu de banner |
| Sucesso | `success` / `.soft` | `#326D51` / `#E7F2EB` | Acerto no exercício |
| Aviso | `warning` / `.soft` | `#7A5210` / `#F6EEDD` | Nota editorial |
| Erro | `danger` / `.soft` | `#973027` / `#F6E3E1` | Falha e resposta errada |

Cor semântica é separada do acento de marca: estado nunca se confunde com
identidade.

### Contraste

Todos os pares de texto passam de 4.5:1 (WCAG AA), verificado em
`lib/designTokens.test.ts`, que também confere se os valores batem com o
Tailwind. Estado nunca é comunicado só por cor: sempre há texto ou ícone junto.
Link dentro de parágrafo leva sublinhado.

## Tipografia

- **Destaque (títulos e texto de leitura):** `EB Garamond`, carregada do próprio
  repositório.
- **Interface:** pilha sans-serif de sistema (`Inter` quando instalada).

Escala (usada via `text-*`): `label` 0.75rem, `meta` 0.8125rem, `body`
1.0625rem, `lead` 1.1875rem, `title-sm` 1.375rem, `title-md` 1.75rem,
`title-lg` 2.25rem, `title-xl` 3rem. Coluna de
leitura limitada a `max-w-measure` (68ch).

## Componentes

Classes em `app/globals.css`, para uso direto no JSX:

- `.btn` + `.btn-primary`, `.btn-secondary` ou `.btn-on-mineral`; `.btn-tertiary`
  para a ação de texto. Uma só ação primária por região de decisão.
- `.eyebrow` abre seção (bordô); `.kicker` rotula metadados (neutro).
- `.reading-column` é o corpo do artigo, em serifa.

Primitivas editoriais em `components/Editorial.tsx`: cabeçalho de página, nota,
ficha, tags, referências, sumário e mensagem de estado.

## Santos

Registro explícito em `lib/saintAssets.ts`, indexado pelo **slug do verbete na
API**. Só entram artes com revisão de iconografia; os demais lotes do kit ficam
em `SAINT_CATALOG` como pendentes e não aparecem no site.

- Avatar (círculo de até 96px): listas, destaque da home e contexto da lição.
- Card 320×400: galeria em `/santos` e amostra da home.
- Retrato (no máximo 16rem de largura): no próprio verbete, nunca como herói.

Com arte revisada, a ilustração **substitui** a imagem antiga na tela. `og:image`
e JSON-LD continuam com a imagem do acervo, a que os buscadores já conhecem.

## Academia da Fé

Lições em `lib/academia.ts`; progresso só no `localStorage`
(`lib/academiaProgress.ts`), porque não há contas nem backend de aulas. Regras
fixas: artigos nunca dependem de lição, login opcional, pontos só por exercício
(no perfil e no ranking público, por opção da pessoa), oração fora da progressão. Lição com `review: "pending"` fica com `noindex`, fora do
sitemap e com aviso visível até a revisão humana.

## Espaçamento

Entre irmãos, sempre `flex`/`grid` + `gap` — nunca margem espalhada que
colapsa ou dobra. Tokens de casa: `band` (1.125rem, respiro do cabeçalho),
`section` (4.5rem, entre seções). Larguras: `measure` (68ch, leitura),
`shell` (76rem, cabeçalho/rodapé/grades).

## Raios e sombras

Raios: `edge` (5px) em controles, `panel` (9px) em cartões, `feature` (16px).
A profundidade vem de espaço e do filete de 1px; a única sombra, `soft`, é
reservada a overlays flutuantes.

## Regras de uso

1. Um elemento repetido (card de lista, linha de tabela) é o **mesmo**
   objeto: mesma borda, mesmo padding, mesma baseline. Um card diferente
   dos irmãos é bug visual.
2. Nem tudo é card. Borda e preenchimento dizem "objeto separado" — gaste
   por papel, não carimbe em todo bloco.
3. A ação primária de uma tela é o alvo maior e mais isolado; configuração
   rara fica atrás de "Mais opções".
4. Foco sempre visível, com o próprio acento (`:focus-visible` em
   `globals.css`). Nada de cor nova só para foco.
5. Copy nomeia as coisas como o usuário pensa nelas; erro explica o que
   deu errado **e** como resolver.
