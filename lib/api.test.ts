import { describe, expect, it } from "vitest";

import { ApiError, buildQueryString, getErrorMessage } from "@/lib/api";

describe("buildQueryString", () => {
  it("should drop absent params instead of sending them as empty values", () => {
    // Given uma busca sem filtro de categoria
    // When
    const query = buildQueryString({ q: "eucaristia", categoria: undefined, limit: 50 });

    // Then
    expect(query).toBe("?q=eucaristia&limit=50");
  });

  it("should encode a term with accents and spaces", () => {
    expect(buildQueryString({ q: "são pedro" })).toBe("?q=s%C3%A3o+pedro");
  });

  it("should return an empty string when there is no param", () => {
    expect(buildQueryString()).toBe("");
  });
});

describe("ApiError", () => {
  it("should recognize a missing resource by its status", () => {
    // Given
    const error = new ApiError("Categoria inexistente.", 404, "CATEGORY_NOT_FOUND");

    // Then
    expect(error.isNotFound).toBe(true);
    expect(getErrorMessage(error)).toBe("Categoria inexistente.");
  });

  it("should give a readable message for an unknown thrown value", () => {
    expect(getErrorMessage("falha crua")).toBe(
      "Erro inesperado ao falar com o acervo.",
    );
  });
});
