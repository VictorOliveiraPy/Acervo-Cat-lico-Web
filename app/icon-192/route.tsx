import { ImageResponse } from "next/og";

import { COLORS } from "@/lib/designTokens";

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
          backgroundColor: COLORS.accent,
          color: COLORS.onAccent,
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
