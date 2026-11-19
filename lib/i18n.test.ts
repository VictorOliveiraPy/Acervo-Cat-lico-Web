import { describe, expect, it } from "vitest";

import { languageAlternates, translationLangsByPath } from "@/lib/i18n";

describe("hreflang", () => {
  it("deve declarar os idiomas e o x-default em português", () => {
    expect(languageAlternates("/oracoes")).toEqual({
      "pt-BR": "/oracoes",
      es: "/es/oracoes",
      en: "/en/oracoes",
      "x-default": "/oracoes",
    });
  });

  it("deve apontar a home de cada idioma", () => {
    expect(languageAlternates("/")).toEqual({ "pt-BR": "/", es: "/es", en: "/en", "x-default": "/" });
  });

  it("só declara os idiomas em que a página existe", () => {
    // Página traduzida só para o inglês: um /es/... daria 404 e o Google descartaria o par.
    expect(languageAlternates("/santos", ["en"])).toEqual({
      "pt-BR": "/santos",
      en: "/en/santos",
      "x-default": "/santos",
    });
  });
});

describe("idiomas de cada página", () => {
  it("agrupa as URLs traduzidas pelo caminho em português", () => {
    const porCaminho = translationLangsByPath(["/en", "/es", "/en/santos", "/en/santos/francisco", "/es/oracoes"]);
    expect(porCaminho.get("/")).toEqual(["en", "es"]);
    expect(porCaminho.get("/santos")).toEqual(["en"]);
    expect(porCaminho.get("/santos/francisco")).toEqual(["en"]);
    expect(porCaminho.get("/oracoes")).toEqual(["es"]);
    expect(porCaminho.has("/liturgia")).toBe(false);
  });

  it("ignora caminhos em português", () => {
    expect(translationLangsByPath(["/santos"]).size).toBe(0);
  });
});
