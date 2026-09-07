import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

import { CATEGORY_LABELS } from "@/lib/categories";
import { ApiError } from "@/lib/api";
import { isCategorySlug, type CategorySlug } from "@/lib/schemas";
import { fetchEntry } from "@/lib/services/acervoService";

export const runtime = "edge";

type Params = { categoria: string; slug: string };

const WIDTH = 1080;
const HEIGHT = 1350;
const PHOTO_HEIGHT = Math.round(HEIGHT * 0.62);

// Mesmos hex de `tailwind.config.ts` — o `ImageResponse` (Satori) não lê
// classes Tailwind, então as cores da marca são repetidas aqui em literal,
// igual já acontece em `app/icon.tsx` e `app/opengraph-image.tsx`.
const BORDEAUX = "#6B1F2A";
const BORDEAUX_SOFT = "#8A3441";
const PURPLE = "#4A2545";
const PARCHMENT_RAISED = "#FBF8F1";
const GOLD = "#B8912F";
const GOLD_WASH = "#E8DCBA";
const INK = "#241B22";
const INK_MUTED = "#6E6058";
const RULE = "#DCD2BE";

/**
 * Gera o cartão de post do Instagram (1080×1350, proporção 4:5) de um
 * verbete — foto em cima, título e resumo embaixo, na paleta do site.
 *
 * Rota interna, não pensada pra navegação humana: existe pra alimentar o
 * robô de publicação (ver o plano do mural de Instagram) com uma URL de
 * imagem pronta pro `image_url` do Graph API. Por isso fica de fora do
 * `sitemap.ts` e ganha `noindex` explícito — ver `next.config.js`/`robots.ts`
 * se precisar bloquear rastreamento também lá.
 */
export async function GET(_request: Request, { params }: { params: Params }) {
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PARCHMENT_RAISED,
        }}
      >
        {entry.imagem ? (
          // Satori (o renderizador do ImageResponse) não roda no navegador e
          // não entende `next/image`; é o mesmo motivo de
          // `opengraph-image.tsx` não usar `<Image />`.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.imagem}
            alt=""
            width={WIDTH}
            height={PHOTO_HEIGHT}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: WIDTH,
              height: PHOTO_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `linear-gradient(155deg, ${BORDEAUX_SOFT}, ${PURPLE})`,
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 220,
                color: GOLD_WASH,
              }}
            >
              {entry.titulo.charAt(0)}
            </span>
          </div>
        )}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, letterSpacing: 4, color: BORDEAUX, fontWeight: 700 }}>
              {kicker}
            </span>
            <span
              style={{
                marginTop: 18,
                fontFamily: "Georgia, serif",
                fontSize: entry.titulo.length > 40 ? 52 : 66,
                lineHeight: 1.15,
                color: INK,
              }}
            >
              {entry.titulo}
            </span>
            <span
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 30,
                lineHeight: 1.4,
                color: INK_MUTED,
                maxHeight: 168,
                overflow: "hidden",
              }}
            >
              {entry.resumo}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `2px solid ${RULE}`,
              paddingTop: 24,
            }}
          >
            <span style={{ fontSize: 24, letterSpacing: 3, color: GOLD, fontWeight: 700 }}>
              COMPÊNDIO CATÓLICO
            </span>
            <span style={{ fontSize: 24, color: INK_MUTED }}>compendio-catolico.com</span>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
