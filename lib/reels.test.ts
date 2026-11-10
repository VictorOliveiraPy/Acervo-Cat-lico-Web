import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { parseTema, REEL_TEMAS, REELS } from "@/lib/reels";
import { parseStudioMd } from "@/scripts/add-reel";

describe("reels", () => {
  it("deve ter a capa de cada vídeo em public/reels", () => {
    for (const { slug } of REELS) {
      expect(existsSync(`public/reels/${slug}.jpg`), slug).toBe(true);
    }
  });

  it("não deve repetir vídeo", () => {
    const slugs = REELS.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("deve pôr cada vídeo num tema do filtro", () => {
    for (const { slug, tema } of REELS) {
      expect(Object.keys(REEL_TEMAS), slug).toContain(tema);
    }
  });
});

describe("tema do filtro", () => {
  it("deve aceitar só temas conhecidos", () => {
    expect(parseTema("santos")).toBe("santos");
    for (const value of [undefined, "", "xyz", "constructor", "__proto__", ["santos"]]) {
      expect(parseTema(value)).toBeNull();
    }
  });
});

describe("leitura do .md do estúdio", () => {
  it("deve pegar o título e o primeiro parágrafo da legenda", () => {
    const md = [
      "# A hierarquia dos anjos",
      "",
      "## Legenda para o Instagram",
      "",
      "```text",
      "Existe hierarquia entre os anjos?",
      "A Bíblia dá nomes.",
      "",
      "Segundo parágrafo.",
      "```",
    ].join("\n");
    expect(parseStudioMd(md)).toEqual({
      title: "A hierarquia dos anjos",
      caption: "Existe hierarquia entre os anjos?\nA Bíblia dá nomes.",
    });
  });

  it("deve devolver vazio sem título nem legenda", () => {
    expect(parseStudioMd("texto solto")).toEqual({ title: "", caption: "" });
  });
});
