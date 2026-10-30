import { ImageResponse } from "next/og";

import { COLORS } from "@/lib/designTokens";
import { SITE_NAME } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Prévia padrão de compartilhamento (WhatsApp, Twitter, redes sociais).
 *
 * Desenhada na hora com `next/og`, na mesma paleta do site (`tailwind.config.ts`
 * — canvas mineral, bordô e azul institucional), em vez de depender de um arquivo de imagem
 * estático que alguém teria que desenhar e manter atualizado.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          backgroundColor: COLORS.canvas,
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: COLORS.accent,
            fontFamily: "Georgia, serif",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            maxWidth: 920,
            fontSize: 58,
            lineHeight: 1.2,
            color: COLORS.mineral,
            fontFamily: "Georgia, serif",
          }}
        >
          Santos, papas, doutrina, milagres e concílios — tudo em um só lugar.
        </div>
      </div>
    ),
    { ...size },
  );
}
