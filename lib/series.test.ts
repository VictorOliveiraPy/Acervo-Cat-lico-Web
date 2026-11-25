import { describe, expect, it } from "vitest";

import { amanha, jaPedido, pedidoEvangelho, pedidoSantoDoDia } from "@/lib/series";

describe("séries do estúdio", () => {
  it("amanhã no calendário, inclusive na virada do mês e do ano", () => {
    expect(amanha("2026-11-20")).toBe("2026-11-21");
    expect(amanha("2026-11-30")).toBe("2026-12-01");
    expect(amanha("2026-12-31")).toBe("2027-01-01");
  });

  it("santo do dia vira um Cinema que leva ao verbete", () => {
    const pedido = pedidoSantoDoDia(
      { titulo: "Santa Cecília de Roma", slug: "cecilia-de-roma", resumo: "Mártir romana, padroeira da música." },
      "2026-11-22",
    );
    expect(pedido).toMatchObject({ formato: "cinema", tema: "Santa Cecília de Roma", pergunta: "", voz_propria: true });
    expect(pedido.notas).toContain("mistério");
    expect(pedido.notas).toContain("Santo do dia");
    expect(pedido.notas).toContain("22 de novembro");
    expect(pedido.notas).toContain("https://compendio-catolico.com/santos/cecilia-de-roma");
    expect(pedido.notas).toContain("padroeira da música");
  });

  it("santo com a minha voz pede a gravação, que é o padrão", () => {
    const pedido = pedidoSantoDoDia({ titulo: "São José", slug: "sao-jose", resumo: "" }, "2027-03-19");
    expect(pedido.voz_propria).toBe(true);
    expect(pedidoSantoDoDia({ titulo: "São José", slug: "sao-jose", resumo: "" }, "2027-03-19", false).voz_propria).toBe(false);
  });

  it("Evangelho também sai com a minha voz", () => {
    const liturgia = { data: "2026-11-21", celebracao: null, evangelho: { referencia: "Mt 12,46-50", texto: "Naquele tempo." } };
    expect(pedidoEvangelho(liturgia).voz_propria).toBe(true);
    expect(pedidoEvangelho(liturgia, false).voz_propria).toBe(false);
  });

  it("Evangelho vira uma Catequese com o texto e o link do dia", () => {
    const pedido = pedidoEvangelho({
      data: "2026-11-21",
      celebracao: "Apresentação de Nossa Senhora",
      evangelho: { referencia: "Mt 12,46-50", texto: "Naquele tempo, 46enquanto Jesus falava às multidões... " + "x".repeat(3000) },
    });
    expect(pedido.formato).toBe("catequese");
    expect(pedido.tema).toBe("O Evangelho de 21 de novembro: Mt 12,46-50");
    expect(pedido.notas).toContain("https://compendio-catolico.com/liturgia-diaria/2026-11-21");
    expect(pedido.notas).toContain("enquanto Jesus falava");
    expect(pedido.notas.length).toBeLessThanOrEqual(2000);
  });

  it("não pede de novo o que já está na fila ou pronto", () => {
    const pedidos = [
      { tema: "Santa Cecília de Roma", status: "na_fila" },
      { tema: "São José", status: "cancelado" },
    ];
    expect(jaPedido(pedidos, "Santa Cecília de Roma")).toBe(true);
    expect(jaPedido(pedidos, "São José")).toBe(false); // cancelado pode pedir de novo
  });
});
