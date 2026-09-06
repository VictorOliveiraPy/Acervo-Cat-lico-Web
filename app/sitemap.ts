import type { MetadataRoute } from "next";

import { categoryPath, entryPath } from "@/lib/categories";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/schemas";
import { fetchEntryPage } from "@/lib/services/acervoService";
import { SITE_URL } from "@/lib/site";

/** Teto de itens por página que o backend aceita (ver `acervoService.ts`). */
const MAX_PAGE_SIZE = 100;

/** Regenera o sitemap periodicamente sem exigir um novo deploy a cada entrada. */
export const revalidate = 3600;

/** Todos os slugs de uma categoria, paginando até cobrir o total do backend. */
async function fetchAllSlugs(categoria: CategorySlug): Promise<string[]> {
  const slugs: string[] = [];
  let offset = 0;

  while (true) {
    const page = await fetchEntryPage(categoria, { limit: MAX_PAGE_SIZE, offset });
    slugs.push(...page.itens.map((entry) => entry.slug));
    offset += page.itens.length;
    if (page.itens.length === 0 || offset >= page.total) break;
  }

  return slugs;
}

/**
 * `/sitemap.xml` — home, busca, todas as categorias e cada entrada publicada.
 *
 * Busca todos os slugs na API em vez de assumir uma contagem fixa: o acervo
 * cresce por commit (ver `README.md`), e um sitemap desatualizado deixa
 * entradas novas fora do que o Google enxerga.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/busca`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/velas`, changeFrequency: "daily", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((categoria) => ({
    url: `${SITE_URL}${categoryPath(categoria)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const perCategorySlugs = await Promise.all(
    CATEGORY_SLUGS.map(async (categoria) => ({
      categoria,
      slugs: await fetchAllSlugs(categoria),
    })),
  );

  const entryPages: MetadataRoute.Sitemap = perCategorySlugs.flatMap(({ categoria, slugs }) =>
    slugs.map((slug) => ({
      url: `${SITE_URL}${entryPath(categoria, slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...categoryPages, ...entryPages];
}
