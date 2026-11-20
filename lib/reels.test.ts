import { describe, expect, it } from "vitest";

import { parseTema, reelSchema } from "@/lib/reels";

describe("tema do filtro", () => {
  it("deve aceitar só temas conhecidos", () => {
    expect(parseTema("santos")).toBe("santos");
    for (const value of [undefined, "", "xyz", "constructor", "__proto__", ["santos"]]) {
      expect(parseTema(value)).toBeNull();
    }
  });
});

describe("formato da API", () => {
  it("lê um reel como a API devolve", () => {
    const reel = reelSchema.parse({
      slug: "sao-jose",
      titulo: "São José",
      legenda: "",
      tema: "santos",
      largura: 720,
      altura: 1280,
      video_url: "https://img.compendio-catolico.com/reels/sao-jose.mp4",
      capa_url: "/reels/sao-jose.jpg",
      publicado: true,
      criado_em: null,
    });
    expect(reel.titulo).toBe("São José");
  });
});
