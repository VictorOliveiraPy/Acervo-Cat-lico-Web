import { describe, expect, it } from "vitest";

import { DURACOES, STATUS_PEDIDO, aceitaVozPropria, notasComDuracao, isAdminEmail, nomeDoEvento, pedidoEmAndamento, slugDoTitulo, variacao } from "@/lib/painel";

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
    [5, 0, null], // período anterior sem dados: não há com o que comparar
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

describe("endereço de um vídeo enviado", () => {
  it("vira o mesmo slug que a API e o estúdio aceitam", () => {
    expect(slugDoTitulo("São Leão Magno, Papa!")).toBe("sao-leao-magno-papa");
    expect(slugDoTitulo("   ")).toBe("video");
    expect(slugDoTitulo("x".repeat(200)).length).toBeLessThanOrEqual(60);
    expect(slugDoTitulo("A  —  B")).toBe("a-b");
  });
});

describe("voz própria", () => {
  it("em todos os formatos de vídeo", () => {
    expect(aceitaVozPropria("cinema")).toBe(true);
    expect(aceitaVozPropria("objecao")).toBe(true);
    expect(aceitaVozPropria("catequese")).toBe(true);
    expect(aceitaVozPropria("meme")).toBe(false);
  });
});

describe("duração pedida", () => {
  it("automática deixa as notas como estão", () => {
    expect(notasComDuracao("Fale da infância.", "auto")).toBe("Fale da infância.");
  });

  it("escolhida vai para o roteirista nas notas", () => {
    expect(notasComDuracao("", "longo")).toBe("Duração: de 6 a 10 minutos de fala.");
    expect(notasComDuracao("Fale da infância.", "curto")).toBe("Fale da infância.\nDuração: de 1 a 2 minutos de fala.");
  });

  it("toda opção tem um nome e a automática vem primeiro", () => {
    expect(DURACOES[0].valor).toBe("auto");
    expect(DURACOES.map((d) => d.valor)).toEqual(["auto", "curto", "medio", "longo"]);
  });
});

describe("status dos pedidos", () => {
  it("tem texto para cada estado e diz quais ainda andam", () => {
    expect(STATUS_PEDIDO.gerando).toBe("Gerando");
    expect(STATUS_PEDIDO.aguardando_voz).toBe("Esperando a sua voz");
    expect(pedidoEmAndamento("aguardando_voz")).toBe(false); // espera você, não se atualiza sozinho
    expect(pedidoEmAndamento("na_fila")).toBe(true);
    expect(pedidoEmAndamento("gerando")).toBe(true);
    expect(pedidoEmAndamento("pronto")).toBe(false);
  });
});
