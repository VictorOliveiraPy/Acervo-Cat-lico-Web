import { ImageResponse } from "next/og";

import { COLORS } from "@/lib/designTokens";

export const runtime = "edge";

/** Ícone 512×512 do manifest — usado em splash screens e listagens maiores. */
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
          fontSize: 320,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { width: 512, height: 512 },
  );
}
