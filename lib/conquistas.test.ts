import { describe, expect, it } from "vitest";

import {
  CONQUISTAS,
  conquistas,
  novasConquistas,
  proximaConquista,
  quantoFalta,
  type ProgressoDoPerfil,
} from "@/lib/conquistas";

const ZERO: ProgressoDoPerfil = { recorde: 0, nivel: 1, licoes: 0, licoesTotal: 12, favoritos: 0, anotacoes: 0 };
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

  it("não existe quando todas foram ganhas", () => {
    const tudo = { recorde: 365, nivel: 100, licoes: 12, licoesTotal: 12, favoritos: 25, anotacoes: 10 };
    expect(proximaConquista(conquistas(tudo))).toBeNull();
  });

  it("diz o que falta em palavras, no singular e no plural", () => {
    const lista = conquistas({ ...ZERO, recorde: 6, anotacoes: 7 });
    expect(quantoFalta(lista.find((c) => c.id === "semana-santa")!)).toBe("falta 1 dia");
    expect(quantoFalta(lista.find((c) => c.id === "diario-espiritual")!)).toBe("faltam 3 anotações");
    expect(quantoFalta(lista.find((c) => c.id === "primeiro-tesouro")!)).toBe("falta 1 texto");
  });
});

describe("novas conquistas", () => {
  it("lista só as que passaram a valer", () => {
    const antes = conquistas({ ...ZERO, recorde: 7 });
    const depois = conquistas({ ...ZERO, recorde: 7, licoes: 1 });
    expect(novasConquistas(antes, depois).map((c) => c.id)).toEqual(["primeiros-passos"]);
  });
});
