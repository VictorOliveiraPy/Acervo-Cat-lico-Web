import { describe, expect, it } from "vitest";

import { classifyPath } from "@/lib/routing";

describe("classifyPath", () => {
  it("aceita a home, categorias e entradas", () => {
    expect(classifyPath("/")).toEqual({ kind: "ok" });
    expect(classifyPath("/papas")).toEqual({ kind: "ok" });
    expect(classifyPath("/papas/inocencio-iii")).toEqual({ kind: "ok" });
  });

  it("aceita as rotas fixas do site e as de imagem do Instagram", () => {
    for (const path of ["/busca", "/velas", "/liturgia-diaria", "/icon", "/opengraph-image"]) {
      expect(classifyPath(path)).toEqual({ kind: "ok" });
    }
    expect(classifyPath("/instagram/carrossel")).toEqual({ kind: "ok" });
    expect(classifyPath("/instagram/papas/inocencio-iii")).toEqual({ kind: "ok" });
  });

  it("dá 404 para primeiro segmento que não existe", () => {
    expect(classifyPath("/nao-existe")).toEqual({ kind: "not-found" });
    expect(classifyPath("/qualquer/coisa")).toEqual({ kind: "not-found" });
  });

  it("dá 404 para caminho fundo demais", () => {
    expect(classifyPath("/papas/inocencio-iii/extra")).toEqual({ kind: "not-found" });
    expect(classifyPath("/busca/algo")).toEqual({ kind: "not-found" });
    expect(classifyPath("/instagram/a/b/c")).toEqual({ kind: "not-found" });
  });

  it("redireciona maiúsculas para a URL em minúsculas", () => {
    expect(classifyPath("/Papas/inocencio-iii")).toEqual({
      kind: "redirect",
      to: "/papas/inocencio-iii",
    });
    expect(classifyPath("/SANTOS")).toEqual({ kind: "redirect", to: "/santos" });
  });

  it("não trata o hexadecimal de %C3%A3 como maiúscula (evita redirect em loop)", () => {
    expect(classifyPath("/santos/s%C3%A3o-jose")).toEqual({ kind: "ok" });
    expect(classifyPath("/Santos/s%C3%A3o")).toEqual({ kind: "redirect", to: "/santos/s%C3%A3o" });
  });
});
