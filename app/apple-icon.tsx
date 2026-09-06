import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Ícone de tela inicial do iOS/iPadOS ("Adicionar à Tela de Início" no
 * Safari). Convenção de arquivo do Next: `apple-icon.tsx` já gera o
 * `<link rel="apple-touch-icon">` sozinho, sem precisar declarar em
 * `layout.tsx`. Mesmo monograma do favicon (`app/icon.tsx`), no tamanho que
 * a Apple pede.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#6B1F2A",
          color: "#F5F0E6",
          fontFamily: "Georgia, serif",
          fontSize: 110,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
