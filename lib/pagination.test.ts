import { describe, expect, it } from "vitest";

import { computePagination, parseOffset } from "@/lib/pagination";

describe("parseOffset", () => {
  it("should fall back to the first page when the query param is not a valid offset", () => {
    expect(parseOffset(undefined)).toBe(0);
    expect(parseOffset("abc")).toBe(0);
    expect(parseOffset("-5")).toBe(0);
  });

  it("should read the first value when the param repeats in the URL", () => {
    expect(parseOffset(["24", "48"])).toBe(24);
  });
});

describe("computePagination", () => {
  it("should describe the visible range of the current page", () => {
    // Given a segunda página de 31 entradas, 12 por página
    // When
    const state = computePagination({ total: 31, limit: 12, offset: 12 });

    // Then
    expect(state.page).toBe(2);
    expect(state.totalPages).toBe(3);
    expect(state.rangeLabel).toBe("13\u201324 de 31");
    expect(state.hasPrevious).toBe(true);
    expect(state.hasNext).toBe(true);
  });

  it("should stop the range at the total on the last page", () => {
    // When
    const state = computePagination({ total: 31, limit: 12, offset: 24 });

    // Then
    expect(state.rangeLabel).toBe("25\u201331 de 31");
    expect(state.hasNext).toBe(false);
    expect(state.nextOffset).toBe(36);
  });

  it("should report a single empty page when the category has no entries", () => {
    // When
    const state = computePagination({ total: 0, limit: 12, offset: 0 });

    // Then
    expect(state).toMatchObject({
      page: 1,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
      rangeLabel: "",
    });
  });

  it("should clamp a page beyond the end back to the last page", () => {
    // Given um offset maior que o acervo (URL editada à mão)
    // When
    const state = computePagination({ total: 3, limit: 12, offset: 120 });

    // Then
    expect(state.page).toBe(1);
    expect(state.hasNext).toBe(false);
  });
});
