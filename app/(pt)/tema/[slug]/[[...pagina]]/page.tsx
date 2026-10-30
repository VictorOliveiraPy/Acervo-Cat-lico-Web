import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, PageHeader } from "@/components/Editorial";
import { EntryList } from "@/components/EntryList";
import { ApiError } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { formatEntryCount } from "@/lib/entryDisplay";
import { safeJsonLd } from "@/lib/jsonLd";
import type { ThemePage } from "@/lib/schemas";
import { fetchThemePage, fetchThemes } from "@/lib/services/acervoService";
import { SITE_URL } from "@/lib/site";
import {
  THEME_DESCRIPTIONS,
  THEME_MIN_ENTRIES,
  THEME_PAGE_SIZE,
  groupByCategory,
  parseThemePage,
  themePath,
} from "@/lib/temas";

export const revalidate = 3600;

type Params = { slug: string; pagina?: string[] };

/** Só os temas indexáveis saem prontos do build; os demais são feitos na primeira visita. */
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const themes = await fetchThemes(THEME_MIN_ENTRIES);
    return themes.map(({ slug }) => ({ slug, pagina: [] }));
  } catch (error: unknown) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

/** Tema inexistente ou página fora do total viram 404 de verdade. */
async function loadTheme(params: Params): Promise<{ theme: ThemePage; page: number }> {
  const page = parseThemePage(params.pagina);
  if (page === null) notFound();
  try {
    const theme = await fetchThemePage(params.slug, {
      limit: THEME_PAGE_SIZE,
      offset: (page - 1) * THEME_PAGE_SIZE,
    });
    if (theme.itens.length === 0) notFound();
    return { theme, page };
  } catch (error: unknown) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { theme, page } = await loadTheme(params);
  const title = page > 1 ? `Tema: ${theme.nome}, página ${page}` : `Tema: ${theme.nome}`;
  const categories = groupByCategory(theme.itens)
    .slice(0, 3)
    .map(({ categoria }) => CATEGORY_LABELS[categoria].nav);
  const description =
    THEME_DESCRIPTIONS[theme.slug] ??
    `Consulte ${formatEntryCount(theme.total)} sobre ${theme.nome} no Compêndio Católico, agrupadas por categoria: ${categories.join(", ")}.`;
  const canonical = themePath(theme.slug, page);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, images: ["/opengraph-image"] },
    robots: { index: theme.total >= THEME_MIN_ENTRIES, follow: true },
  };
}

export default async function TemaPage({ params }: { params: Params }) {
  const { theme, page } = await loadTheme(params);
  const path = themePath(theme.slug);
  const lastPage = Math.ceil(theme.total / THEME_PAGE_SIZE);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acervo", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: theme.nome, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: theme.nome }]} />
      <PageHeader
        kicker="Tema"
        title={theme.nome}
        description={THEME_DESCRIPTIONS[theme.slug]}
        meta={`${formatEntryCount(theme.total)}, agrupadas por categoria${page > 1 ? ` · página ${page} de ${lastPage}` : ""}`}
      />

      {groupByCategory(theme.itens).map(({ categoria, entries }) => (
        <section key={categoria} aria-labelledby={`grupo-${categoria}`} className="mt-10">
          <h2 id={`grupo-${categoria}`} className="pb-3 font-display text-title-md text-ink">
            <Link href={categoryPath(categoria)} className="underline-offset-4 hover:underline">
              {CATEGORY_LABELS[categoria].nav}
            </Link>
          </h2>
          <EntryList entries={entries} />
        </section>
      ))}

      {lastPage > 1 ? (
        <nav aria-label="Páginas do tema" className="mt-10 flex justify-between gap-4 border-t border-border pt-4">
          {page > 1 ? (
            <Link href={themePath(theme.slug, page - 1)} rel="prev" className="btn-tertiary">
              <span aria-hidden="true">←</span> Página anterior
            </Link>
          ) : (
            <span />
          )}
          {page < lastPage ? (
            <Link href={themePath(theme.slug, page + 1)} rel="next" className="btn-tertiary">
              Próxima página <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
