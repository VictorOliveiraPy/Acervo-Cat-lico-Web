import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { ATO_DE_CONTRICAO, EXAME } from "@/lib/confissao";
import { PATRONS, isPatronId, patronById } from "@/lib/padroeiros";
import type { Entry } from "@/lib/schemas";
import {
  daysBetween,
  favoriteFromEntry,
  favoriteInputSchema,
  formatTimeSince,
  formatMultiplier,
  levelProgress,
  levelSchema,
  levelUpMessage,
  noteInputSchema,
  streakSchema,
  tabForKey,
  tabFromHash,
} from "@/lib/perfil";

describe("nível e sequência", () => {
  const level = (numero: number, xp_no_nivel = 0, xp_proximo_nivel = 114) => ({
    numero,
    titulo: numero >= 5 ? "Devoto Fiel" : "Peregrino Iniciante",
    estagio: 1,
    xp_no_nivel,
    xp_proximo_nivel,
  });

  it("deve aceitar o nível e a sequência que a API devolve", () => {
    expect(levelSchema.parse(level(1))).toEqual(level(1));
    expect(streakSchema.parse({ atual: 3, recorde: 7, multiplicador: 1.5 })).toEqual({
      atual: 3,
      recorde: 7,
      multiplicador: 1.5,
    });
  });

  it("deve dar o progresso no nível em porcentagem, cheio no último", () => {
    expect(levelProgress(level(2, 66, 132))).toBe(50);
    expect(levelProgress(level(100, 0, 0))).toBe(100);
  });

  it("deve anunciar só quando o nível sobe", () => {
    expect(levelUpMessage(level(4), level(5))).toBe("Você subiu para o nível 5: Devoto Fiel!");
    expect(levelUpMessage(level(5), level(5))).toBeNull();
  });

  it("deve escrever o bônus da sequência no jeito brasileiro, e nada sem bônus", () => {
    expect(formatMultiplier(1.5)).toBe("×1,5");
    expect(formatMultiplier(2)).toBe("×2");
    expect(formatMultiplier(1)).toBeNull();
  });
});

describe("padroeiros", () => {
  it("deve ter os ids que a API aceita", () => {
    expect(PATRONS.map(({ id }) => id)).toEqual([
      "francisco",
      "maria",
      "jose",
      "teresinha",
      "antonio",
      "pedro",
      "bento",
      "miguel",
      "carlo",
      "cecilia",
    ]);
  });

  it("deve apontar cada modelo 3D para um arquivo publicado", () => {
    const models = PATRONS.flatMap((patron) => (patron.modelo ? [patron.modelo] : []));
    expect(models).toHaveLength(7);
    for (const model of models) expect(existsSync(join("public", model))).toBe(true);
  });

  it("deve cair no padrão com um id desconhecido", () => {
    expect(patronById("x").id).toBe("francisco");
    expect(isPatronId("x")).toBe(false);
    expect(isPatronId("jose")).toBe(true);
  });
});

describe("validação de favoritos e anotações", () => {
  const favorite = { tipo: "Bíblia", texto: "Texto" };

  it("deve aceitar até 2000 caracteres", () => {
    expect(favoriteInputSchema.safeParse({ ...favorite, texto: "a".repeat(2000) }).success).toBe(true);
    expect(favoriteInputSchema.safeParse({ ...favorite, texto: "a".repeat(2001) }).success).toBe(false);
    expect(favoriteInputSchema.safeParse({ ...favorite, texto: "   " }).success).toBe(false);
  });

  it.each(["javascript:alert(1)", "https://x.com", "//x.com", "/\\x.com", "/a b"])(
    "deve recusar %s como origem",
    (url_origem) => {
      expect(favoriteInputSchema.safeParse({ ...favorite, url_origem }).success).toBe(false);
    },
  );

  it("deve aceitar caminho interno como origem", () => {
    const result = favoriteInputSchema.safeParse({ ...favorite, url_origem: "/santos/x" });
    expect(result.success).toBe(true);
  });

  it("deve recusar categoria desconhecida", () => {
    expect(noteInputSchema.safeParse({ categoria: "Outra", texto: "Texto" }).success).toBe(false);
    expect(noteInputSchema.safeParse({ categoria: "Homilia", texto: "Texto" }).success).toBe(true);
  });
});

describe("abas do perfil", () => {
  it("deve ler a aba do hash e cair na primeira sem hash válido", () => {
    expect(tabFromHash("#confissao")).toBe("confissao");
    expect(tabFromHash("#outra")).toBe("favoritos");
    expect(tabFromHash("")).toBe("favoritos");
  });

  it("deve navegar pelas teclas, dando a volta nas pontas", () => {
    expect(tabForKey("favoritos", "ArrowRight")).toBe("anotacoes");
    expect(tabForKey("confissao", "ArrowRight")).toBe("favoritos");
    expect(tabForKey("favoritos", "ArrowLeft")).toBe("confissao");
    expect(tabForKey("anotacoes", "Home")).toBe("favoritos");
    expect(tabForKey("anotacoes", "End")).toBe("confissao");
    expect(tabForKey("anotacoes", "a")).toBeNull();
  });
});

describe("tempo desde a última confissão", () => {
  it("deve contar dias de calendário", () => {
    expect(daysBetween("2026-10-01", "2026-10-30")).toBe(29);
    expect(daysBetween("2026-10-30", "2026-10-30")).toBe(0);
    expect(daysBetween("2026-11-30", "2026-10-30")).toBe(0);
  });

  it("deve escrever como a pessoa fala ao padre", () => {
    expect(formatTimeSince(0)).toBe("hoje");
    expect(formatTimeSince(1)).toBe("há 1 dia");
    expect(formatTimeSince(59)).toBe("há 59 dias");
    expect(formatTimeSince(90)).toBe("há 3 meses");
  });
});

describe("regra de privacidade do exame de consciência", () => {
  const source = readFileSync("components/perfil/ConfessionPanel.tsx", "utf-8");

  it.each([
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "cookie",
    "fetch(",
    "sendBeacon",
    "trackEvent",
    "console.",
    "actions",
  ])("o painel não deve usar %s", (forbidden) => {
    expect(source).not.toContain(forbidden);
  });

  it("deve impedir o navegador de restaurar as marcações", () => {
    expect(source).toContain('autoComplete="off"');
  });
});

describe("conteúdo da confissão", () => {
  it("deve manter o ato de contrição do Compêndio", () => {
    expect(ATO_DE_CONTRICAO).toContain("proponho firmemente emendar-me");
  });

  it("deve cobrir os dez mandamentos", () => {
    const numbers = EXAME.flatMap(({ numero }) => numero.match(/\d+/g) ?? []).map(Number);
    expect(numbers.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe("favoriteFromEntry", () => {
  const entry = (fields: object) => ({ resumo: "Resumo", ...fields }) as Entry;

  it("deve guardar o texto da oração e o resumo do santo", () => {
    expect(favoriteFromEntry(entry({ categoria: "oracoes", texto: "Pai nosso" }))).toMatchObject({
      tipo: "Oração",
      texto: "Pai nosso",
    });
    expect(favoriteFromEntry(entry({ categoria: "santos" }))).toMatchObject({
      tipo: "Santos",
      texto: "Resumo",
    });
  });

  it("não deve oferecer o botão em outras categorias nem com texto longo demais", () => {
    expect(favoriteFromEntry(entry({ categoria: "papas" }))).toBeNull();
    expect(favoriteFromEntry(entry({ categoria: "oracoes", texto: "a".repeat(2001) }))).toBeNull();
  });
});
