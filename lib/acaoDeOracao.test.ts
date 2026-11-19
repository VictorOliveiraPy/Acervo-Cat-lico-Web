import { describe, expect, it } from "vitest";

import { acaoDeOracao, velaDoSanto } from "@/lib/acaoDeOracao";
import { VELA_TIPOS } from "@/lib/velas";

describe("vela de cada santo", () => {
  it.each([
    ["sao-jose", "sao_jose"],
    ["judas-tadeu", "sao_judas_tadeu"],
    ["carlo-acutis", "carlo_acutis"],
    ["agostinho-de-hipona", "santo_agostinho"],
    ["bento-de-nursia", "sao_bento"],
    ["teresa-de-lisieux", "santa_terezinha"],
    ["antonio-de-padua", "santo_antonio"],
    ["joao-batista", "sao_joao_batista"],
  ])("%s acende a vela %s", (slug, tipo) => {
    expect(velaDoSanto(slug)).toBe(tipo);
  });

  it("santo sem vela própria não tem", () => {
    expect(velaDoSanto("francisco-de-assis")).toBeNull();
    // Mesmo nome, outro santo: Bento José Labre não é São Bento.
    expect(velaDoSanto("bento-jose-labre")).toBeNull();
  });

  it("toda vela apontada existe no mural", () => {
    const tipos = new Set(VELA_TIPOS.map(({ tipo }) => tipo));
    for (const slug of ["sao-jose", "judas-tadeu", "carlo-acutis", "agostinho-de-hipona", "bento-de-nursia", "teresa-de-lisieux", "antonio-de-padua", "joao-batista"]) {
      expect(tipos.has(velaDoSanto(slug)!)).toBe(true);
    }
  });
});

describe("ação de oração no fim do verbete", () => {
  it("santo com vela: invoca e abre o mural com a vela dele", () => {
    expect(acaoDeOracao({ categoria: "santos", slug: "antonio-de-padua", titulo: "Santo Antônio de Pádua" })).toEqual({
      invocacao: "Santo Antônio de Pádua, rogai por nós.",
      texto: "Acenda uma vela pedindo a intercessão de Santo Antônio de Pádua e deixe sua intenção no mural.",
      href: "/velas?tipo=santo_antonio#acender",
      rotulo: "Acender uma vela",
    });
  });

  it("santo sem vela própria: invoca e abre o mural", () => {
    const acao = acaoDeOracao({ categoria: "santos", slug: "francisco-de-assis", titulo: "São Francisco de Assis" });
    expect(acao.invocacao).toBe("São Francisco de Assis, rogai por nós.");
    expect(acao.href).toBe("/velas#acender");
  });

  it("título com apelido entre parênteses invoca só o nome", () => {
    const acao = acaoDeOracao({ categoria: "santos", slug: "pio", titulo: "São Pio de Pietrelcina (Padre Pio)" });
    expect(acao.invocacao).toBe("São Pio de Pietrelcina, rogai por nós.");
  });

  it("tira o apelido grudado ou com espaço no fim, e só no fim", () => {
    const invocar = (titulo: string) => acaoDeOracao({ categoria: "santos", slug: "x", titulo }).invocacao;
    expect(invocar("São Pio(Padre Pio)")).toBe("São Pio, rogai por nós.");
    expect(invocar("São Pio (Padre Pio) ")).toBe("São Pio, rogai por nós.");
    expect(invocar("Santa Maria (Mãe de Deus) e São José")).toBe("Santa Maria (Mãe de Deus) e São José, rogai por nós.");
  });

  it("outros verbetes levam ao Evangelho do dia", () => {
    expect(acaoDeOracao({ categoria: "concilios", slug: "trento", titulo: "Concílio de Trento" })).toEqual({
      invocacao: null,
      texto: "Leve o que leu para a oração: o Evangelho de hoje está a um clique.",
      href: "/liturgia-diaria",
      rotulo: "Rezar com o Evangelho de hoje",
    });
  });
});
