import { describe, expect, it } from "vitest";

import { imagePosition } from "@/lib/entryDisplay";

describe("imagePosition", () => {
  it("deve respeitar o foco definido na entrada", () => {
    expect(imagePosition({ categoria: "santos", imagem_foco: "50% 20%" })).toBe("50% 20%");
  });

  it("deve subir o recorte em categoria de retratos", () => {
    expect(imagePosition({ categoria: "papas", imagem_foco: null })).toBe("center 25%");
  });

  it("deve centralizar nas demais categorias", () => {
    expect(imagePosition({ categoria: "santuarios", imagem_foco: null })).toBe("center");
  });
});
