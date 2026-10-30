import { ImageResponse } from "next/og";

import { COLORS } from "@/lib/designTokens";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon gerado na hora — monograma "C" na cor bordô da marca. */
export default function Icon() {
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
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
