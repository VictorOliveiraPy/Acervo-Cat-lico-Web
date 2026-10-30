import { describe, expect, it } from "vitest";

import { languageAlternates } from "@/lib/i18n";

describe("hreflang", () => {
  it("deve declarar os idiomas e o x-default em português", () => {
    expect(languageAlternates("/oracoes")).toEqual({
      "pt-BR": "/oracoes",
      es: "/es/oracoes",
      "x-default": "/oracoes",
    });
  });

  it("deve apontar a home de cada idioma", () => {
    expect(languageAlternates("/")).toEqual({ "pt-BR": "/", es: "/es", "x-default": "/" });
  });
});
