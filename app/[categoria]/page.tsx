import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryBanner } from "@/components/CategoryBanner";
import { EntryList } from "@/components/EntryList";
import { Pagination } from "@/components/Pagination";
import {
  Breadcrumbs,
  EditorialNotice,
  PageHeader,
  StatusMessage,
} from "@/components/Editorial";
import { ApiError, getErrorMessage } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { CATEGORY_BACKGROUNDS } from "@/lib/categoryBackgrounds";
import { formatEntryCount } from "@/lib/entryDisplay";
import { computePagination, parseOffset } from "@/lib/pagination";
import {
  CATEGORY_SLUGS,
  isCategorySlug,
  type CategoryInfo,
  type CategorySlug,
  type EntryPage,
} from "@/lib/schemas";
import { PAGE_SIZE, fetchCategories, fetchEntryPage } from "@/lib/services/acervoService";

type Params = { categoria: string };
type SearchParams = { [key: string]: string | string[] | undefined };

/** As categorias são conhecidas em build: viram rotas pré-renderizadas. */
export function generateStaticParams(): Params[] {
  return CATEGORY_SLUGS.map((categoria) => ({ categoria }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  if (!isCategorySlug(params.categoria)) return { title: "Categoria" };
  const label = CATEGORY_LABELS[params.categoria];
  const path = categoryPath(params.categoria);
  return {
    title: label.heading,
    description: label.tagline,
    alternates: { canonical: path },
    openGraph: { title: label.heading, description: label.tagline, url: path },
  };
}

/** Busca a ficha da categoria (nome, descrição e aviso editorial) na API. */
async function loadCategoryInfo(
  categoria: CategorySlug,
): Promise<CategoryInfo | null> {
  const categories = await fetchCategories();
  return categories.find((info) => info.categoria === categoria) ?? null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  if (!isCategorySlug(params.categoria)) notFound();

  const categoria: CategorySlug = params.categoria;
  const label = CATEGORY_LABELS[categoria];
  const offset = parseOffset(searchParams.offset);

  let info: CategoryInfo | null;
  let page: EntryPage;
  try {
    [info, page] = await Promise.all([
      loadCategoryInfo(categoria),
      fetchEntryPage(categoria, { limit: PAGE_SIZE, offset }),
    ]);
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    if (error.isNotFound) notFound();

    return (
      <div className="mx-auto max-w-shell px-4 py-12 sm:px-6">
        <StatusMessage title={`Não foi possível carregar ${label.nav}`} tone="error">
          <p>{getErrorMessage(error)}</p>
          <p className="mt-3">Recarregue a página em alguns instantes.</p>
        </StatusMessage>
      </div>
    );
  }

  const pagination = computePagination({
    total: page.total,
    limit: page.limit || PAGE_SIZE,
    offset: page.offset,
  });

  const title = info?.nome ?? label.heading;
  const description = info?.descricao ?? label.tagline;
  const meta = `${formatEntryCount(page.total)} · ${pagination.rangeLabel || "nada publicado ainda"}`;
  const background = CATEGORY_BACKGROUNDS[categoria];

  return (
    <>
      <div className="mx-auto max-w-shell px-4 pt-10 sm:px-6">
        <Breadcrumbs
          trail={[{ label: "Acervo", href: "/" }, { label: label.nav }]}
        />
      </div>

      {/* Banner com foto de fundo só pra categorias curadas em
          `CATEGORY_BACKGROUNDS` (hoje só "Papas") — as demais continuam no
          `PageHeader` de sempre, sem foto, até ganharem uma. */}
      {background ? (
        <div className="mt-6">
          <CategoryBanner
            background={background}
            title={title}
            description={description}
            meta={meta}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-shell px-4 sm:px-6">
          <div className="mt-6">
            <PageHeader kicker="Categoria" title={title} description={description} meta={meta} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-shell px-4 pb-10 sm:px-6">
        {info ? (
          <div className="mt-8">
            <EditorialNotice>{info.aviso}</EditorialNotice>
          </div>
        ) : null}

        <div className="mt-10">
          {page.itens.length > 0 ? (
            <>
              <EntryList entries={page.itens} />
              <div className="mt-10">
                <Pagination basePath={categoryPath(categoria)} state={pagination} />
              </div>
            </>
          ) : (
            <StatusMessage title="Nenhuma entrada nesta página">
              <p>
                A categoria tem {formatEntryCount(page.total)}. Volte para a{" "}
                primeira página da listagem para vê-las.
              </p>
            </StatusMessage>
          )}
        </div>
      </div>
    </>
  );
}
