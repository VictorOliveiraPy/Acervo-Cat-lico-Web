import Link from "next/link";

import { CATEGORY_LABELS, entryPath } from "@/lib/categories";
import { entryHighlight, entryOrdinal } from "@/lib/entryDisplay";
import type { Entry } from "@/lib/schemas";

type Props = {
  entries: Entry[];
  /**
   * Mostra a categoria na coluna da esquerda em vez da posição na sequência.
   * Usado em lista misturada (página inicial), onde a procedência da entrada
   * importa mais que a ordem dela dentro da própria categoria.
   */
  showCategory?: boolean;
};

/**
 * Listagem de entradas.
 *
 * As linhas são um objeto só, repetido: mesmo filete acima, mesmo recuo, mesma
 * coluna de rótulo. Não são cards — a listagem é uma sequência para escanear, e
 * emoldurar cada item em caixa própria competiria com o título da página.
 */
export function EntryList({ entries, showCategory = false }: Props) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => {
        const ordinal = entryOrdinal(entry);
        const highlight = entryHighlight(entry);
        const leftLabel = showCategory
          ? CATEGORY_LABELS[entry.categoria].nav
          : (ordinal ?? highlight);
        const showHighlightUnderTitle = highlight !== null && highlight !== leftLabel;

        return (
          <li key={entry.id} className="border-t border-rule-faint">
            <Link
              href={entryPath(entry.categoria, entry.slug)}
              className="group flex flex-col gap-2 py-6 transition-colors hover:bg-parchment-raised sm:flex-row sm:gap-8"
            >
              <p className="kicker shrink-0 sm:w-44 sm:pt-1.5">
                {leftLabel ?? "Entrada"}
              </p>

              <div className="min-w-0">
                <h3 className="font-display text-title-sm text-ink group-hover:text-bordeaux">
                  {entry.titulo}
                </h3>
                {showHighlightUnderTitle ? (
                  <p className="mt-1 text-meta text-bordeaux">{highlight}</p>
                ) : null}
                <p className="mt-2 max-w-measure text-body text-ink-muted">
                  {entry.resumo}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
