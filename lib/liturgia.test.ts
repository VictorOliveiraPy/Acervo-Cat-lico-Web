import { describe, expect, it } from "vitest";

import {
  formatLongDate,
  isServedLiturgyDate,
  neighborLiturgyDates,
  todayInBrazil,
  trechoDoEvangelho,
} from "@/lib/liturgia";

const TODAY = "2026-10-30";

describe("datas da liturgia", () => {
  it("deve escrever a data por extenso", () => {
    expect(formatLongDate("2026-10-30")).toBe("30 de outubro de 2026");
    expect(formatLongDate("2026-03-01")).toBe("1 de março de 2026");
  });

  it("deve usar o dia de Brasília, mesmo já sendo outro dia em UTC", () => {
    expect(todayInBrazil(new Date("2026-10-31T02:00:00Z"))).toBe("2026-10-30");
    expect(todayInBrazil(new Date("2026-10-31T04:00:00Z"))).toBe("2026-10-31");
  });

  it("deve aceitar só datas reais dentro da janela publicada", () => {
    expect(isServedLiturgyDate("2026-10-30", TODAY)).toBe(true);
    expect(isServedLiturgyDate("2026-11-06", TODAY)).toBe(true);
    expect(isServedLiturgyDate("2026-11-07", TODAY)).toBe(false);
    expect(isServedLiturgyDate("2026-08-30", TODAY)).toBe(true);
    expect(isServedLiturgyDate("2026-08-29", TODAY)).toBe(false);
    expect(isServedLiturgyDate("2026-02-30", "2026-02-20")).toBe(false);
    expect(isServedLiturgyDate("hoje", TODAY)).toBe(false);
  });

  it("não deve oferecer um próximo dia além da janela", () => {
    expect(neighborLiturgyDates("2026-10-30", TODAY)).toEqual({
      previous: "2026-10-29",
      next: "2026-10-31",
    });
    expect(neighborLiturgyDates("2026-11-06", TODAY).next).toBeNull();
    expect(neighborLiturgyDates("2026-08-30", TODAY).previous).toBeNull();
  });
});

describe("trecho do Evangelho para a home", () => {
  const texto =
    "Naquele tempo, 41quando Jesus se aproximou de Jerusalém e viu a cidade, começou a chorar. E disse: 42“Se tu também compreendesses hoje o que te pode trazer a paz!";

  it("tira os números de versículo grudados nas palavras", () => {
    expect(trechoDoEvangelho(texto, 500)).toBe(
      "Naquele tempo, quando Jesus se aproximou de Jerusalém e viu a cidade, começou a chorar. E disse: “Se tu também compreendesses hoje o que te pode trazer a paz!",
    );
  });

  it("corta numa palavra inteira e marca com reticências", () => {
    const trecho = trechoDoEvangelho(texto, 60);
    expect(trecho).toBe("Naquele tempo, quando Jesus se aproximou de Jerusalém e viu…");
    expect(trecho.length).toBeLessThanOrEqual(61);
  });

  it("não mexe em números que fazem parte do texto", () => {
    expect(trechoDoEvangelho("Eram 12 apóstolos, 3 vezes.", 100)).toBe("Eram 12 apóstolos, 3 vezes.");
  });

  it("tira o versículo também no começo do texto", () => {
    expect(trechoDoEvangelho("1No princípio era a Palavra", 100)).toBe("No princípio era a Palavra");
  });

  it("texto com o tamanho exato do limite fica inteiro", () => {
    expect(trechoDoEvangelho("Amai-vos", 8)).toBe("Amai-vos");
  });

  it("corte no meio de uma palavra longa volta para a anterior", () => {
    expect(trechoDoEvangelho("Bem-aventurados os misericordiosos porque", 28)).toBe("Bem-aventurados os…");
  });

  it("tira a pontuação toda antes das reticências", () => {
    expect(trechoDoEvangelho("Quem sou eu?! Disse Pedro", 14)).toBe("Quem sou eu…");
  });

  it("junta quebras de linha e espaços repetidos", () => {
    expect(trechoDoEvangelho("Feliz quem\n  ouve 3a Palavra", 100)).toBe("Feliz quem ouve a Palavra");
  });
});
