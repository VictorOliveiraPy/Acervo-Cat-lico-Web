import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

import { ApiError } from "@/lib/api";
import { EB_GARAMOND_FONT_FAMILY, loadCardFonts } from "@/lib/instagramFonts";
import { formatLiturgiaDate } from "@/lib/liturgia";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import { resolveCardImageSrc } from "@/lib/wikimedia";

export const runtime = "edge";

const WIDTH = 1080;
const HEIGHT = 1350;

// Mesmos hex de `app/instagram/[categoria]/[slug]/route.tsx` e de
// `tailwind.config.ts` — Satori não lê classes Tailwind. As duas rotas têm
// que ficar 100% no mesmo padrão visual — qualquer ajuste de cor/moldura
// aqui também vale lá, e vice-versa.
const BORDEAUX = "#6B1F2A";
const BORDEAUX_DEEP = "#4E1620";
const GOLD = "#B8912F";
const GOLD_BRIGHT = "#D9B673";
const GOLD_WASH = "#E8DCBA";
const PARCHMENT_MUTED = "#D6C6A8";

const OUTER_MARGIN = 40;
const FRAME_GAP = 10;
const INNER_PADDING = 52;
const PHOTO_HEIGHT = 560;

/** Corta o texto do evangelho num tamanho que cabe no cartão, sem cortar palavra ao meio. */
function excerpt(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  const cortado = texto.slice(0, max);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  return `${cortado.slice(0, ultimoEspaco)}…`;
}

/**
 * Gera o cartão diário do "Evangelho do Dia" pro Instagram (1080×1350),
 * puxando a liturgia de hoje de `/api/liturgia-diaria` — mesma moldura
 * dourada sobre bordô do cartão de verbetes
 * (`app/instagram/[categoria]/[slug]/route.tsx`).
 *
 * A liturgia não vem com imagem própria (é só texto), então quem gera o
 * post escolhe uma obra de arte condizente com o evangelho do dia e passa
 * a URL em `?imagem=` (ex.: uma pintura do Wikimedia Commons); sem o
 * parâmetro, cai no monograma da marca como reserva — nunca fica sem
 * gerar o cartão por falta de foto.
 *
 * Rota interna, fora do sitemap/indexação — ver `robots.ts`.
 */
export async function GET(request: Request) {
  let liturgia;
  try {
    liturgia = await fetchLiturgiaDiaria();
  } catch (error: unknown) {
    const status = error instanceof ApiError ? error.status : 502;
    return NextResponse.json({ error: "Liturgia do dia indisponível" }, { status });
  }

  const origin = new URL(request.url).origin;
  const imagemParam = new URL(request.url).searchParams.get("imagem");
  const contentWidth = WIDTH - 2 * (OUTER_MARGIN + FRAME_GAP + INNER_PADDING);
  const kicker = [formatLiturgiaDate(liturgia.data), liturgia.celebracao]
    .filter(Boolean)
    .join("  ·  ")
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: OUTER_MARGIN,
          backgroundColor: BORDEAUX,
          backgroundImage: `linear-gradient(160deg, ${BORDEAUX} 0%, ${BORDEAUX_DEEP} 100%)`,
        }}
      >
        <div style={{ flex: 1, display: "flex", border: `1.5px solid ${GOLD}`, padding: FRAME_GAP }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px solid ${GOLD}`,
              padding: INNER_PADDING,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: contentWidth,
                height: PHOTO_HEIGHT,
                backgroundColor: BORDEAUX_DEEP,
                border: `2px solid ${GOLD}`,
              }}
            >
              {imagemParam ? (
                // Mesmo tratamento `contain` do cartão de verbetes: a obra
                // aparece inteira, sem cortar, com a "moldura" preenchendo
                // a sobra quando a proporção não bate 1:1 com a caixa.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveCardImageSrc(imagemParam, origin)}
                  alt=""
                  width={contentWidth}
                  height={PHOTO_HEIGHT}
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: EB_GARAMOND_FONT_FAMILY,
                    fontStyle: "italic",
                    fontSize: 160,
                    color: GOLD_WASH,
                  }}
                >
                  C
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
              <span
                style={{
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontSize: 22,
                  letterSpacing: 4,
                  color: GOLD,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {kicker}
              </span>
              <span
                style={{
                  display: "flex",
                  marginTop: 18,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 56,
                  lineHeight: 1.15,
                  color: GOLD_WASH,
                }}
              >
                Evangelho do Dia
              </span>

              <div style={{ display: "flex", width: 90, height: 2, backgroundColor: GOLD, marginTop: 24 }} />

              <span
                style={{
                  display: "flex",
                  marginTop: 22,
                  maxWidth: contentWidth - 40,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontStyle: "italic",
                  fontSize: 29,
                  lineHeight: 1.5,
                  color: PARCHMENT_MUTED,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {`"${excerpt(liturgia.evangelho.texto, 220)}"`}
              </span>
              <span
                style={{
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  marginTop: 14,
                  fontSize: 23,
                  color: GOLD,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {liturgia.evangelho.referencia}
              </span>

              <div style={{ display: "flex", width: 90, height: 2, backgroundColor: GOLD, marginTop: 26 }} />

              <span
                style={{
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  marginTop: 22,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: GOLD_BRIGHT,
                }}
              >
                @compendiocatolico
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
