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
 */
export function Pagination({ basePath, state }: Props) {
  if (state.totalPages <= 1) return null;

  const linkStyle =
    "rounded-edge border border-bordeaux px-4 py-2 text-meta text-bordeaux transition-colors hover:bg-bordeaux hover:text-parchment-raised";
  const disabledStyle =
    "rounded-edge border border-rule-faint px-4 py-2 text-meta text-ink-muted/70";

  return (
    <nav
      aria-label="Paginação da listagem"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-rule-faint pt-6"
    >
      <p className="text-meta text-ink-muted">
        Página {state.page} de {state.totalPages} · {state.rangeLabel}
      </p>

      <div className="flex items-center gap-3">
        {state.hasPrevious ? (
          <Link
            href={`${basePath}${buildQueryString({ offset: state.previousOffset || undefined })}`}
            className={linkStyle}
            rel="prev"
          >
            ← Anteriores
          </Link>
        ) : (
          <span className={disabledStyle} aria-disabled="true">
            ← Anteriores
          </span>
        )}

        {state.hasNext ? (
          <Link
            href={`${basePath}${buildQueryString({ offset: state.nextOffset })}`}
            className={linkStyle}
            rel="next"
          >
            Próximas →
          </Link>
        ) : (
          <span className={disabledStyle} aria-disabled="true">
            Próximas →
          </span>
        )}
      </div>
    </nav>
  );
}
