import { describe, expect, it } from "vitest";

import {
  SAINT_ASSETS,
  SAINT_CATALOG,
  featuredSaint,
  normalizeSaintSlug,
  saintAssetFor,
} from "@/lib/saintAssets";

describe("catálogo de imagens individuais dos santos", () => {
  it("normaliza o formato de slug dos manifestos sem alterar o do backend", () => {
    expect(normalizeSaintSlug("sao_joao_maria_vianney")).toBe("sao-joao-maria-vianney");
    expect(normalizeSaintSlug("sao-patricio")).toBe("sao-patricio");
  });

  it("não registra santo nem arquivo duplicado", () => {
    const slugs = SAINT_CATALOG.map(({ slug }) => slug);
    const paths = SAINT_ASSETS.flatMap(({ avatar, card, portrait }) => [
      avatar,
      card,
      portrait,
    ]);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("só associa a arte à categoria Santos", () => {
    expect(saintAssetFor({ categoria: "santos", slug: "cecilia-de-roma" })?.name).toBe(
      "Santa Cecília",
    );
    expect(saintAssetFor({ categoria: "personagens-biblicos", slug: "cecilia-de-roma" })).toBeNull();
  });

  it("mantém fora desta etapa os arquivos ainda pendentes de revisão", () => {
    expect(SAINT_ASSETS).toHaveLength(7);
    expect(SAINT_CATALOG).toHaveLength(55);
    expect(SAINT_CATALOG.filter(({ reviewStatus }) => reviewStatus === "pending")).toHaveLength(48);
    expect(saintAssetFor({ categoria: "santos", slug: "santa-teresa-dos-andes" })).toBeNull();
  });

  it("associa cada arte revisada ao slug real do verbete na API", () => {
    // Conferidos em `GET /api/santos` em 2026-10-30; o slug dos manifestos
    // (`santa-cecilia`) não existe na API e deixava as imagens fora do site.
    expect(SAINT_ASSETS.map(({ slug }) => slug)).toEqual([
      "cecilia-de-roma",
      "joao-maria-vianney",
      "rosa-de-lima",
      "sebastiao-martir",
      "helena-imperatriz",
      "luis-gonzaga",
      "patricio-da-irlanda",
    ]);
    expect(saintAssetFor({ categoria: "santos", slug: "santa-cecilia" })).toBeNull();
  });

  it("reveza o santo em destaque por dia, sem sair dos revisados", () => {
    const today = new Date("2026-10-30T12:00:00Z");
    const sameDay = new Date("2026-10-30T23:00:00Z");
    const tomorrow = new Date("2026-10-31T12:00:00Z");

    expect(featuredSaint(sameDay)).toBe(featuredSaint(today));
    expect(featuredSaint(tomorrow)).not.toBe(featuredSaint(today));
    expect(SAINT_ASSETS).toContain(featuredSaint(today));
  });

  it("consolida São Pedro uma vez e registra seus dois lotes de origem", () => {
    const pedro = SAINT_CATALOG.filter(({ slug }) => slug === "sao-pedro");
    expect(pedro).toHaveLength(1);
    expect(pedro[0]?.batches).toEqual(["lote-03", "apostolos-01"]);
  });
});
