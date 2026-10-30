import { describe, expect, it } from "vitest";

import { SAINT_ASSETS, normalizeSaintSlug, saintAssetFor } from "@/lib/saintAssets";

describe("catálogo de imagens individuais dos santos", () => {
  it("normaliza o formato de slug dos manifestos sem alterar o do backend", () => {
    expect(normalizeSaintSlug("sao_joao_maria_vianney")).toBe("sao-joao-maria-vianney");
    expect(normalizeSaintSlug("sao-patricio")).toBe("sao-patricio");
  });

  it("não registra santo nem arquivo duplicado", () => {
    const slugs = SAINT_ASSETS.map(({ slug }) => slug);
    const paths = SAINT_ASSETS.flatMap(({ avatar, card, portrait }) => [
      avatar,
      card,
      portrait,
    ]);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("só associa a arte à categoria Santos", () => {
    expect(saintAssetFor({ categoria: "santos", slug: "santa-cecilia" })?.name).toBe(
      "Santa Cecília",
    );
    expect(saintAssetFor({ categoria: "personagens-biblicos", slug: "santa-cecilia" })).toBeNull();
  });

  it("mantém fora desta etapa os arquivos ainda pendentes de revisão", () => {
    expect(SAINT_ASSETS).toHaveLength(7);
    expect(saintAssetFor({ categoria: "santos", slug: "santa-teresa-dos-andes" })).toBeNull();
  });
});
