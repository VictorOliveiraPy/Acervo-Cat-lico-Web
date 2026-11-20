import { describe, expect, it } from "vitest";

import { isAdminEmail, nomeDoEvento, variacao } from "@/lib/painel";

describe("acesso ao painel", () => {
  it("aceita só e-mails da lista, sem diferença de maiúsculas e espaços", () => {
    const lista = " Dono@Exemplo.com , outra@exemplo.com ";
    expect(isAdminEmail("dono@exemplo.com", lista)).toBe(true);
    expect(isAdminEmail("OUTRA@exemplo.com", lista)).toBe(true);
    expect(isAdminEmail("intruso@exemplo.com", lista)).toBe(false);
  });

  it("sem lista ou sem e-mail, ninguém entra", () => {
    expect(isAdminEmail("dono@exemplo.com", undefined)).toBe(false);
    expect(isAdminEmail("dono@exemplo.com", "")).toBe(false);
    expect(isAdminEmail(null, "dono@exemplo.com")).toBe(false);
    expect(isAdminEmail("", ",,")).toBe(false);
  });
});

describe("variação contra o período anterior", () => {
  it.each([
    [125, 100, "+25%"],
    [90, 100, "−10%"],
    [100, 100, "0%"],
    [5, 0, "novo"],
    [0, 0, null],
    [1, 3, "−67%"],
  ])("%i contra %i é %s", (atual, antes, esperado) => {
    expect(variacao(atual, antes)).toBe(esperado);
  });
});

describe("nome dos eventos", () => {
  it("traduz os conhecidos e mantém o resto", () => {
    expect(nomeDoEvento("candle_lit")).toBe("Velas acesas");
    expect(nomeDoEvento("search_submitted")).toBe("Buscas");
    expect(nomeDoEvento("algo_novo")).toBe("algo_novo");
  });
});
