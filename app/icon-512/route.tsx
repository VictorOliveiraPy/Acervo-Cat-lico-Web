import { ImageResponse } from "next/og";

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
          backgroundColor: "#6B1F2A",
          color: "#F5F0E6",
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
