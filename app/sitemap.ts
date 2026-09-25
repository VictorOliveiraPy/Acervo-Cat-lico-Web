import type { MetadataRoute } from "next";

import { categoryPath, entryPath } from "@/lib/categories";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/schemas";
import { fetchCategoryIndex } from "@/lib/services/acervoService";
import { SITE_URL } from "@/lib/site";

/** A data mais recente entre as informadas, ou nada se nenhuma veio. */
function lastModifiedOf(dates: (string | null)[]): { lastModified?: string } {
  const valid = dates.filter((date): date is string => Boolean(date));
  if (valid.length === 0) return {};
  return { lastModified: valid.reduce((latest, date) => (date > latest ? date : latest)) };
}

/** Regenera o sitemap periodicamente sem exigir um novo deploy a cada entrada. */
export const revalidate = 3600;

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
    // Indexável desde a auditoria de SEO de 2026-09-18 (ver
    // app/liturgia-diaria/page.tsx) — troca de conteúdo todo dia, daí
    // `changeFrequency: "daily"` em vez de "weekly".
    { url: `${SITE_URL}/liturgia-diaria`, changeFrequency: "daily", priority: 0.9 },
  ];

  const perCategory = await Promise.all(
    CATEGORY_SLUGS.map(async (categoria) => ({
      categoria,
      items: await fetchCategoryIndex(categoria),
    })),
  );

  // `lastModified` só quando a API informa a data real da alteração: uma data
  // inventada (ex.: "agora" a cada build) ensina o Google a ignorar o campo.
  const categoryPages: MetadataRoute.Sitemap = perCategory.map(({ categoria, items }) => ({
    url: `${SITE_URL}${categoryPath(categoria)}`,
    ...lastModifiedOf(items.map((item) => item.atualizado_em)),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const entryPages: MetadataRoute.Sitemap = perCategory.flatMap(({ categoria, items }) =>
    items.map((item) => ({
      url: `${SITE_URL}${entryPath(categoria, item.slug)}`,
      ...lastModifiedOf([item.atualizado_em]),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...categoryPages, ...entryPages];
}
