import { ImageResponse } from "next/og";

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
          backgroundColor: "#6B1F2A",
          color: "#F5F0E6",
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
