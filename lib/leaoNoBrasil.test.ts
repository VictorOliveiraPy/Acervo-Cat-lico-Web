import { describe, expect, it } from "vitest";

import { META, diasAteAVisita, fraseDasConfirmacoes, linkConfirmar, somaConfirmacoes } from "@/lib/leaoNoBrasil";

describe("Leão XIV no Brasil", () => {
  it("conta os dias até a chegada, em 3 de setembro de 2027", () => {
    expect(diasAteAVisita("2026-11-24")).toBe(283);
    expect(diasAteAVisita("2027-09-02")).toBe(1);
    expect(diasAteAVisita("2027-09-03")).toBe(0);
    expect(diasAteAVisita("2027-10-01")).toBe(0); // depois da visita, nunca negativo
  });

  it("soma as confirmações de todos os estados", () => {
    expect(somaConfirmacoes([{ total: 1 }, { total: 4 }, { total: 1 }])).toBe(6);
    expect(somaConfirmacoes([])).toBe(0);
  });

  it("fala no singular e no plural, com a meta", () => {
    expect(fraseDasConfirmacoes(1)).toBe("1 peregrino já confirmou");
    expect(fraseDasConfirmacoes(6)).toBe("6 peregrinos já confirmaram");
    expect(fraseDasConfirmacoes(1500)).toBe("1.500 peregrinos já confirmaram");
    expect(META).toBe(2027);
  });

  it("marca de onde veio a visita", () => {
    expect(linkConfirmar("home")).toBe(
      "https://leaonobrasil.com.br/?utm_source=compendio&utm_medium=bloco&utm_campaign=home",
    );
  });
});
