import { describe, expect, it } from "vitest";

import { readingMinutes, roundRobin, whatsappShareUrl } from "@/lib/entryDisplay";
import { liturgicalSeason } from "@/lib/liturgia";

describe("roundRobin", () => {
  it("deve intercalar os grupos, mesmo de tamanhos diferentes", () => {
    expect(roundRobin([["a1", "a2", "a3"], ["b1"], ["c1", "c2"]])).toEqual([
      "a1",
      "b1",
      "c1",
      "a2",
      "c2",
      "a3",
    ]);
  });
});

describe("readingMinutes", () => {
  it("deve arredondar para cima a 200 palavras por minuto", () => {
    expect(readingMinutes("palavra ".repeat(200))).toBe(1);
    expect(readingMinutes("palavra ".repeat(201))).toBe(2);
  });

  it("deve mostrar ao menos um minuto", () => {
    expect(readingMinutes("")).toBe(1);
  });
});

describe("whatsappShareUrl", () => {
  it("deve codificar o título e o endereço", () => {
    expect(whatsappShareUrl("São José", "https://x.com/a")).toBe(
      "https://wa.me/?text=S%C3%A3o%20Jos%C3%A9%20https%3A%2F%2Fx.com%2Fa",
    );
  });
});

describe("liturgicalSeason", () => {
  it("deve reconhecer o tempo escrito na celebração", () => {
    expect(liturgicalSeason("6ª feira da 30ª Semana do Tempo Comum")).toBe("Tempo Comum");
    expect(liturgicalSeason("1º Domingo do Advento")).toBe("Advento");
    expect(liturgicalSeason("3ª feira da 2ª Semana da Quaresma")).toBe("Quaresma");
    expect(liturgicalSeason("Sábado da 4ª Semana da Páscoa")).toBe("Tempo Pascal");
  });

  it("não deve adivinhar quando o texto não diz", () => {
    expect(liturgicalSeason("Solenidade de Todos os Santos")).toBeNull();
    expect(liturgicalSeason(null)).toBeNull();
  });
});
