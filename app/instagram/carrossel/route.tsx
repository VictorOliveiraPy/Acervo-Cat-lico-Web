import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

import { COLORS } from "@/lib/designTokens";
import { EB_GARAMOND_FONT_FAMILY, loadCardFonts } from "@/lib/instagramFonts";
import { resolveCardImageSrc } from "@/lib/wikimedia";

export const runtime = "edge";

const WIDTH = 1080;
const HEIGHT = 1350;

// Mesmos hex das outras duas rotas — as três têm que ficar 100% no mesmo
// padrão visual (moldura, cores, tipografia).
const MINERAL = COLORS.mineral;
const MINERAL_DEEP = COLORS.ink;
const LINE = COLORS.borderStrong;
const LINE_BRIGHT = COLORS.border;
const TEXT_LIGHT = COLORS.surface;
const TEXT_MUTED = COLORS.border;

const OUTER_MARGIN = 40;
const FRAME_GAP = 10;
const INNER_PADDING = 52;
const PHOTO_HEIGHT = 560;

/**
 * Capa genérica de carrossel pro Instagram (1080×1350) — mesma moldura
 * clara sobre azul-mineral das outras duas rotas de cartão, mas com título,
 * subtítulo e (opcionalmente) foto passados por query string, pra servir
 * de primeiro slide de qualquer carrossel temático (não fica preso a um
 * verbete do acervo nem à liturgia do dia).
 *
 * Uso: /instagram/carrossel?titulo=...&subtitulo=...&imagem=...
 * (`imagem` é opcional — sem ela, cai no monograma da marca.)
 *
 * Rota interna, fora do sitemap/indexação — ver `robots.ts`.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const params = new URL(request.url).searchParams;
  const titulo = params.get("titulo");
  const subtitulo = params.get("subtitulo");
  const imagemParam = params.get("imagem");

  if (!titulo) {
    return NextResponse.json({ error: "Parâmetro 'titulo' é obrigatório" }, { status: 400 });
  }

  const contentWidth = WIDTH - 2 * (OUTER_MARGIN + FRAME_GAP + INNER_PADDING);

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
        <div style={{ flex: 1, display: "flex", border: `1.5px solid ${LINE}`, padding: FRAME_GAP }}>
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
              {imagemParam ? (
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
                    color: TEXT_LIGHT,
                  }}
                >
                  C
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 44 }}>
              <span
                style={{
                  fontSize: 22,
                  letterSpacing: 4,
                  // `LINE` puro sobre azul-mineral fica ~3,85:1 de contraste — abaixo
                  // do mínimo de 4,5:1 pra texto corrido. `LINE_BRIGHT` (já
                  // usado no rodapé das outras rotas) passa em ~5,9:1.
                  color: LINE_BRIGHT,
                  fontWeight: 700,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                }}
              >
                COMPÊNDIO CATÓLICO
              </span>
              <span
                style={{
                  display: "flex",
                  marginTop: 20,
                  maxWidth: contentWidth,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: titulo.length > 40 ? 52 : 64,
                  lineHeight: 1.15,
                  color: TEXT_LIGHT,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {titulo}
              </span>

              {subtitulo ? (
                <>
                  <div style={{ display: "flex", width: 90, height: 2, backgroundColor: LINE, marginTop: 28 }} />
                  <span
                    style={{
                      display: "flex",
                      marginTop: 24,
                      maxWidth: contentWidth - 40,
                      fontFamily: EB_GARAMOND_FONT_FAMILY,
                      fontStyle: "italic",
                      fontSize: 32,
                      lineHeight: 1.5,
                      color: TEXT_MUTED,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    {subtitulo}
                  </span>
                </>
              ) : null}
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
