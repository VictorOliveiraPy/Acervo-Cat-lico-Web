import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Variante "maskable" do ícone 512×512: o Android pode recortar o ícone em
 * círculo, quadrado arredondado etc., então o monograma precisa caber na
 * "zona segura" central (~80% do quadrado) — por isso a fonte é bem menor
 * que na versão normal (`icon-512`), com a cor de fundo preenchendo tudo.
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
          fontSize: 220,
          fontWeight: 700,
        }}
      >
        C
      </div>
    ),
    { width: 512, height: 512 },
  );
}
