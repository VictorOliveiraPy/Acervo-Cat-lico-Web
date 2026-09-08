/**
 * Fonte real (não a fallback do Satori) pros cartões de Instagram.
 *
 * `ImageResponse` (Satori) NÃO herda `next/font` nem lê fontes do sistema —
 * declarar `fontFamily: "Georgia, serif"` sem carregar bytes de fonte cai
 * sempre na sans-serif genérica embutida no Satori, foi o que aconteceu nos
 * dois geradores até aqui (o texto parecia sans mesmo pedindo serifa). Isto
 * carrega a EB Garamond de verdade — a mesma serifa de título do site
 * (`tailwind.config.ts`, `--font-display`) — pra o cartão do Instagram bater
 * 100% com a identidade visual do site, não só na cor e na moldura.
 *
 * Os arquivos são instâncias **estáticas** (`fonttools varLib.instancer`),
 * não a fonte variável original do Google Fonts: o parser de fontes do
 * Satori quebra ("Cannot read properties of undefined (reading '256')") ao
 * tentar ler as tabelas `fvar`/`gvar` de uma fonte variável — só entende
 * TTF/OTF estático, um peso por arquivo.
 *
 * `fetch(new URL(...))` é o jeito documentado do Next de embutir um arquivo
 * local no bundle de uma rota edge (mesmo padrão usado em
 * `opengraph-image.tsx`/`icon.tsx`); os arquivos ficam em `lib/_fonts/` pra
 * o caminho relativo valer a partir deste módulo, não da rota que importa.
 */

const boldFont = fetch(new URL("./_fonts/EBGaramond-Bold.ttf", import.meta.url)).then((res) =>
  res.arrayBuffer(),
);
const regularFont = fetch(new URL("./_fonts/EBGaramond-Regular.ttf", import.meta.url)).then((res) =>
  res.arrayBuffer(),
);
const italicFont = fetch(new URL("./_fonts/EBGaramond-Italic.ttf", import.meta.url)).then((res) =>
  res.arrayBuffer(),
);

export const EB_GARAMOND_FONT_FAMILY = "EB Garamond";

/** Passa direto pro `fonts` do segundo argumento de `new ImageResponse(...)`. */
export async function loadCardFonts() {
  const [bold, regular, italic] = await Promise.all([boldFont, regularFont, italicFont]);
  return [
    { name: EB_GARAMOND_FONT_FAMILY, data: regular, weight: 400 as const, style: "normal" as const },
    { name: EB_GARAMOND_FONT_FAMILY, data: bold, weight: 700 as const, style: "normal" as const },
    { name: EB_GARAMOND_FONT_FAMILY, data: italic, weight: 400 as const, style: "italic" as const },
  ];
}
