import { describe, expect, it } from "vitest";

import { domingoDePascoa, tempoLiturgico, tempoLiturgicoRotulo } from "@/lib/tempoLiturgico";

describe("Páscoa", () => {
  it.each([
    [2024, "2024-03-31"],
    [2025, "2025-04-20"],
    [2026, "2026-04-05"],
    [2027, "2027-03-28"],
    [2038, "2038-04-25"], // a mais tardia possível
    [2285, "2285-03-22"], // a mais cedo possível
    [1981, "1981-04-19"], // anos de exceção do cômputo (o termo m)
    [2049, "2049-04-18"],
    [2016, "2016-03-27"],
    [2019, "2019-04-21"],
  ])("em %i cai em %s", (ano, data) => {
    expect(domingoDePascoa(ano)).toBe(data);
  });
});

describe("tempo litúrgico pela data", () => {
  it.each([
    // 2026: Batismo do Senhor em 11/1, Cinzas em 18/2, Páscoa em 5/4,
    // Pentecostes em 24/5, Cristo Rei em 22/11, 1º do Advento em 29/11.
    ["2026-01-10", "Tempo do Natal", undefined],
    ["2026-01-11", "Tempo do Natal", undefined], // Batismo do Senhor fecha o Natal
    ["2026-01-12", "Tempo Comum", 1],
    ["2026-02-15", "Tempo Comum", 6],
    ["2026-02-17", "Tempo Comum", 6],
    ["2026-02-18", "Quaresma", undefined], // Quarta-feira de Cinzas
    ["2026-03-28", "Quaresma", undefined],
    ["2026-03-29", "Semana Santa", undefined], // Domingo de Ramos
    ["2026-04-04", "Semana Santa", undefined], // Sábado Santo
    ["2026-04-05", "Tempo Pascal", undefined],
    ["2026-05-24", "Tempo Pascal", undefined], // Pentecostes
    ["2026-05-25", "Tempo Comum", 8],
    ["2026-11-19", "Tempo Comum", 33],
    ["2026-11-22", "Tempo Comum", 34], // Cristo Rei
    ["2026-11-28", "Tempo Comum", 34],
    ["2026-11-29", "Advento", undefined],
    ["2026-12-24", "Advento", undefined],
    ["2026-12-25", "Tempo do Natal", undefined],
    // 2027: Epifania em 3/1 (domingo entre 2 e 8), Batismo em 10/1.
    ["2027-01-10", "Tempo do Natal", undefined],
    ["2027-01-11", "Tempo Comum", 1],
  ])("%s é %s, semana %s", (data, tempo, semana) => {
    expect(tempoLiturgico(data)).toEqual({ tempo, semana });
  });

  it("Epifania no dia 7 ou 8 passa o Batismo para a segunda-feira", () => {
    // 2029: Epifania em 7/1, Batismo na segunda 8/1; o Tempo Comum começa no dia 9.
    expect(tempoLiturgico("2029-01-08")).toEqual({ tempo: "Tempo do Natal", semana: undefined });
    expect(tempoLiturgico("2029-01-09")).toEqual({ tempo: "Tempo Comum", semana: 1 });
  });
});

describe("rótulo", () => {
  it("põe a semana no Tempo Comum", () => {
    expect(tempoLiturgicoRotulo("2026-11-19")).toBe("Tempo Comum · 33ª semana");
    expect(tempoLiturgicoRotulo("2026-12-01")).toBe("Advento");
  });
});
