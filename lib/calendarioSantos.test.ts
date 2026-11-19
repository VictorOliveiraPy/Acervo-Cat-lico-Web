import { describe, expect, it } from "vitest";

import { calendarioDosSantos, dobrarLinha, escaparTexto } from "@/lib/calendarioSantos";

const SITE = "https://compendio-catolico.com";
const santo = (slug: string, titulo: string, festa: string | null, resumo = "Resumo.") => ({
  slug,
  titulo,
  festa,
  resumo,
});

describe("texto do iCalendar", () => {
  it("escapa barra, vírgula, ponto e vírgula e quebra de linha", () => {
    expect(escaparTexto("a\\b, c; d\ne")).toBe("a\\\\b\\, c\\; d\\ne");
  });

  it("dobra linhas acima de 75 bytes sem partir letra acentuada", () => {
    const linha = `SUMMARY:${"São João ".repeat(12)}`;
    const dobrada = dobrarLinha(linha);
    const partes = dobrada.split("\r\n");
    expect(partes.length).toBeGreaterThan(1);
    for (const parte of partes) expect(new TextEncoder().encode(parte).length).toBeLessThanOrEqual(75);
    expect(partes.slice(1).every((parte) => parte.startsWith(" "))).toBe(true);
    expect(partes.map((parte, i) => (i === 0 ? parte : parte.slice(1))).join("")).toBe(linha);
  });
});

describe("dobra exata", () => {
  it("75 bytes na primeira linha e 74 mais o espaço nas seguintes", () => {
    const partes = dobrarLinha("x".repeat(200)).split("\r\n");
    expect(partes.map((parte) => parte.length)).toEqual([75, 75, 52]); // 200 = 75 + 74 + 51
  });

  it("linha de exatamente 75 bytes não dobra", () => {
    expect(dobrarLinha("x".repeat(75))).toBe("x".repeat(75));
  });
});

describe("calendário dos santos", () => {
  // Gerado dentro de cada teste: código que roda na coleta o Stryker não mede.
  const gerar = () =>
    calendarioDosSantos(
      [
        santo("francisco-de-assis", "São Francisco de Assis", "4 de outubro"),
        santo("pedro", "São Pedro", "29 de junho; Cátedra: 22 de fevereiro"),
        santo("sem-festa", "Beato sem data", null),
      ],
      SITE,
    );

  it("é um calendário válido, com quebras CRLF", () => {
    const ics = gerar();
    const linhas = ics.split("\r\n");
    expect(linhas[0]).toBe("BEGIN:VCALENDAR");
    expect(linhas.at(-2)).toBe("END:VCALENDAR");
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(linhas).toContain("VERSION:2.0");
  });

  it("um evento anual de dia inteiro por data de festa", () => {
    const ics = gerar();
    const linhas = ics.split("\r\n");
    expect(linhas.filter((l) => l === "BEGIN:VEVENT")).toHaveLength(3); // Francisco + 2 do Pedro
    expect(linhas).toContain("UID:francisco-de-assis-10-04@compendio-catolico.com");
    expect(linhas).toContain("DTSTART;VALUE=DATE:20001004");
    expect(linhas).toContain("RRULE:FREQ=YEARLY");
    expect(linhas).toContain("UID:pedro-02-22@compendio-catolico.com");
  });

  it("leva o link do verbete e avisa às 8h do dia", () => {
    const ics = gerar();
    const linhas = ics.split("\r\n");
    expect(linhas).toContain(`URL:${SITE}/santos/francisco-de-assis`);
    expect(linhas).toContain("TRIGGER:PT8H");
  });

  it("santo sem data de festa fica de fora", () => {
    const ics = gerar();
    const linhas = ics.split("\r\n");
    expect(ics).not.toContain("sem-festa");
  });
});
