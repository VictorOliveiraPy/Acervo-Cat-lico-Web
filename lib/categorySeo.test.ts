import { describe, expect, it } from "vitest";

import { CATEGORY_SEO_DESCRIPTION } from "@/lib/categorySeo";
import { CATEGORY_SLUGS } from "@/lib/schemas";

describe("descrição de busca das categorias", () => {
  it.each(CATEGORY_SLUGS)("%s deve ter de 140 a 160 caracteres", (slug) => {
    const length = CATEGORY_SEO_DESCRIPTION[slug].length;
    expect(length, `${slug}: ${length}`).toBeGreaterThanOrEqual(140);
    expect(length, `${slug}: ${length}`).toBeLessThanOrEqual(160);
  });

  it("não deve repetir o mesmo texto em duas categorias", () => {
    const texts = Object.values(CATEGORY_SEO_DESCRIPTION);
    expect(new Set(texts).size).toBe(texts.length);
  });
});
