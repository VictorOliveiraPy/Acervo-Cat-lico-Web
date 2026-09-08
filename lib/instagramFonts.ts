/**
 * Fonte real (não a fallback do Satori) pros cartões de Instagram.
 *
 * `ImageResponse` (Satori) NÃO herda `next/font` nem lê fontes do sistema —
 * declarar `fontFamily: "Georgia, serif"` sem carregar bytes de fonte cai
 * sempre na sans-serif genérica embutida no Satori. Carrega a EB Garamond
 * de verdade — a mesma serifa de título do site (`tailwind.config.ts`,
 * `--font-display`) — pra o cartão bater 100% com a identidade do site.
 *
 * Busca por URL absoluta em `public/fonts/`, não `fetch(new URL(caminho
 * relativo, import.meta.url))`: essa segunda forma é só garantida pelas
 * convenções especiais de metadata do Next (`opengraph-image.tsx`,
 * `icon.tsx`) — numa rota `route.ts` comum, o rastreador de build da
 * Vercel não empacota o arquivo (silenciosamente: sem erro, só cai no
 * fallback), foi o que aconteceu aqui antes desta versão. Buscar por HTTP
 * o próprio arquivo estático é mais simples e sempre funciona, porque
 * `public/` sempre é servido — mesmo mecanismo já usado pra buscar as
 * fotos do Wikimedia.
 *
 * Os arquivos são instâncias **estáticas** (`fonttools varLib.instancer`),
 * não a fonte variável original do Google Fonts: o parser de fontes do
 * Satori quebra ao tentar ler as tabelas `fvar`/`gvar` de uma fonte
 * variável — só entende TTF/OTF estático, um peso por arquivo.
 */

export const EB_GARAMOND_FONT_FAMILY = "EB Garamond";

/**
 * `origin` vem de `new URL(request.url).origin` de quem chama — funciona
 * igual em produção, preview da Vercel e `next start` local, sem
 * hard-code de domínio.
 */
export async function loadCardFonts(origin: string) {
  const [regular, bold, italic] = await Promise.all([
    fetch(`${origin}/fonts/EBGaramond-Regular.ttf`).then((res) => res.arrayBuffer()),
    fetch(`${origin}/fonts/EBGaramond-Bold.ttf`).then((res) => res.arrayBuffer()),
    fetch(`${origin}/fonts/EBGaramond-Italic.ttf`).then((res) => res.arrayBuffer()),
  ]);

  return [
    { name: EB_GARAMOND_FONT_FAMILY, data: regular, weight: 400 as const, style: "normal" as const },
    { name: EB_GARAMOND_FONT_FAMILY, data: bold, weight: 700 as const, style: "normal" as const },
    { name: EB_GARAMOND_FONT_FAMILY, data: italic, weight: 400 as const, style: "italic" as const },
  ];
}
