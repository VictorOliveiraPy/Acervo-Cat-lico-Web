# Design do acervo

Decisões de cor, tipografia e composição. Os tokens vivem em
`tailwind.config.ts`, `app/globals.css` e `lib/designTokens.ts` — os três
precisam concordar; quem muda um, muda os outros na mesma tarefa.

## Conceito

O acervo é uma **biblioteca digital**, não um app. O canvas é branco puro
porque a coluna de leitura longa é o herói da tela. Superfícies neutras
frias (`surface`/`raised`) separam faixas e cards sem sombra pesada, e o
vinho litúrgico aparece só onde há ação. Bordas finas fazem a divisão
estrutural no lugar de contêineres arredondados com sombra.

## Cor

| Papel | Token | Hex | Onde |
|---|---|---|---|
| Canvas | `canvas` | `#FFFFFF` | Fundo da página |
| Superfície | `surface` | `#F7F8FA` | Cards, campos, painéis |
| Recuado | `raised` | `#EEF1F4` | Faixas, chips, skeleton |
| Filete | `border` | `#DDE1E7` | Divisão de 1px (substitui sombra) |
| Texto | `ink` | `#1A1D21` | Corpo e títulos |
| Texto 2º | `muted` | `#5A6069` | Resumos, legendas, kicker |
| Acento | `accent` | `#7A2E3A` | **Só** ação primária, link e foco |
| Acento hover | `accent.hover` | `#5E222C` | Estado de hover do acento |
| Acento active | `accent.active` | `#4A1A22` | Estado pressionado |
| Acento lavado | `accent.soft` | `#F3E4E7` | Seleção, realce de busca |
| Sucesso | `success` | `#1F6B47` | Estado positivo |
| Aviso | `warning` | `#8A5A00` | Estado de atenção |
| Erro | `danger` | `#A3322B` | Estado de erro |

Os neutros têm viés frio de propósito: sobre vidro, cinza quente lê como
papel amarelado por acidente. **O acento é único e escasso** — se outra
coisa na tela usa `#7A2E3A`, é bug. Cor semântica é separada do acento de
marca: estado nunca se confunde com identidade.

### Contraste

Todos os pares de texto passam de 4.5:1 (WCAG AA), verificado em
`lib/contrast.test.ts`. Estado nunca é comunicado só por cor — sempre com
um segundo sinal (ícone, texto, padrão).

## Tipografia

- **Destaque (títulos):** `Cormorant Garamond` (serifada) — dá o tom
  editorial e religioso ao nome dos verbetes.
- **Corpo:** `Source Sans 3` — leitura em tela, sem serifa.

Escala (usada via `text-*`): `label` 0.8125rem, `meta` 0.8125rem, `body`
1.0625rem, `lead` 1.1875rem, `title-sm` 1.375rem, `title-md` 1.75rem,
`title-lg` 2.25rem, `title-xl` 3rem. Coluna de leitura limitada a
`max-w-measure` (68ch).

## Espaçamento

Entre irmãos, sempre `flex`/`grid` + `gap` — nunca margem espalhada que
colapsa ou dobra. Tokens de casa: `band` (1.125rem, respiro do cabeçalho),
`section` (4.5rem, entre seções). Larguras: `measure` (68ch, leitura),
`shell` (76rem, cabeçalho/rodapé/grades).

## Raios e sombras

Raios pequenos: `none` (0) e `edge` (2px). O acervo é impresso, não app de
celular. **Sem sombras** no cromo: profundidade vem de espaço e do filete
de 1px.

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
