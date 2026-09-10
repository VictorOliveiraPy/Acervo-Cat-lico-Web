import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

import { EB_GARAMOND_FONT_FAMILY, loadCardFonts } from "@/lib/instagramFonts";
import { resolveCardImageSrc } from "@/lib/wikimedia";

export const runtime = "edge";

const WIDTH = 1080;
const HEIGHT = 1350;

// Mesmos hex de `app/instagram/[categoria]/[slug]/route.tsx` e
// `app/instagram/liturgia-diaria/route.tsx` — as três rotas têm que ficar
// 100% no mesmo padrão visual, Satori não lê classes Tailwind.
const BORDEAUX = "#6B1F2A";
const BORDEAUX_DEEP = "#4E1620";
const GOLD = "#B8912F";
const GOLD_BRIGHT = "#D9B673";
const GOLD_WASH = "#E8DCBA";
const PARCHMENT_MUTED = "#D6C6A8";

const OUTER_MARGIN = 40;
const FRAME_GAP = 10;
const INNER_PADDING = 52;
const PHOTO_HEIGHT = 620;

function excerpt(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  const cortado = texto.slice(0, max);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  return `${cortado.slice(0, ultimoEspaco)}…`;
}

/**
 * Cartão de Instagram genérico (1080×1350), mesma moldura dourada sobre
 * bordô das outras duas rotas — mas sem depender de um verbete do acervo
 * ou da liturgia do dia: título, texto e imagem vêm todos por query string.
 *
 * Existe pra cobrir o post "de curiosidade" — foto forte (foto de arquivo,
 * pintura, retrato) + gancho curto — que não é um verbete enciclopédico
 * nem o evangelho do dia, mas ainda precisa sair no padrão visual da marca
 * em vez de foto crua sem nada.
 *
 * Parâmetros: `imagem` (obrigatório, `/img-acervo/...` ou URL do Wikimedia),
 * `titulo` (obrigatório), `kicker` (opcional, categoria/selo no topo),
 * `texto` (opcional, corta em ~200 chars), `fonte` (opcional, linha final
 * antes da assinatura — nome de quem é a foto, referência bíblica etc.).
 *
 * Rota interna, fora do sitemap/indexação — ver `robots.ts`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const imagemParam = url.searchParams.get("imagem");
  const titulo = url.searchParams.get("titulo");
  const kicker = (url.searchParams.get("kicker") ?? "").toUpperCase();
  const texto = url.searchParams.get("texto");
  const fonte = url.searchParams.get("fonte");

  if (!imagemParam || !titulo) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: imagem, titulo" },
      { status: 400 },
    );
  }

  const origin = url.origin;
  const contentWidth = WIDTH - 2 * (OUTER_MARGIN + FRAME_GAP + INNER_PADDING);

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
                overflow: "hidden",
              }}
            >
              {/* Mesmo tratamento `contain` das outras duas rotas: a foto
                  aparece inteira, sem risco de cortar a parte que importa
                  (aconteceu aqui: `cover` cortou os óculos do "papa
                  estiloso", que é o ponto inteiro da foto). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveCardImageSrc(imagemParam, origin)}
                alt=""
                width={contentWidth}
                height={PHOTO_HEIGHT}
                style={{ objectFit: "contain" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 36 }}>
              {kicker ? (
                <span
                  style={{
                    fontFamily: EB_GARAMOND_FONT_FAMILY,
                    fontSize: 22,
                    letterSpacing: 4,
                    color: GOLD_BRIGHT,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {kicker}
                </span>
              ) : null}
              <span
                style={{
                  display: "flex",
                  marginTop: kicker ? 16 : 0,
                  maxWidth: contentWidth - 20,
                  fontFamily: EB_GARAMOND_FONT_FAMILY,
                  fontWeight: 700,
                  fontSize: 50,
                  lineHeight: 1.15,
                  color: GOLD_WASH,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {titulo}
              </span>

              {texto ? (
                <>
                  <div style={{ display: "flex", width: 90, height: 2, backgroundColor: GOLD, marginTop: 24 }} />
                  <span
                    style={{
                      display: "flex",
                      marginTop: 22,
                      maxWidth: contentWidth - 40,
                      fontFamily: EB_GARAMOND_FONT_FAMILY,
                      fontSize: 27,
                      lineHeight: 1.5,
                      color: PARCHMENT_MUTED,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    {excerpt(texto, 210)}
                  </span>
                </>
              ) : null}

              {fonte ? (
                <span
                  style={{
                    fontFamily: EB_GARAMOND_FONT_FAMILY,
                    marginTop: 14,
                    fontSize: 21,
                    fontStyle: "italic",
                    color: GOLD_BRIGHT,
                    textAlign: "center",
                  }}
                >
                  {fonte}
                </span>
              ) : null}

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
