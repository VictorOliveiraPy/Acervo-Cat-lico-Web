import { describe, expect, it } from "vitest";

import {
  CONQUISTAS,
  conquistas,
  novasConquistas,
  proximaConquista,
  quantoFalta,
  resumoDoProgresso,
  type ProgressoDoPerfil,
} from "@/lib/conquistas";

const ZERO: ProgressoDoPerfil = { recorde: 0, nivel: 1, licoes: 0, licoesTotal: 12, favoritos: 0, anotacoes: 0, caminho: 0 };
const ganhas = (p: ProgressoDoPerfil) => conquistas(p).filter((c) => c.ganha).map((c) => c.id);

describe("conquistas", () => {
  it("perfil novo não tem nenhuma", () => {
    expect(ganhas(ZERO)).toEqual([]);
  });

  it("os ids são únicos", () => {
    expect(new Set(CONQUISTAS.map((c) => c.id)).size).toBe(CONQUISTAS.length);
  });

  it("a sequência conta pelo recorde, que não volta para trás", () => {
    expect(ganhas({ ...ZERO, recorde: 7 })).toEqual(["semana-santa"]);
    expect(ganhas({ ...ZERO, recorde: 30 })).toEqual(["semana-santa", "mes-de-graca"]);
  });

  it("o nível acompanha os estágios do santo", () => {
    expect(ganhas({ ...ZERO, nivel: 9 })).toEqual([]);
    expect(ganhas({ ...ZERO, nivel: 25 })).toEqual(["servo-dedicado", "portador-da-esperanca"]);
  });

  it("todas as lições só valem quando há lições", () => {
    expect(ganhas({ ...ZERO, licoes: 12 })).toContain("doutor-da-academia");
    expect(ganhas({ ...ZERO, licoesTotal: 0 })).not.toContain("doutor-da-academia");
  });

  it("o progresso não passa da meta", () => {
    const semana = conquistas({ ...ZERO, recorde: 40 }).find((c) => c.id === "semana-santa")!;
    expect(semana).toMatchObject({ atual: 7, alvo: 7, ganha: true });
  });
});

describe("próxima conquista", () => {
  it("é a mais perto em proporção", () => {
    const lista = conquistas({ ...ZERO, recorde: 5, favoritos: 20 });
    // 20 de 25 favoritos (80%) está mais perto que 5 de 7 dias (71%).
    expect(proximaConquista(lista)?.id).toBe("florilegio");
  });

  it("compara a proporção, não o tamanho do número", () => {
    // 6 de 7 dias (86%) ganha de 20 de 25 favoritos (80%), mesmo com números menores.
    expect(proximaConquista(conquistas({ ...ZERO, recorde: 6, favoritos: 20 }))?.id).toBe("semana-santa");
  });

  it("no empate fica a primeira da lista", () => {
    const noZero = conquistas(ZERO).filter((c) => c.id === "semana-santa" || c.id === "primeiros-passos");
    expect(proximaConquista(noZero)?.id).toBe("semana-santa");
    expect(proximaConquista([...noZero].reverse())?.id).toBe("primeiros-passos");
  });

  it("não existe quando todas foram ganhas", () => {
    const tudo = { recorde: 365, nivel: 100, licoes: 12, licoesTotal: 12, favoritos: 25, anotacoes: 10, caminho: 36 };
    expect(proximaConquista(conquistas(tudo))).toBeNull();
  });

  it("diz o que falta em palavras, no singular e no plural", () => {
    const lista = conquistas({ ...ZERO, recorde: 6, anotacoes: 7 });
    expect(quantoFalta(lista.find((c) => c.id === "semana-santa")!)).toBe("falta 1 dia");
    expect(quantoFalta(lista.find((c) => c.id === "diario-espiritual")!)).toBe("faltam 3 anotações");
    expect(quantoFalta(lista.find((c) => c.id === "primeiro-tesouro")!)).toBe("falta 1 texto");
  });

  it("fala em níveis e em lições quando é disso que se trata", () => {
    const lista = conquistas({ ...ZERO, nivel: 8, licoes: 10 });
    expect(quantoFalta(lista.find((c) => c.id === "servo-dedicado")!)).toBe("faltam 2 níveis");
    expect(quantoFalta(lista.find((c) => c.id === "doutor-da-academia")!)).toBe("faltam 2 lições");
    const quase = conquistas({ ...ZERO, nivel: 9, licoes: 11 });
    expect(quantoFalta(quase.find((c) => c.id === "servo-dedicado")!)).toBe("falta 1 nível");
    expect(quantoFalta(quase.find((c) => c.id === "doutor-da-academia")!)).toBe("falta 1 lição");
  });
});

describe("novas conquistas", () => {
  it("lista só as que passaram a valer", () => {
    const antes = conquistas({ ...ZERO, recorde: 7 });
    const depois = conquistas({ ...ZERO, recorde: 7, licoes: 1 });
    expect(novasConquistas(antes, depois).map((c) => c.id)).toEqual(["primeiros-passos"]);
  });
});

describe("resumo do progresso na home", () => {
  const lista = conquistas({ ...ZERO, recorde: 5, nivel: 8 });

  it("celebra a sequência e aponta a próxima conquista", () => {
    expect(resumoDoProgresso("Victor Oliveira", 9, lista)).toEqual({
      titulo: "9 dias seguidos, Victor",
      detalhe: "Próxima conquista: Servo Dedicado, faltam 2 níveis",
    });
  });

  it("usa o primeiro nome mesmo com espaços sobrando", () => {
    expect(resumoDoProgresso("  Ana   Maria ", 2, lista).titulo).toBe("2 dias seguidos, Ana");
  });

  it("fala no singular com um dia", () => {
    expect(resumoDoProgresso("Ana", 1, lista).titulo).toBe("1 dia seguido, Ana");
  });

  it("sem sequência, convida a começar hoje", () => {
    expect(resumoDoProgresso("Ana", 0, lista).titulo).toBe("Comece hoje uma nova sequência, Ana");
  });

  it("com tudo ganho, diz isso", () => {
    const tudo = conquistas({ recorde: 365, nivel: 100, licoes: 12, licoesTotal: 12, favoritos: 25, anotacoes: 10, caminho: 36 });
    expect(resumoDoProgresso("Ana", 3, tudo).detalhe).toBe("Todas as conquistas ganhas. Que graça!");
  });
});


describe("Caminho da Santidade", () => {
  it("cada via concluída é uma conquista, e a última é a santidade", () => {
    expect(ganhas({ ...ZERO, caminho: 11 })).toEqual([]);
    expect(ganhas({ ...ZERO, caminho: 12 })).toEqual(["via-purgativa"]);
    expect(ganhas({ ...ZERO, caminho: 36 })).toEqual(["via-purgativa", "via-iluminativa", "santidade"]);
  });

  it("diz quantas casas faltam", () => {
    const santidade = conquistas({ ...ZERO, caminho: 35 }).find((c) => c.id === "santidade")!;
    expect(quantoFalta(santidade)).toBe("falta 1 casa");
    const via = conquistas({ ...ZERO, caminho: 2 }).find((c) => c.id === "via-purgativa")!;
    expect(quantoFalta(via)).toBe("faltam 10 casas");
  });
});
