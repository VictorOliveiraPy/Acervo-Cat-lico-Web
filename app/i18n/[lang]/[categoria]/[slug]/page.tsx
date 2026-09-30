import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, PrayerText, StatusMessage } from "@/components/Editorial";
import { EntryList } from "@/components/EntryList";
import { EntryNeighbors } from "@/components/EntryNeighbors";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { ReadingSizeControl } from "@/components/ReadingSizeControl";
import { ApiError, getErrorMessage } from "@/lib/api";
import { categoryPath, entryPath } from "@/lib/categories";
import { paragraphs } from "@/lib/entryDisplay";
import { HREFLANG, OG_LOCALE, dictionaryFor, isLocale, localePath, type Locale } from "@/lib/i18n";
import { safeJsonLd } from "@/lib/jsonLd";
import { neighborsOf } from "@/lib/neighbors";
import { isCategorySlug, type CategorySlug, type Entry } from "@/lib/schemas";
import {
  fetchCategories,
  fetchCategoryIndex,
  fetchEntry,
  fetchEntryPage,
  type CategoryIndexItem,
} from "@/lib/services/acervoService";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { lang: string; categoria: string; slug: string };

export const revalidate = 300;

const MORE_COUNT = 4;

async function loadEntry(categoria: CategorySlug, slug: string, lang: Locale): Promise<Entry> {
  try {
    return await fetchEntry(categoria, slug, lang);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

/** Falha da API nas sugestões não derruba a leitura: a página segue sem elas. */
async function loadNeighbors(categoria: CategorySlug, slug: string, lang: Locale) {
  try {
    return neighborsOf<CategoryIndexItem>(await fetchCategoryIndex(categoria, lang), slug);
  } catch (error: unknown) {
    if (error instanceof ApiError) return { previous: null, next: null };
    throw error;
  }
}

async function loadMore(categoria: CategorySlug, slug: string, lang: Locale): Promise<Entry[]> {
  try {
    const page = await fetchEntryPage(categoria, { limit: MORE_COUNT + 1 }, lang);
    return page.itens.filter((entry) => entry.slug !== slug).slice(0, MORE_COUNT);
  } catch (error: unknown) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

async function categoryName(categoria: CategorySlug, lang: Locale): Promise<string> {
  try {
    const categories = await fetchCategories(undefined, lang);
    return categories.find((info) => info.categoria === categoria)?.nome ?? categoria;
  } catch (error: unknown) {
    if (error instanceof ApiError) return categoria;
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!isLocale(params.lang) || !isCategorySlug(params.categoria)) return {};
  const lang = params.lang;
  try {
    const entry = await fetchEntry(params.categoria, params.slug, lang);
    const base = entryPath(params.categoria, params.slug);
    const ownPath = localePath(lang, base);
    return {
      title: entry.titulo,
      description: entry.resumo,
      alternates: {
        canonical: ownPath,
        languages: { "pt-BR": base, [HREFLANG[lang]]: ownPath },
      },
      openGraph: {
        title: entry.titulo,
        description: entry.resumo,
        url: ownPath,
        locale: OG_LOCALE[lang],
        images: entry.imagem ? [{ url: entry.imagem }] : undefined,
      },
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) return {};
    throw error;
  }
}

export default async function LocaleEntryPage({ params }: { params: Params }) {
  if (!isLocale(params.lang) || !isCategorySlug(params.categoria)) notFound();

  const lang = params.lang;
  const categoria = params.categoria;
  const t = dictionaryFor(lang);

  let entry: Entry;
  try {
    entry = await loadEntry(categoria, params.slug, lang);
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

  const blocks = paragraphs(entry.corpo);
  const path = localePath(lang, entryPath(categoria, params.slug));
  const ptPath = entryPath(categoria, params.slug);
  const [categoryLabel, more, neighbors] = await Promise.all([
    categoryName(categoria, lang),
    loadMore(categoria, params.slug, lang),
    loadNeighbors(categoria, params.slug, lang),
  ]);

  const entryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.titulo,
    description: entry.resumo,
    url: `${SITE_URL}${path}`,
    inLanguage: HREFLANG[lang],
    translationOfWork: { "@type": "CreativeWork", url: `${SITE_URL}${ptPath}`, inLanguage: "pt-BR" },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}${localePath(lang, "/")}` },
    ...(entry.imagem ? { image: entry.imagem } : {}),
    ...(entry.atualizado_em ? { dateModified: entry.atualizado_em } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: `${SITE_URL}${localePath(lang, "/")}` },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `${SITE_URL}${localePath(lang, categoryPath(categoria))}`,
      },
      { "@type": "ListItem", position: 3, name: entry.titulo, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <article className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(entryJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <Breadcrumbs
        trail={[
          { label: t.breadcrumbHome, href: localePath(lang, "/") },
          { label: categoryLabel, href: localePath(lang, categoryPath(categoria)) },
          { label: entry.titulo },
        ]}
      />

      <header className="border-b border-border pb-8">
        <p className="kicker">{categoryLabel}</p>
        <h1 className="mt-2 max-w-measure font-display text-title-lg text-ink md:text-title-xl">
          {entry.titulo}
        </h1>
        <p className="mt-4 max-w-measure text-lead text-ink-muted">{entry.resumo}</p>
        <p className="mt-4 text-meta text-ink-muted">
          {t.translationNote}{" "}
          <Link
            href={ptPath}
            hrefLang="pt-BR"
            className="text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            {t.originalInPortuguese}
          </Link>
        </p>
      </header>

      {entry.categoria === "oracoes" ? (
        <div className="mt-8">
          <PrayerText texto={entry.texto} />
        </div>
      ) : null}

      {entry.imagem ? (
        <figure className="mt-8">
          <div className="relative h-72 w-full max-w-measure overflow-hidden border border-border sm:h-96">
            <Image
              src={entry.imagem}
              alt={entry.titulo}
              fill
              sizes="(min-width: 1024px) 68ch, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {entry.imagem_credito ? (
            <figcaption className="mt-2 max-w-measure text-meta text-ink-muted">
              {entry.imagem_credito}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="mt-12 flex items-center justify-end gap-3">
        <p className="kicker">{t.textSize}</p>
        <ReadingSizeControl />
      </div>

      <div className="reading-column mt-6">
        {entry.categoria === "oracoes" ? <h2 className="kicker mb-4">{t.aboutPrayer}</h2> : null}
        {blocks.map((block, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.4em] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-accent"
                : undefined
            }
          >
            {block}
          </p>
        ))}
      </div>

      <OrnamentalDivider />

      <footer className="mt-section grid gap-10 pt-2 md:grid-cols-2">
        {entry.tags.length > 0 ? (
          <section aria-labelledby="temas">
            <h2 id="temas" className="kicker">
              {t.relatedTopics}
            </h2>
            {/* Sem link: a busca ainda é só em português. */}
            <ul className="mt-3 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center rounded-edge border border-border bg-surface px-2.5 py-1 text-meta text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {entry.fontes.length > 0 ? (
          <section aria-labelledby="fontes">
            <h2 id="fontes" className="kicker">
              {t.sources}
            </h2>
            <ul className="mt-3 space-y-2">
              {entry.fontes.map((source) => (
                <li
                  key={source}
                  className="max-w-measure border-t border-border pt-2 text-meta text-ink-muted"
                >
                  {source}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </footer>

      <EntryNeighbors categoria={categoria} neighbors={neighbors} lang={lang} />

      {more.length > 0 ? (
        <section aria-labelledby="mais-da-categoria" className="mt-section">
          <div className="border-b-2 border-border-strong pb-2">
            <h2 id="mais-da-categoria" className="font-display text-title-md text-ink">
              {t.keepReading}
            </h2>
          </div>
          <EntryList entries={more} lang={lang} />
        </section>
      ) : null}

      <p className="mt-10">
        <Link
          href={localePath(lang, categoryPath(categoria))}
          className="text-meta text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          {t.allEntriesOf(categoryLabel)}
        </Link>
      </p>
    </article>
  );
}
