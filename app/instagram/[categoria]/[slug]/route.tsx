import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

import { COLORS } from "@/lib/designTokens";
import { CATEGORY_LABELS } from "@/lib/categories";
import { ApiError } from "@/lib/api";
import { isCategorySlug, type CategorySlug } from "@/lib/schemas";
import { fetchEntry } from "@/lib/services/acervoService";
import { EB_GARAMOND_FONT_FAMILY, loadCardFonts } from "@/lib/instagramFonts";
import { resolveCardImageSrc } from "@/lib/wikimedia";

export const runtime = "edge";

type Params = { categoria: string; slug: string };

const WIDTH = 1080;
const HEIGHT = 1350;

// Mesmos hex de `tailwind.config.ts` — o `ImageResponse` (Satori) não lê
// classes Tailwind, então as cores da marca são repetidas aqui em literal,
// igual já acontece em `app/icon.tsx` e `app/opengraph-image.tsx`.
const MINERAL = COLORS.mineral;
const MINERAL_DEEP = COLORS.ink;
const LINE = COLORS.borderStrong;
const LINE_BRIGHT = COLORS.border;
const TEXT_LIGHT = COLORS.surface;
// Texto secundário sobre o azul-mineral do cartão (a "letra miúda"): um cinza
// claro que segura leitura sem competir com o título em `TEXT_LIGHT`.
const TEXT_MUTED = COLORS.border;

// Moldura de dupla linha clara sobre fundo azul-mineral — mesma linguagem visual
// do cartão de compartilhamento de "Acender uma vela" (ver `post-velas.png`),
// em vez do painel claro que esta rota usava antes: a foto do verbete vira
// uma obra emoldurada, não uma miniatura de catálogo.
const OUTER_MARGIN = 40;
const FRAME_GAP = 10;
const INNER_PADDING = 52;
const PHOTO_HEIGHT = 560;
const RESUMO_MAX_CHARS = 160;

/**
 * Corta o resumo num tamanho que sempre cabe no cartão, sem cortar palavra
 * ao meio nem terminar a frase de repente no meio (o que aconteceu com os
 * primeiros verbetes cujo resumo passava de duas linhas — o `overflow:
 * hidden` cru cortava o texto sem aviso, tipo "distribuir a").
 */
function excerpt(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  const cortado = texto.slice(0, max);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  return `${cortado.slice(0, ultimoEspaco)}…`;
}

/**
 * Gera o cartão de post do Instagram (1080×1350, proporção 4:5) de um
 * verbete — moldura clara sobre fundo azul-mineral, foto emoldurada em cima,
 * título e resumo centralizados embaixo.
 *
 * Rota interna, não pensada pra navegação humana: existe pra alimentar o
 * robô de publicação (ver o plano do mural de Instagram) com uma URL de
 * imagem pronta pro `image_url` do Graph API. Por isso fica de fora do
 * `sitemap.ts` e ganha `noindex` explícito — ver `next.config.js`/`robots.ts`
 * se precisar bloquear rastreamento também lá.
 */
export async function GET(request: Request, { params }: { params: Params }) {
  const { categoria, slug } = params;
  if (!isCategorySlug(categoria)) {
    return NextResponse.json({ error: "Categoria desconhecida" }, { status: 404 });
  }

  let entry;
  try {
    entry = await fetchEntry(categoria as CategorySlug, slug);
  } catch (error: unknown) {
    const status = error instanceof ApiError ? error.status : 502;
    return NextResponse.json({ error: "Verbete não encontrado" }, { status });
  }

  const label = CATEGORY_LABELS[categoria as CategorySlug];
  const festa = "festa" in entry ? entry.festa : null;
  const kicker = [label.nav, festa].filter(Boolean).join("  ·  ").toUpperCase();
  const contentWidth = WIDTH - 2 * (OUTER_MARGIN + FRAME_GAP + INNER_PADDING);
  const origin = new URL(request.url).origin;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: OUTER_MARGIN,
          backgroundColor: MINERAL,
          backgroundImage: `linear-gradient(160deg, ${MINERAL} 0%, ${MINERAL_DEEP} 100%)`,
        }}
      >
        {/* Linha externa da moldura dupla */}
        <div style={{ flex: 1, display: "flex", border: `1.5px solid ${LINE}`, padding: FRAME_GAP }}>
          {/* Linha interna da moldura dupla */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px solid ${LINE}`,
              padding: INNER_PADDING,
            }}
          >
            {entry.imagem && (
              // `contain` (não `cover`) de propósito: a obra tem que
              // aparecer inteira, sem cortar topo/base pra caber na caixa —
              // a "moldura" (cor de fundo atrás da foto) preenche a sobra
              // dos dois lados quando a proporção da foto não bate 1:1 com
              // a caixa, em vez de recortar a imagem.
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: contentWidth,
                  height: PHOTO_HEIGHT,
                  backgroundColor: MINERAL_DEEP,
                  border: `2px solid ${LINE}`,
                }}
              >
                {/* Satori (o renderizador do ImageResponse) não roda no
                    navegador e não entende `next/image`; é o mesmo motivo de
                    `opengraph-image.tsx` não usar `<Image />`. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveCardImageSrc(entry.imagem, origin)}
                  alt=""
                  width={contentWidth}
                  height={PHOTO_HEIGHT}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: entry.imagem ? 48 : 0,
              }}
            >
              <span
                style={{
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontSize: 24,
                  letterSpacing: 5,
                  // `LINE` puro sobre azul-mineral fica ~3,85:1 — abaixo do mínimo
                  // de 4,5:1 pra texto corrido. `LINE_BRIGHT` passa em ~5,9:1.
                  color: LINE_BRIGHT,
                  fontWeight: 700,
                }}
              >
                {kicker}
              </span>
              <span
                style={{
                  display: "flex",
                  marginTop: 20,
                  maxWidth: contentWidth,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: entry.titulo.length > 40 ? 50 : 62,
                  lineHeight: 1.15,
                  color: TEXT_LIGHT,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {entry.titulo}
              </span>

              <div style={{ display: "flex", width: 90, height: 2, backgroundColor: LINE, marginTop: 28 }} />

              <span
                style={{
                  display: "flex",
                  marginTop: 26,
                  maxWidth: contentWidth - 60,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontSize: 30,
                  lineHeight: 1.5,
                  color: TEXT_MUTED,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {excerpt(entry.resumo, RESUMO_MAX_CHARS)}
              </span>

              <div style={{ display: "flex", width: 90, height: 2, backgroundColor: LINE, marginTop: 32 }} />

              <span
                style={{
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  marginTop: 26,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: LINE_BRIGHT,
                }}
              >
                compendio-catolico.com
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: await loadCardFonts(origin),
    },
  );
}
