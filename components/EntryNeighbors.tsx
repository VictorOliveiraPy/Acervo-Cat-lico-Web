import Link from "next/link";

import { entryPath } from "@/lib/categories";
import type { Neighbors } from "@/lib/neighbors";
import type { CategoryIndexItem } from "@/lib/services/acervoService";
import type { CategorySlug } from "@/lib/schemas";

type Props = {
  categoria: CategorySlug;
  neighbors: Neighbors<CategoryIndexItem>;
};

/** Links para a entrada anterior e a próxima da mesma categoria (links reais, sem JavaScript). */
export function EntryNeighbors({ categoria, neighbors }: Props) {
  const { previous, next } = neighbors;
  if (!previous && !next) return null;

  const linkStyle =
    "group flex flex-col gap-1 rounded-edge border border-rule-faint px-4 py-3 transition-colors hover:border-bordeaux hover:bg-parchment-raised";

  return (
    <nav
      aria-label="Entradas vizinhas"
      className="mt-section grid gap-4 border-t border-rule-faint pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link href={entryPath(categoria, previous.slug)} rel="prev" className={linkStyle}>
          <span className="kicker">← Anterior</span>
          <span className="font-display text-title-md text-ink group-hover:text-bordeaux">
            {previous.titulo}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={entryPath(categoria, next.slug)}
          rel="next"
          className={`${linkStyle} sm:text-right`}
        >
          <span className="kicker">Próxima →</span>
          <span className="font-display text-title-md text-ink group-hover:text-bordeaux">
            {next.titulo}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
