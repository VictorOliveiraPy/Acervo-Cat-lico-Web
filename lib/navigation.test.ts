import { describe, expect, it } from "vitest";

import { activeNavItem } from "@/lib/navigation";

describe("item ativo da navegação global", () => {
  it("deve marcar a seção da rota e das páginas dentro dela", () => {
    expect(activeNavItem("/academia")).toBe("academia");
    expect(activeNavItem("/academia/santissima-trindade")).toBe("academia");
    expect(activeNavItem("/santos/cecilia-de-roma")).toBe("santos");
    expect(activeNavItem("/velas")).toBe("velas");
    expect(activeNavItem("/reels")).toBe("reels");
    expect(activeNavItem("/liturgia-diaria/2026-10-30")).toBe("liturgia");
  });

  it("deve tratar o resto como explorar o acervo", () => {
    expect(activeNavItem("/")).toBe("explorar");
    expect(activeNavItem("/busca")).toBe("explorar");
    expect(activeNavItem("/papas/joao-paulo-ii")).toBe("explorar");
  });

  it("não deve confundir categoria de nome parecido com a seção", () => {
    expect(activeNavItem("/santos-e-beatos")).toBe("explorar");
  });
});
