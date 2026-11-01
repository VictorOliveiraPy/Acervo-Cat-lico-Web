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

  it("aceita a Academia e uma lição, mas nada mais fundo que isso", () => {
    expect(classifyPath("/academia")).toEqual({ kind: "ok" });
    expect(classifyPath("/academia/santissima-trindade")).toEqual({ kind: "ok" });
    expect(classifyPath("/academia/santissima-trindade/extra")).toEqual({ kind: "not-found" });
    expect(classifyPath("/perfil")).toEqual({ kind: "ok" });
    expect(classifyPath("/liturgia-diaria/2026-10-30")).toEqual({ kind: "ok" });
    expect(classifyPath("/liturgia-diaria/2026-10-30/x")).toEqual({ kind: "not-found" });
    expect(classifyPath("/ranking")).toEqual({ kind: "ok" });
    expect(classifyPath("/videos")).toEqual({ kind: "ok" });
    expect(classifyPath("/videos/x")).toEqual({ kind: "not-found" });
    expect(classifyPath("/santo-do-dia")).toEqual({ kind: "ok" });
    expect(classifyPath("/tema/franciscanos")).toEqual({ kind: "ok" });
    expect(classifyPath("/tema/franciscanos/2")).toEqual({ kind: "ok" });
    expect(classifyPath("/tema")).toEqual({ kind: "not-found" });
    expect(classifyPath("/tema/a/2/3")).toEqual({ kind: "not-found" });
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

  describe("prefixo de idioma", () => {
    it("reescreve /es e /en para a árvore interna de idiomas", () => {
      expect(classifyPath("/es")).toEqual({ kind: "rewrite", to: "/i18n/es" });
      expect(classifyPath("/en/oracoes")).toEqual({ kind: "rewrite", to: "/i18n/en/oracoes" });
      expect(classifyPath("/es/oracoes/ave-maria")).toEqual({
        kind: "rewrite",
        to: "/i18n/es/oracoes/ave-maria",
      });
    });

    it("dá 404 para categoria desconhecida, caminho fundo demais ou /i18n direto", () => {
      expect(classifyPath("/es/nao-existe")).toEqual({ kind: "not-found" });
      expect(classifyPath("/es/oracoes/ave-maria/extra")).toEqual({ kind: "not-found" });
      expect(classifyPath("/fr/oracoes")).toEqual({ kind: "not-found" });
      expect(classifyPath("/i18n/es/oracoes")).toEqual({ kind: "not-found" });
    });

    it("redireciona maiúsculas também sob o prefixo", () => {
      expect(classifyPath("/ES/Oracoes")).toEqual({ kind: "redirect", to: "/es/oracoes" });
    });
  });
});
