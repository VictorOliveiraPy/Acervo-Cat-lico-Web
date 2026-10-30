import { describe, expect, it } from "vitest";

import { groupByCategory, parseThemePage, themePath } from "@/lib/temas";

describe("parseThemePage", () => {
  it("deve tratar a rota sem número como a primeira página", () => {
    expect(parseThemePage(undefined)).toBe(1);
    expect(parseThemePage([])).toBe(1);
    expect(parseThemePage(["2"])).toBe(2);
  });

  it("deve recusar o que não é página válida", () => {
    for (const segments of [["1"], ["0"], ["-1"], ["abc"], ["02"], ["2", "3"]]) {
      expect(parseThemePage(segments), segments.join("/")).toBeNull();
    }
  });
});

describe("themePath", () => {
  it("deve omitir o número da primeira página", () => {
    expect(themePath("franciscanos")).toBe("/tema/franciscanos");
    expect(themePath("franciscanos", 2)).toBe("/tema/franciscanos/2");
  });
});

describe("groupByCategory", () => {
  it("deve agrupar mantendo a ordem", () => {
    const groups = groupByCategory([
      { categoria: "santos", id: 1 },
      { categoria: "santos", id: 2 },
      { categoria: "papas", id: 3 },
    ]);
    expect(groups.map(({ categoria, entries }) => [categoria, entries.length])).toEqual([
      ["santos", 2],
      ["papas", 1],
    ]);
  });
});
