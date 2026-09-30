import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, StatusMessage } from "@/components/Editorial";
import { ApiError, getErrorMessage } from "@/lib/api";
import { categoryPath } from "@/lib/categories";
import { HREFLANG, OG_LOCALE, dictionaryFor, isLocale, localePath, type Locale } from "@/lib/i18n";
import { fetchCategories } from "@/lib/services/acervoService";
import type { CategoryInfo } from "@/lib/schemas";

type Params = { lang: string };

export const revalidate = 300;

export function generateMetadata({ params }: { params: Params }): Metadata {
  if (!isLocale(params.lang)) return {};
  const t = dictionaryFor(params.lang);
  const path = localePath(params.lang, "/");
  return {
    title: t.homeHeading,
    description: t.siteDescription,
    alternates: { canonical: path, languages: { "pt-BR": "/", [HREFLANG[params.lang]]: path } },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[params.lang],
      title: t.homeHeading,
      description: t.siteDescription,
      url: path,
      images: ["/opengraph-image"],
    },
  };
}

async function loadCategories(lang: Locale): Promise<CategoryInfo[]> {
  try {
    return await fetchCategories(undefined, lang);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export default async function LocaleHome({ params }: { params: Params }) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const t = dictionaryFor(lang);

  let categories: CategoryInfo[];
  try {
    categories = await loadCategories(lang);
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    return (
      <div className="mx-auto max-w-shell px-4 py-12 sm:px-6">
        <StatusMessage title={t.loadError} tone="error">
          <p>{getErrorMessage(error)}</p>
          <p className="mt-3">{t.reloadHint}</p>
        </StatusMessage>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader title={t.homeHeading} description={t.homeLead} />

      <section aria-labelledby="categorias" className="mt-10">
        <div className="border-b-2 border-border-strong pb-2">
          <h2 id="categorias" className="font-display text-title-md text-ink">
            {t.categoriesHeading}
          </h2>
        </div>
        <ul>
          {categories.map((info) => (
            <li key={info.categoria} className="border-t border-border">
              <Link
                href={localePath(lang, categoryPath(info.categoria))}
                className="group flex flex-col gap-1 py-5 transition-colors hover:bg-surface"
              >
                <span className="font-display text-title-sm text-ink group-hover:text-accent">
                  {info.nome}
                </span>
                <span className="max-w-measure text-body text-ink-muted">{info.descricao}</span>
                <span className="kicker text-accent">{t.entryCount(info.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
