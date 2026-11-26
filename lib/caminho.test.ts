import { describe, expect, it } from "vitest";

import {
  caminhoSchema,
  deslocamento,
  estadoDaCasa,
  progressoDaVia,
  situacaoDaCasa,
  type Caminho,
} from "@/lib/caminho";

const casa = (numero: number, via: string, tipo: "atividade" | "licao", tarefa: string, licoes = 0) => ({
  numero,
  via,
  titulo: `Casa ${numero}`,
  texto: "",
  tipo,
  tarefa,
  tarefa_nome: tarefa,
  licoes,
});

const CAMINHO: Caminho = caminhoSchema.parse({
  vias: [
    { id: "purgativa", nome: "Via Purgativa", descricao: "" },
    { id: "iluminativa", nome: "Via Iluminativa", descricao: "" },
  ],
  casas: [
    casa(1, "purgativa", "atividade", "terco"),
    casa(2, "purgativa", "licao", "licao", 1),
    casa(3, "iluminativa", "atividade", "terco"),
    casa(4, "iluminativa", "atividade", "missa"),
  ],
});

describe("estado de cada casa", () => {
  it("feitas, a atual e as bloqueadas", () => {
    expect([1, 2, 3, 4].map((n) => estadoDaCasa(n, 1))).toEqual(["feita", "atual", "bloqueada", "bloqueada"]);
  });

  it("com a trilha inteira feita, não há casa atual", () => {
    expect([1, 4].map((n) => estadoDaCasa(n, 4))).toEqual(["feita", "feita"]);
  });
});

describe("o que a casa atual pede", () => {
  const vazio = { feitasHoje: [], licoes: 0, casasHoje: [] };

  it("prática ainda não marcada hoje: marcar", () => {
    expect(situacaoDaCasa(CAMINHO, 1, vazio)).toBe("marcar");
  });

  it("prática marcada hoje: avançar", () => {
    expect(situacaoDaCasa(CAMINHO, 1, { ...vazio, feitasHoje: ["terco"] })).toBe("avancar");
  });

  it("a mesma prática já moveu uma casa hoje: amanhã", () => {
    expect(situacaoDaCasa(CAMINHO, 3, { feitasHoje: ["terco"], licoes: 1, casasHoje: [1, 2] })).toBe("amanha");
  });

  it("lição: abrir a Academia até ter lições suficientes", () => {
    expect(situacaoDaCasa(CAMINHO, 2, vazio)).toBe("licao");
    expect(situacaoDaCasa(CAMINHO, 2, { ...vazio, licoes: 1 })).toBe("avancar");
  });
});

describe("desenho da trilha", () => {
  it("serpenteia entre -1 e 1 e volta ao centro a cada 8 casas", () => {
    const xs = Array.from({ length: 9 }, (_, i) => deslocamento(i + 1));
    expect(xs).toEqual([0, 0.5, 1, 0.5, 0, -0.5, -1, -0.5, 0]);
  });

  it("conta o progresso de cada via", () => {
    expect(progressoDaVia(CAMINHO, "purgativa", 1)).toEqual({ feitas: 1, total: 2 });
    expect(progressoDaVia(CAMINHO, "iluminativa", 1)).toEqual({ feitas: 0, total: 2 });
    expect(progressoDaVia(CAMINHO, "iluminativa", 4)).toEqual({ feitas: 2, total: 2 });
  });
});
