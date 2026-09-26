/**
 * Tokens de design do acervo — cor, tipografia e a matemática de contraste.
 *
 * Fonte única de verdade para tudo que NÃO passa por class utilitária do
 * Tailwind: metadados (`themeColor`), `ImageResponse`/Satori, testes de
 * contraste, manifest. Os mesmos valores vivem em `tailwind.config.ts` e em
 * `app/globals.css` — se um mudar, os outros mudam na mesma tarefa.
 *
 * Cores nomeadas por PAPEL (`canvas`, `surface`, `accent`), nunca por valor:
 * um componente pede "a superfície do card", não "o cinza #EEF1F4".
 */

export const COLORS = {
  // Superfícies, do mais claro ao mais recuado.
  /** Fundo da página. Branco puro: a coluna de leitura longa é o herói. */
  canvas: "#FFFFFF",
  /** Cards, campos, painéis. */
  surface: "#F7F8FA",
  /** Faixas recuadas, chips, skeleton. */
  raised: "#EEF1F4",

  // Linhas.
  /** Filete visível de 1px que substitui a sombra. */
  border: "#DDE1E7",
  /** Divisória mais marcada, sem virar preto. */
  borderStrong: "#C4CAD3",

  // Texto.
  /** Corpo e títulos. */
  ink: "#1A1D21",
  /** Texto secundário: resumos, legendas, kicker. */
  muted: "#5A6069",

  // Acento único: o vinho litúrgico. Só ação primária, link e foco.
  accent: "#7A2E3A",
  accentHover: "#5E222C",
  accentActive: "#4A1A22",
  /** Preenchimento lavado (seleção, realce de busca). */
  accentSoft: "#F3E4E7",

  // Cor semântica, separada do acento de marca: estado não se confunde com
  // identidade.
  success: "#1F6B47",
  successSoft: "#E3F0E7",
  warning: "#8A5A00",
  warningSoft: "#F6EEDD",
  danger: "#A3322B",
  dangerSoft: "#F7E6E3",

  /** Branco sobre o acento. Não é `canvas` por papel, é o par de contraste. */
  onAccent: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof COLORS;

export const FONTS = {
  display: "Cormorant Garamond",
  sans: "Source Sans 3",
} as const;

export type FontToken = keyof typeof FONTS;

/**
 * Pares [primeiro plano, fundo, mínimo, motivo] que a interface realmente
 * usa. O teste percorre esta lista — mexer num token que derrube um par
 * quebra `npm test` com o nome do par e a razão na mensagem.
 *
 * O motivo importa: um par de texto corrido exige 4.5:1 (AA), enquanto
 * texto grande/reforço visual aceita 3:1.
 */
export const CONTRAST_PAIRS: ReadonlyArray<
  readonly [ColorToken, ColorToken, number, string]
> = [
  ["ink", "canvas", 4.5, "corpo de texto sobre o fundo da página"],
  ["ink", "surface", 4.5, "texto sobre card/painel"],
  ["ink", "raised", 4.5, "texto sobre faixa recuada/chip"],
  ["muted", "canvas", 4.5, "texto secundário sobre o fundo"],
  ["muted", "surface", 4.5, "texto secundário sobre card"],
  ["accent", "canvas", 4.5, "link e ação primária como texto"],
  ["onAccent", "accent", 4.5, "rótulo branco sobre o botão de acento"],
  ["border", "canvas", 1.0, "filete de 1px — divisão estrutural, não texto"],
];

/**
 * Véu bordô dos banners fotográficos.
 *
 * Todas as cores derivam do `accentActive` (`#4A1A22`) em alpha, porque sobre
 * uma foto o olho vê a composição, não o rgba. Os alphas foram medidos contra
 * os dois extremos (foto branca e foto preta) — o pior caso é a foto bem
 * clara, e é ele que o teste usa:
 *
 * - `veil` (0.75): o título branco cheio passa 6.63:1, e a 85% ainda 5.33:1.
 * - `categoryVeil` (0.78): um pouco mais fechado porque o `CategoryBanner`
 *   tem texto em 70% de opacidade no rodapé (`text-canvas/70`) — nesse ponto
 *   o par bate 4.54:1, o mínimo AA.
 * - `creditBar`: bordô sólido atrás do crédito da foto; branco a 70% dá
 *   7.69:1, folga confortável para texto pequeno.
 */
export const PHOTO_OVERLAY = {
  veil: "rgba(74, 26, 34, 0.75)",
  categoryVeil: "rgba(74, 26, 34, 0.78)",
  creditBar: "#4A1A22",
  onVeil: "#FFFFFF",
} as const;

/**
 * Luminância relativa de um hex `#RRGGBB`, conforme WCAG 2.1.
 *
 * Recusa qualquer coisa que não seja `#rrggbb` em vez de inventar um valor —
 * um token mal colado precisa falhar alto, não virar cinza silencioso.
 */
export function relativeLuminance(hex: string): number {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error("Cor não é #rrggbb");
  }
  const value = hex.slice(1);
  const channels: number[] = [0, 2, 4].map((i) => {
    const sRGB = parseInt(value.slice(i, i + 2), 16) / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
  });
  const [r, g, b] = channels as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Lê um `rgba(r, g, b, a)` completo. Recusa o que não for rgba (hex, nome de
 * cor) em vez de assumir o alpha — o véu dos banners é o único caso de cor
 * translúcida, e ele precisa do alpha explícito.
 */
export function parseRgba(value: string): { hex: string; alpha: number } {
  const match = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/.exec(value);
  if (!match) {
    throw new Error("Não é rgba");
  }
  const r = match[1] as string; const g = match[2] as string; const b = match[3] as string; const a = match[4] as string;
  const toHex = (n: string) => Number(n).toString(16).padStart(2, "0");
  return { hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(), alpha: Number(a) };
}

/**
 * Compõe uma cor de primeiro plano sobre um fundo opaco, no alpha dado.
 * `alpha=0` devolve o fundo; `alpha=1` devolve a cor cheia. O compositing é
 * feito em sRGB direto (é o que o navegador faz na prática para uma camada
 * translúcida — não em espaço linear).
 */
export function compositeOver(hex: string, background: string, alpha: number): string {
  if (alpha < 0 || alpha > 1) {
    throw new Error("Alpha fora de 0–1");
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(hex) || !/^#[0-9a-fA-F]{6}$/.test(background)) {
    throw new Error("Cor não é #rrggbb");
  }
  const toChannels = (h: string): [number, number, number] =>
    [1, 3, 5].map((offset) => parseInt(h.slice(offset, offset + 2), 16)) as [
      number,
      number,
      number,
    ];
  const [fr, fg, fb] = toChannels(hex);
  const [br, bg, bb] = toChannels(background);
  const mix = (f: number, b: number) => Math.round(f * alpha + b * (1 - alpha));
  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(mix(fr, br))}${toHex(mix(fg, bg))}${toHex(mix(fb, bb))}`;
}

/** Razão de contraste WCAG entre duas cores, sempre >= 1. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}
