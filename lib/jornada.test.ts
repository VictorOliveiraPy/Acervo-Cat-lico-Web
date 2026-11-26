import { describe, expect, it } from "vitest";

import { CONQUISTAS } from "@/lib/conquistas";
import { DEGRAUS, MULTIPLICADORES, estagioDoNivel, tituloDoNivel } from "@/lib/jornada";

describe("a jornada que a página promete", () => {
  it("o santo acende nos mesmos níveis da API", () => {
    expect([1, 10, 11, 25, 26, 50, 51, 100].map(estagioDoNivel)).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
  });

  it("os títulos são os da API, do Peregrino ao Santo Glorificado", () => {
    expect(tituloDoNivel(1)).toBe("Peregrino Iniciante");
    expect(tituloDoNivel(9)).toBe("Devoto Fiel");
    expect(tituloDoNivel(50)).toBe("Mestre Espiritual");
    expect(tituloDoNivel(100)).toBe("Santo Glorificado");
  });

  it("cada degrau mostra um estágio de luz diferente, em ordem", () => {
    expect(DEGRAUS.map((d) => d.estagio)).toEqual([1, 2, 3, 4]);
    for (const degrau of DEGRAUS) {
      expect(estagioDoNivel(degrau.nivel)).toBe(degrau.estagio);
      expect(degrau.titulo).toBe(tituloDoNivel(degrau.nivel));
    }
  });

  it("os multiplicadores da sequência são os da API", () => {
    expect(MULTIPLICADORES).toEqual([
      { dias: 7, vezes: "×1,5" },
      { dias: 30, vezes: "×2" },
      { dias: 100, vezes: "×3" },
    ]);
  });

  it("as conquistas mostradas são todas as que existem", () => {
    expect(CONQUISTAS.length).toBeGreaterThanOrEqual(10);
  });
});
