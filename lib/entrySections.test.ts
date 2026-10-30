import { describe, expect, it } from "vitest";

import { entrySectionLinks, entryTocLinks, type EntrySectionFields } from "@/lib/entrySections";

const EMPTY: EntrySectionFields = {
  biografia: [],
  oracao: null,
  frases: [],
  iconografia: null,
  curiosidades: [],
  faq: [],
};

describe("seções opcionais do verbete", () => {
  it("não deve listar seção sem conteúdo", () => {
    expect(entrySectionLinks(EMPTY)).toEqual([]);
  });

  it("deve listar as seções na ordem da página", () => {
    const links = entrySectionLinks({
      biografia: [{ titulo: "Primeiros anos", texto: "A" }],
      oracao: "B",
      frases: ["C"],
      iconografia: "D",
      curiosidades: ["E"],
      faq: [{ pergunta: "F?", resposta: "G" }],
    });
    expect(links.map(({ href }) => href)).toEqual([
      "#biografia-1",
      "#oracao",
      "#frases",
      "#iconografia",
      "#curiosidades",
      "#faq",
    ]);
  });

  it("deve mostrar o sumário só a partir de 3 seções", () => {
    const two = { ...EMPTY, oracao: "B", frases: ["C"] };
    expect(entryTocLinks(two)).toEqual([]);
    expect(entryTocLinks({ ...two, iconografia: "D" })).toHaveLength(3);
  });
});
