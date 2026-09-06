import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Ícone 192×192 do manifest (`app/manifest.ts`) — tamanho mínimo que o
 * Chrome/Android pede para o app instalado. Mesmo monograma do favicon
 * (`app/icon.tsx`), só maior.
 */
export async function GET() {
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
          fontSize: 120,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { width: 192, height: 192 },
  );
}
