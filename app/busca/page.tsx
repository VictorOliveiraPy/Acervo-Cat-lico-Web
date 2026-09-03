import type { Metadata } from "next";
import Link from "next/link";

import { SearchField } from "@/components/SearchField";
import { SearchResults } from "@/components/SearchResults";
import { PageHeader, StatusMessage } from "@/components/Editorial";
import { ApiError, buildQueryString, getErrorMessage } from "@/lib/api";
import { CATEGORY_NAV } from "@/lib/categories";
import {
  describeSearchResults,
  groupByCategory,
  type CategoryGroup,
} from "@/lib/search";
import { isCategorySlug, type CategorySlug, type SearchResult } from "@/lib/schemas";
import { MIN_SEARCH_LENGTH, searchAcervo } from "@/lib/services/acervoService";

type SearchParams = { [key: string]: string | string[] | undefined };

export const metadata: Metadata = {
  title: "Busca",
  description:
    "Busca única em todas as categorias do acervo: santos, papas, milagres eucarísticos, Catecismo, Crisma, história, Doutores e concílios.",
};

/** Lê um parâmetro de query que pode vir repetido na URL. */
function firstValue(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.trim() ?? "";
}

/**
 * Filtro por categoria — chips com a contagem de ocorrências de cada uma.
 *
 * As contagens vêm sempre da varredura completa, mesmo com um filtro ativo:
 * é o que permite pular direto de "Santos (2)" para "Catecismo (5)" sem tirar
 * o filtro primeiro e sem que um chip minta sobre o que há do outro lado.
 */
function SearchFilters({
  term,
  selected,
  allGroups,
  total,
}: {
  term: string;
  selected: CategorySlug | null;
  allGroups: CategoryGroup[];
  total: number;
}) {
  const countBySlug = new Map(
    allGroups.map((group) => [group.slug, group.results.length]),
  );

  const chipStyle =
    "inline-flex items-center gap-1.5 rounded-edge border px-3 py-1.5 text-meta transition-colors";

  return (
    <nav aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
      <Link
        href={`/busca${buildQueryString({ q: term })}`}
        aria-current={selected === null ? "true" : undefined}
        className={`${chipStyle} ${
          selected === null
            ? "border-bordeaux bg-bordeaux text-parchment-raised"
            : "border-rule-faint bg-parchment-raised text-ink-muted hover:border-bordeaux hover:text-bordeaux"
        }`}
      >
        Todas as categorias
        <span className="tabular-nums opacity-80">{total}</span>
      </Link>

      {CATEGORY_NAV.map(({ slug, label }) => {
        const count = countBySlug.get(slug) ?? 0;
        const isSelected = selected === slug;

        // Categoria sem ocorrência fica visível, porém inerte: some daqui
        // seria esconder da pessoa que a busca também olhou lá.
        if (count === 0 && !isSelected) {
          return (
            <span
              key={slug}
              aria-disabled="true"
              className={`${chipStyle} border-rule-faint/70 text-ink-muted/60`}
            >
              {label.nav}
              <span className="tabular-nums">0</span>
            </span>
          );
        }

        return (
          <Link
            key={slug}
            href={`/busca${buildQueryString({ q: term, categoria: slug })}`}
            aria-current={isSelected ? "true" : undefined}
            className={`${chipStyle} ${
              isSelected
                ? "border-bordeaux bg-bordeaux text-parchment-raised"
                : "border-rule-faint bg-parchment-raised text-ink-muted hover:border-bordeaux hover:text-bordeaux"
            }`}
          >
            {label.nav}
            <span className="tabular-nums opacity-80">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const term = firstValue(searchParams.q);
  const rawCategory = firstValue(searchParams.categoria);
  const selected: CategorySlug | null = isCategorySlug(rawCategory)
    ? rawCategory
    : null;

  const header = (
    <>
      <PageHeader
        kicker="Busca no acervo"
        title="Buscar em todas as categorias"
        description="Um termo só percorre santos, papas, milagres eucarísticos, Catecismo, Crisma, história da Igreja, Doutores e concílios — sem precisar de acento nem de caixa correta."
      />
      <div className="mt-8 max-w-2xl">
        <SearchField
          variant="prominent"
          initialQuery={term}
          label="Buscar em todo o acervo"
        />
      </div>
    </>
  );

  const shell = (children: React.ReactNode) => (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      {header}
      <div className="mt-10">{children}</div>
    </div>
  );

  if (term.length === 0) {
    return shell(
      <StatusMessage title="Digite o que você procura">
        <p>
          Vale nome de santo, tema de catequese, lugar de um milagre ou o nome de
          um concílio. Os atalhos da página inicial mostram exemplos prontos.
        </p>
      </StatusMessage>,
    );
  }

  if (term.length < MIN_SEARCH_LENGTH) {
    return shell(
      <StatusMessage title="Termo muito curto">
        <p>
          A busca precisa de pelo menos {MIN_SEARCH_LENGTH} caracteres.
          Complete a palavra e busque de novo.
        </p>
      </StatusMessage>,
    );
  }

  let allResults: SearchResult[];
  let results: SearchResult[];
  try {
    const [everywhere, filtered] = await Promise.all([
      searchAcervo({ q: term }),
      selected ? searchAcervo({ q: term, categoria: selected }) : null,
    ]);
    allResults = everywhere;
    results = filtered ?? everywhere;
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    return shell(
      <StatusMessage title="A busca não pôde ser concluída" tone="error">
        <p>{getErrorMessage(error)}</p>
        <p className="mt-3">
          O acervo continua no ar para navegação por categoria; tente a busca de
          novo em alguns instantes.
        </p>
      </StatusMessage>,
    );
  }

  const allGroups = groupByCategory(allResults);
  const groups = groupByCategory(results);

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      {header}

      <div className="mt-8 border-y border-rule-faint py-5">
        <SearchFilters
          term={term}
          selected={selected}
          allGroups={allGroups}
          total={allResults.length}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-title-md text-ink">
          {results.length === 0
            ? `Nada encontrado para “${term}”`
            : `Resultados para “${term}”`}
        </h2>
        <p className="kicker">
          {describeSearchResults(results.length, groups.length)}
        </p>
      </div>

      <div className="mt-10">
        {groups.length > 0 ? (
          <SearchResults groups={groups} term={term} />
        ) : (
          <StatusMessage title="Nenhuma entrada menciona esse termo">
            <p>
              {selected
                ? "Nenhuma ocorrência nesta categoria. Toque em “Todas as categorias” para buscar o mesmo termo no acervo inteiro."
                : "Tente um termo mais curto, o nome em português ou uma palavra do tema (por exemplo “eucaristia” em vez de “eucarístico do século VIII”)."}
            </p>
          </StatusMessage>
        )}
      </div>
    </div>
  );
}
