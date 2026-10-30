import { describe, expect, it } from "vitest";

import {
  formatLongDate,
  isServedLiturgyDate,
  neighborLiturgyDates,
  todayInBrazil,
} from "@/lib/liturgia";

const TODAY = "2026-10-30";

describe("datas da liturgia", () => {
  it("deve escrever a data por extenso", () => {
    expect(formatLongDate("2026-10-30")).toBe("30 de outubro de 2026");
    expect(formatLongDate("2026-03-01")).toBe("1 de março de 2026");
  });

  it("deve usar o dia de Brasília, mesmo já sendo outro dia em UTC", () => {
    expect(todayInBrazil(new Date("2026-10-31T02:00:00Z"))).toBe("2026-10-30");
    expect(todayInBrazil(new Date("2026-10-31T04:00:00Z"))).toBe("2026-10-31");
  });

  it("deve aceitar só datas reais dentro da janela publicada", () => {
    expect(isServedLiturgyDate("2026-10-30", TODAY)).toBe(true);
    expect(isServedLiturgyDate("2026-11-06", TODAY)).toBe(true);
    expect(isServedLiturgyDate("2026-11-07", TODAY)).toBe(false);
    expect(isServedLiturgyDate("2026-08-30", TODAY)).toBe(true);
    expect(isServedLiturgyDate("2026-08-29", TODAY)).toBe(false);
    expect(isServedLiturgyDate("2026-02-30", "2026-02-20")).toBe(false);
    expect(isServedLiturgyDate("hoje", TODAY)).toBe(false);
  });

  it("não deve oferecer um próximo dia além da janela", () => {
    expect(neighborLiturgyDates("2026-10-30", TODAY)).toEqual({
      previous: "2026-10-29",
      next: "2026-10-31",
    });
    expect(neighborLiturgyDates("2026-11-06", TODAY).next).toBeNull();
    expect(neighborLiturgyDates("2026-08-30", TODAY).previous).toBeNull();
  });
});
