import { describe, expect, it } from "vitest";

import { neighborsOf } from "@/lib/neighbors";

const items = [{ slug: "a" }, { slug: "b" }, { slug: "c" }];

describe("neighborsOf", () => {
  it("devolve anterior e próxima no meio da lista", () => {
    expect(neighborsOf(items, "b")).toEqual({ previous: { slug: "a" }, next: { slug: "c" } });
  });

  it("não tem anterior na primeira nem próxima na última", () => {
    expect(neighborsOf(items, "a")).toEqual({ previous: null, next: { slug: "b" } });
    expect(neighborsOf(items, "c")).toEqual({ previous: { slug: "b" }, next: null });
  });

  it("devolve vazio para slug fora da lista", () => {
    expect(neighborsOf(items, "x")).toEqual({ previous: null, next: null });
  });

  it("funciona com lista de um item só", () => {
    expect(neighborsOf([{ slug: "a" }], "a")).toEqual({ previous: null, next: null });
  });
});
