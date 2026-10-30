import { describe, expect, it } from "vitest";

import {
  feastDates,
  formatDayMonth,
  saintOfDay,
  saintsOn,
  upcomingFeasts,
  type Santo,
} from "@/lib/santoDoDia";

function saint(slug: string, festa: string | null, corpo = "texto"): Santo {
  return { slug, festa, corpo } as Santo;
}

describe("feastDates", () => {
  it("deve ler toda data do campo festa", () => {
    expect(feastDates("4 de outubro")).toEqual(["10-04"]);
    expect(feastDates("19 de março (Solenidade de São José); 1º de maio (São José Operário)")).toEqual([
      "03-19",
      "05-01",
    ]);
    expect(feastDates("23 de agosto (30 de agosto na América Latina)")).toEqual(["08-23", "08-30"]);
  });

  it("deve devolver vazio sem data", () => {
    expect(feastDates(null)).toEqual([]);
    expect(feastDates("Sem data fixa")).toEqual([]);
  });
});

describe("saintsOn", () => {
  it("deve pôr primeiro o verbete mais longo", () => {
    const saints = [saint("curto", "4 de outubro"), saint("longo", "4 de outubro", "texto bem maior")];
    expect(saintsOn(saints, "2026-10-04").map(({ slug }) => slug)).toEqual(["longo", "curto"]);
  });
});

describe("saintOfDay", () => {
  const saints = [saint("a", "4 de outubro"), saint("b", "2 de janeiro")];

  it("deve escolher o santo com festa hoje", () => {
    expect(saintOfDay(saints, "2026-10-04")).toMatchObject({
      saint: { slug: "a" },
      date: "2026-10-04",
      isToday: true,
    });
  });

  it("deve avançar para a próxima festa, passando a virada do ano", () => {
    expect(saintOfDay(saints, "2026-10-05")).toMatchObject({
      saint: { slug: "b" },
      date: "2027-01-02",
      isToday: false,
    });
  });

  it("deve devolver null sem nenhuma festa conhecida", () => {
    expect(saintOfDay([saint("a", null)], "2026-10-05")).toBeNull();
  });
});

describe("upcomingFeasts", () => {
  it("deve listar os próximos 7 dias sem contar hoje", () => {
    const saints = [saint("hoje", "4 de outubro"), saint("d7", "11 de outubro"), saint("d8", "12 de outubro")];
    expect(upcomingFeasts(saints, "2026-10-04").map(({ date }) => date)).toEqual(["2026-10-11"]);
  });
});

describe("formatDayMonth", () => {
  it("deve escrever o dia e o mês por extenso", () => {
    expect(formatDayMonth("2026-10-04")).toBe("4 de outubro");
  });
});
