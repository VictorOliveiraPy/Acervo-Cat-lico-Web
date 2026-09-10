import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";

import { resolveCardImageSrc } from "@/lib/wikimedia";

export const runtime = "edge";

const WIDTH = 1080;
const HEIGHT = 1350;

const MONTSERRAT_BLACK = "Montserrat Black";
const MONTSERRAT_EXTRABOLD = "Montserrat ExtraBold";

async function loadHeadlineFonts(origin: string) {
  const [black, extrabold] = await Promise.all([
    fetch(`${origin}/fonts/Montserrat-Black.ttf`).then((res) => res.arrayBuffer()),
    fetch(`${origin}/fonts/Montserrat-ExtraBold.ttf`).then((res) => res.arrayBuffer()),
  ]);
  return [
    { name: MONTSERRAT_BLACK, data: black, weight: 900 as const, style: "normal" as const },
    { name: MONTSERRAT_EXTRABOLD, data: extrabold, weight: 800 as const, style: "normal" as const },
  ];
}

/**
 * Cartão de Instagram "gancho" (1080×1350): foto de fundo ocupando o
 * quadro inteiro, sem moldura, com uma frase grande em caixa alta por
 * cima — formato de card que para o scroll, não de placa de museu.
 *
 * Substitui a primeira versão desta rota (moldura bordô/dourada com bloco
 * de texto embaixo, igual às outras duas rotas de Instagram): aquele
 * formato é o certo pro cartão de verbete/liturgia, que quer parecer
 * "arquivo do site", mas é fraco pra gerar engajamento — ninguém para de
 * rolar por causa de uma citação pequena com moldura. Referência real: os
 * cartões de citação que o usuário já vinha usando (foto/ilustração cheia,
 * frase curta e enorme, sem parágrafo explicativo — a explicação vai na
 * legenda do post, não dentro da imagem).
 *
 * Parâmetros: `imagem` (obrigatório), `frase` (obrigatório, a frase de
 * impacto — cabe em 2-3 linhas curtas), `selo` (opcional, uma palavra ou
 * duas no topo, tipo "CURIOSIDADE" ou "VOCÊ SABIA?"), `posicao` (opcional,
 * "topo" ou "baixo" — onde o texto fica; padrão "baixo").
 *
 * Rota interna, fora do sitemap/indexação — ver `robots.ts`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const imagemParam = url.searchParams.get("imagem");
  const frase = url.searchParams.get("frase");
  const selo = (url.searchParams.get("selo") ?? "").toUpperCase();
  const posicao = url.searchParams.get("posicao") === "topo" ? "topo" : "baixo";

  if (!imagemParam || !frase) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: imagem, frase" },
      { status: 400 },
    );
  }

  const origin = url.origin;
  const gradiente =
    posicao === "topo"
      ? "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 60%)"
      : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 65%)";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveCardImageSrc(imagemParam, origin)}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            flexDirection: "column",
            justifyContent: posicao === "topo" ? "flex-start" : "flex-end",
            backgroundImage: gradiente,
            padding: "72px 64px",
          }}
        >
          {selo ? (
            <div
              style={{
                display: "flex",
                fontFamily: MONTSERRAT_EXTRABOLD,
                fontSize: 26,
                letterSpacing: 3,
                color: "#D9B673",
                marginBottom: 20,
              }}
            >
              {selo}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontFamily: MONTSERRAT_BLACK,
              fontSize: 66,
              lineHeight: 1.12,
              color: "#FFFFFF",
              textShadow: "0 2px 18px rgba(0,0,0,0.5)",
              textTransform: "uppercase",
            }}
          >
            {frase}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: MONTSERRAT_EXTRABOLD,
              fontSize: 24,
              color: "#D9B673",
              marginTop: 28,
            }}
          >
            @compendiocatolico
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: await loadHeadlineFonts(origin),
    },
  );
}
