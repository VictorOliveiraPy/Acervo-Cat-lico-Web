import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs, EditorialNotice, PageHeader, StatusMessage } from "@/components/Editorial";
import { EntryList } from "@/components/EntryList";
import { Pagination } from "@/components/Pagination";
import { ApiError, getErrorMessage } from "@/lib/api";
import { categoryPath } from "@/lib/categories";
import { HREFLANG, OG_LOCALE, dictionaryFor, isLocale, localePath, type Locale } from "@/lib/i18n";
import { computePagination, parseOffset } from "@/lib/pagination";
import { isCategorySlug, type CategoryInfo, type CategorySlug, type EntryPage } from "@/lib/schemas";
import { PAGE_SIZE, fetchCategories, fetchEntryPage } from "@/lib/services/acervoService";

type Params = { lang: string; categoria: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export const revalidate = 300;

async function loadCategoryInfo(categoria: CategorySlug, lang: Locale): Promise<CategoryInfo | null> {
  const categories = await fetchCategories(undefined, lang);
  return categories.find((info) => info.categoria === categoria) ?? null;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<Metadata> {
  if (!isLocale(params.lang) || !isCategorySlug(params.categoria)) return {};
  const lang = params.lang;
  try {
    const info = await loadCategoryInfo(params.categoria, lang);
    if (!info) return {};
    const pageOffset = Math.floor(parseOffset(searchParams.offset) / PAGE_SIZE) * PAGE_SIZE;
    const base = categoryPath(params.categoria);
    const ownPath = localePath(lang, base);
    const canonical = pageOffset > 0 ? `${ownPath}?offset=${pageOffset}` : ownPath;
    return {
      title: info.nome,
      description: info.descricao,
      alternates: {
        canonical,
        // O original em português sempre existe (a tradução nasce dele).
        languages: pageOffset > 0 ? undefined : { "pt-BR": base, [HREFLANG[lang]]: ownPath },
      },
      openGraph: {
        title: info.nome,
        description: info.descricao,
        url: canonical,
        locale: OG_LOCALE[lang],
        images: ["/opengraph-image"],
      },
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) return {};
    throw error;
  }
}

export default async function LocaleCategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  if (!isLocale(params.lang) || !isCategorySlug(params.categoria)) notFound();

  const lang = params.lang;
  const categoria = params.categoria;
  const t = dictionaryFor(lang);
  const offset = parseOffset(searchParams.offset);

  let info: CategoryInfo | null;
  let page: EntryPage;
  try {
    [info, page] = await Promise.all([
      loadCategoryInfo(categoria, lang),
      fetchEntryPage(categoria, { limit: PAGE_SIZE, offset }, lang),
    ]);
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    if (error.isNotFound) notFound();
    return (
      <div className="mx-auto max-w-shell px-4 py-12 sm:px-6">
        <StatusMessage title={t.loadError} tone="error">
          <p>{getErrorMessage(error)}</p>
          <p className="mt-3">{t.reloadHint}</p>
        </StatusMessage>
      </div>
    );
  }

  // Categoria sem tradução ainda: 404 de verdade em vez de uma lista vazia indexável.
  if (!info || page.total === 0) notFound();

  const pagination = computePagination({
    total: page.total,
    limit: page.limit || PAGE_SIZE,
    offset: page.offset,
  });

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <Breadcrumbs
        trail={[{ label: t.breadcrumbHome, href: localePath(lang, "/") }, { label: info.nome }]}
      />
      <PageHeader title={info.nome} description={info.descricao} meta={t.entryCount(page.total)} />

      {info.aviso ? (
        <div className="mt-8">
          <EditorialNotice>{info.aviso}</EditorialNotice>
        </div>
      ) : null}

      <div className="mt-10">
        {page.itens.length > 0 ? (
          <>
            <EntryList entries={page.itens} lang={lang} />
            <div className="mt-10">
              <Pagination basePath={localePath(lang, categoryPath(categoria))} state={pagination} />
            </div>
          </>
        ) : (
          <StatusMessage title={t.emptyPage} />
        )}
      </div>
    </div>
  );
}
