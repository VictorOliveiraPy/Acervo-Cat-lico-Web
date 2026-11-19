import { describe, expect, it } from "vitest";

import { THEMES, nextTheme, themeButtonLabel, type Theme } from "@/lib/theme";

describe("botão único de tema", () => {
  it("alterna automático → claro → escuro → automático", () => {
    expect(nextTheme("system")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("system");
  });

  it("passa por todos os temas antes de voltar", () => {
    const vistos = new Set<string>();
    let tema: Theme = THEMES[0];
    for (let i = 0; i < THEMES.length; i++) {
      vistos.add(tema);
      tema = nextTheme(tema);
    }
    expect(vistos.size).toBe(THEMES.length);
    expect(tema).toBe(THEMES[0]);
  });

  it("diz o tema atual e o que o clique faz", () => {
    expect(themeButtonLabel("system")).toBe("Tema automático (segue o sistema). Mudar para claro");
    expect(themeButtonLabel("dark")).toBe("Tema escuro. Mudar para automático");
  });
});
