import { describe, expect, it } from "vitest";

import {
  describeSearchResults,
  groupByCategory,
  normalizeForMatch,
  splitByTerm,
} from "@/lib/search";
import type { SearchResult } from "@/lib/schemas";

function result(
  categoria: SearchResult["categoria"],
  slug: string,
): SearchResult {
  return { categoria, slug, titulo: slug, trecho: "…trecho…" };
}

describe("normalizeForMatch", () => {
  it("should strip accents and case while keeping the original length", () => {
    // Given
    const text = "Concílio de Niceia";

    // When
    const normalized = normalizeForMatch(text);

    // Then — o comprimento igual é o que permite recortar o texto original
    expect(normalized).toBe("concilio de niceia");
    expect(normalized).toHaveLength(text.length);
  });
});

describe("splitByTerm", () => {
  it("should mark an occurrence typed without accents", () => {
    // Given
    const trecho = "A Eucaristia é fonte e ápice da vida cristã.";

    // When
    const segments = splitByTerm(trecho, "eucaristia");

    // Then — o trecho marcado preserva a acentuação do texto original
    expect(segments.filter((segment) => segment.isMatch)).toEqual([
      { text: "Eucaristia", isMatch: true },
    ]);
    expect(segments.map((segment) => segment.text).join("")).toBe(trecho);
  });

  it("should mark every occurrence of the term", () => {
    // When
    const segments = splitByTerm("Papa, papa e Papado", "papa");

    // Then
    expect(segments.filter((segment) => segment.isMatch)).toHaveLength(3);
  });

  it("should return the whole text unmarked when the term is absent", () => {
    // When
    const segments = splitByTerm("Concílio de Trento", "batismo");

    // Then
    expect(segments).toEqual([{ text: "Concílio de Trento", isMatch: false }]);
  });

  it("should not mark anything when the term is only whitespace", () => {
    expect(splitByTerm("Texto", "   ")).toEqual([
      { text: "Texto", isMatch: false },
    ]);
  });
});

describe("groupByCategory", () => {
  it("should group results in the editorial navigation order", () => {
    // Given resultados que chegaram fora da ordem do menu
    const results = [
      result("concilios", "trento"),
      result("santos", "teresa-de-avila"),
      result("papas", "sao-pedro"),
      result("santos", "francisco-de-assis"),
    ];

    // When
    const groups = groupByCategory(results);

    // Then — santos vem antes de papas, que vem antes de concílios
    expect(groups.map((group) => group.slug)).toEqual([
      "santos",
      "papas",
      "concilios",
    ]);
    expect(groups[0]?.results).toHaveLength(2);
  });

  it("should omit categories with no occurrence instead of showing empty headings", () => {
    // When
    const groups = groupByCategory([result("crisma", "os-frutos-do-espirito-santo")]);

    // Then
    expect(groups).toHaveLength(1);
    expect(groups[0]?.label).toBe("Crisma");
  });
});

describe("describeSearchResults", () => {
  it("should describe how many occurrences appeared and in how many categories", () => {
    expect(describeSearchResults(4, 3)).toBe("4 ocorrências em 3 categorias");
    expect(describeSearchResults(1, 1)).toBe("1 ocorrência em 1 categoria");
    expect(describeSearchResults(0, 0)).toBe("Nenhuma ocorrência");
  });
});
