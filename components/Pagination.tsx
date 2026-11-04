import Link from "next/link";

import { buildQueryString } from "@/lib/api";
import type { PaginationState } from "@/lib/pagination";

type Props = {
  /** Caminho da listagem, ex.: "/santos". */
  basePath: string;
  state: PaginationState;
};

/**
 * Paginação por links reais (`offset` na URL), não por botão com estado.
 *
 * Assim cada página é endereçável e compartilhável, e a navegação funciona sem
 * JavaScript. Quando não há para onde ir, o controle aparece desabilitado em
 * vez de desaparecer — a pessoa vê que chegou ao fim da lista.
 *
 * Links diretos para páginas intermediárias: resolve o problema de navegação
 * linear forçada em categorias com muitas entradas (ex.: Santos com 10+ páginas).
 * A janela de páginas usa o padrão 1 … 4 5 6 … 10 ao redor da página atual.
 */
export function Pagination({ basePath, state }: Props) {
  if (state.totalPages <= 1) return null;

  const pageHref = (page: number) => {
    const offset = (page - 1) * state.limit;
    return `${basePath}${buildQueryString({ offset: offset > 0 ? offset : undefined })}`;
  };

  const linkStyle =
    "flex h-9 min-w-[2.25rem] items-center justify-center rounded-edge border border-border px-2 text-meta font-semibold text-ink-muted transition-colors hover:border-accent hover:text-accent";
  const activeStyle =
    "flex h-9 min-w-[2.25rem] items-center justify-center rounded-edge border border-accent bg-accent px-2 text-meta font-semibold text-surface";
  const disabledStyle =
    "flex h-9 min-w-[2.25rem] items-center justify-center rounded-edge border border-border px-2 text-meta font-semibold text-ink-muted opacity-40 cursor-not-allowed";

  return (
    <nav
      aria-label="Paginação da listagem"
      className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-meta text-ink-muted">
        Página {state.page} de {state.totalPages} · {state.rangeLabel}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {/* Anterior */}
        {state.hasPrevious ? (
          <Link
            href={pageHref(state.page - 1)}
            className={linkStyle}
            rel="prev"
            aria-label="Página anterior"
          >
            ←
          </Link>
        ) : (
          <span className={disabledStyle} aria-disabled="true" aria-label="Não há página anterior">
            ←
          </span>
        )}

        {/* Janela de páginas */}
        {state.pageWindow.map((item, index) =>
          item === null ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 items-center px-1 text-meta text-ink-muted"
              aria-hidden="true"
            >
              …
            </span>
          ) : item === state.page ? (
            <span
              key={item}
              className={activeStyle}
              aria-current="page"
              aria-label={`Página ${item}, atual`}
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={pageHref(item)}
              className={linkStyle}
              aria-label={`Ir para página ${item}`}
            >
              {item}
            </Link>
          ),
        )}

        {/* Próxima */}
        {state.hasNext ? (
          <Link
            href={pageHref(state.page + 1)}
            className={linkStyle}
            rel="next"
            aria-label="Próxima página"
          >
            →
          </Link>
        ) : (
          <span className={disabledStyle} aria-disabled="true" aria-label="Não há próxima página">
            →
          </span>
        )}
      </div>
    </nav>
  );
}
