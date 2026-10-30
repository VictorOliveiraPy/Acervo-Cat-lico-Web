import { describe, expect, it } from "vitest";

import { articleJsonLd, toSchemaDate } from "@/lib/jsonLd";

const BASE = {
  url: "https://compendio-catolico.com/santos/x",
  titulo: "São X",
  resumo: "Resumo",
  imagem: "https://img/x.webp",
  inLanguage: "pt-BR",
  publicado_em: "2026-09-05",
  atualizado_em: "2026-10-30",
};

describe("toSchemaDate", () => {
  it("deve converter só data exata, ignorando o lugar depois da vírgula", () => {
    expect(toSchemaDate("21 de fevereiro de 1801, Londres (Inglaterra)")).toBe("1801-02-21");
    expect(toSchemaDate("1º de maio de 1920")).toBe("1920-05-01");
  });

  it("não deve inventar precisão em data aproximada", () => {
    expect(toSchemaDate("c. 330")).toBeNull();
    expect(toSchemaDate("Tradicionalmente c. 72, região de Mylapore")).toBeNull();
    expect(toSchemaDate(null)).toBeNull();
  });
});

describe("articleJsonLd", () => {
  it("deve trazer os campos do Article com autor e publisher", () => {
    const data = articleJsonLd(BASE);
    expect(data).toMatchObject({
      "@type": "Article",
      headline: "São X",
      datePublished: "2026-09-05",
      dateModified: "2026-10-30",
      mainEntityOfPage: BASE.url,
      author: { url: "https://compendio-catolico.com/sobre" },
    });
    expect(data).not.toHaveProperty("about");
  });

  it("deve omitir datas e imagem que não existem", () => {
    const data = articleJsonLd({ ...BASE, imagem: null, publicado_em: null, atualizado_em: null });
    expect(data).not.toHaveProperty("image");
    expect(data).not.toHaveProperty("datePublished");
    expect(data).not.toHaveProperty("dateModified");
  });

  it("deve declarar a pessoa só com nascimento e morte, sem data aproximada", () => {
    const data = articleJsonLd({
      ...BASE,
      nascimento: "c. 1181, Assis",
      morte: "3 de outubro de 1226, Assis",
    });
    expect(data.about).toEqual({ "@type": "Person", name: "São X", deathDate: "1226-10-03" });
    expect(articleJsonLd({ ...BASE, nascimento: null, morte: "1226" })).not.toHaveProperty("about");
  });
});
