import Image from "next/image";
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
 * miniatura. Não são cards — a listagem é uma sequência para escanear, no
 * padrão "episódio": miniatura maior à esquerda, título em destaque e um
 * rótulo discreto embaixo dele (a categoria, ou a posição/destaque da
 * entrada), como uma lista de episódios de programa.
 */
export function EntryList({ entries, showCategory = false }: Props) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => {
        const ordinal = entryOrdinal(entry);
        const highlight = entryHighlight(entry);
        const label = showCategory
          ? CATEGORY_LABELS[entry.categoria].nav
          : (ordinal ?? highlight);

        return (
          <li key={entry.id} className="border-t border-rule-faint">
            <Link
              href={entryPath(entry.categoria, entry.slug)}
              className="group flex flex-col gap-4 py-6 transition-colors hover:bg-parchment-raised sm:flex-row sm:gap-6"
            >
              {entry.imagem ? (
                <Image
                  src={entry.imagem}
                  alt=""
                  width={160}
                  height={112}
                  className="h-28 w-full shrink-0 rounded-edge border border-rule-faint object-cover sm:h-24 sm:w-32"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-28 w-full shrink-0 items-center justify-center rounded-edge border border-rule-faint bg-parchment-raised text-title-md sm:h-24 sm:w-32"
                >
                  {CATEGORY_LABELS[entry.categoria].icon}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="font-display text-title-sm text-ink group-hover:text-bordeaux">
                  {entry.titulo}
                </h3>
                {label ? <p className="mt-1 kicker text-bordeaux">{label}</p> : null}
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
