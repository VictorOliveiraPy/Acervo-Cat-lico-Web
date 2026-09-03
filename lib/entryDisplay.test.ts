import { describe, expect, it } from "vitest";

import {
  entryHighlight,
  entryMetaFields,
  entryOrdinal,
  formatCatechismParagraphs,
  formatEntryCount,
  formatTextRange,
  formatYearRange,
  paragraphs,
} from "@/lib/entryDisplay";
import type { Entry } from "@/lib/schemas";

/** Base comum das entradas de teste, para cada caso só declarar o que importa. */
function baseFields(slug: string) {
  return {
    id: `teste:${slug}`,
    slug,
    titulo: "Título",
    resumo: "Resumo",
    corpo: "Corpo",
    tags: [],
    imagem: null,
    imagem_credito: null,
    fontes: [],
  };
}

const conciliosNiceia: Entry = {
  ...baseFields("niceia-i"),
  categoria: "concilios",
  numero_ordem: 1,
  ano_inicio: 325,
  ano_fim: 325,
  local: "Niceia, Bitínia",
};

const santoFrancisco: Entry = {
  ...baseFields("francisco-de-assis"),
  categoria: "santos",
  festa: "4 de outubro",
  patronato: ["Itália", "Ecologistas"],
  nascimento: "c. 1181-1182, Assis (Itália)",
  morte: "3 de outubro de 1226, Assis (Itália)",
};

const papaPedro: Entry = {
  ...baseFields("sao-pedro"),
  categoria: "papas",
  numero_ordem: 1,
  pontificado_inicio: null,
  pontificado_fim: null,
};

describe("formatYearRange", () => {
  it("should show a single year when the council began and ended in the same year", () => {
    // Given / When
    const range = formatYearRange(325, 325);

    // Then
    expect(range).toBe("325");
  });

  it("should join distinct years with an en dash", () => {
    expect(formatYearRange(1545, 1563)).toBe("1545\u20131563");
  });

  it("should describe an open range when only one end is known", () => {
    expect(formatYearRange(1962, null)).toBe("desde 1962");
    expect(formatYearRange(null, 1965)).toBe("até 1965");
  });

  it("should return null when no year is known", () => {
    expect(formatYearRange(null, null)).toBeNull();
  });
});

describe("formatTextRange", () => {
  it("should keep the imprecision of the source text intact", () => {
    // Given
    const start = "c. 1181-1182";

    // When
    const range = formatTextRange(start, "1226");

    // Then
    expect(range).toBe("c. 1181-1182 \u2013 1226");
  });

  it("should ignore blank ends coming from the API", () => {
    expect(formatTextRange("  ", "  ")).toBeNull();
  });
});

describe("formatCatechismParagraphs", () => {
  it("should prefix catechism paragraph ranges with the CIC abbreviation", () => {
    expect(formatCatechismParagraphs(["1285-1321"])).toBe("CIC 1285-1321");
  });

  it("should return null when the entry has no paragraph reference", () => {
    expect(formatCatechismParagraphs([])).toBeNull();
  });
});

describe("entryOrdinal", () => {
  it("should number a pope by his place in the apostolic succession", () => {
    expect(entryOrdinal(papaPedro)).toBe("1º Papa");
  });

  it("should not number categories without a canonical order", () => {
    // Given uma entrada de santos (a ordem no arquivo é editorial)
    // When / Then
    expect(entryOrdinal(santoFrancisco)).toBeNull();
  });
});

describe("entryHighlight", () => {
  it("should highlight the feast day for a saint", () => {
    expect(entryHighlight(santoFrancisco)).toBe("Festa em 4 de outubro");
  });

  it("should combine years and place for a council", () => {
    expect(entryHighlight(conciliosNiceia)).toBe("325 · Niceia, Bitínia");
  });

  it("should return null when a pope has no documented pontificate dates", () => {
    // Given São Pedro, cujas datas de pontificado o acervo não afirma
    // When / Then
    expect(entryHighlight(papaPedro)).toBeNull();
  });
});

describe("entryMetaFields", () => {
  it("should list a saint's own fields in editorial order", () => {
    // When
    const fields = entryMetaFields(santoFrancisco);

    // Then
    expect(fields.map((item) => item.label)).toEqual([
      "Festa",
      "Nascimento",
      "Morte",
      "Patronato",
    ]);
    expect(fields.at(-1)?.value).toBe("Itália · Ecologistas");
  });

  it("should omit fields the source does not affirm", () => {
    // Given São Pedro, sem datas de pontificado
    // When
    const fields = entryMetaFields(papaPedro);

    // Then
    expect(fields).toEqual([{ label: "Sucessão", value: "1º Bispo de Roma" }]);
  });
});

describe("paragraphs", () => {
  it("should split the body on blank lines and unwrap soft line breaks", () => {
    // Given
    const corpo = "Primeiro parágrafo\nem duas linhas.\n\nSegundo parágrafo.\n\n";

    // When
    const blocks = paragraphs(corpo);

    // Then
    expect(blocks).toEqual([
      "Primeiro parágrafo em duas linhas.",
      "Segundo parágrafo.",
    ]);
  });
});

describe("formatEntryCount", () => {
  it("should use the singular for a single entry", () => {
    expect(formatEntryCount(1)).toBe("1 entrada");
    expect(formatEntryCount(3)).toBe("3 entradas");
  });
});
