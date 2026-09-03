import Link from "next/link";

import { entryPath } from "@/lib/categories";
import { splitByTerm, type CategoryGroup } from "@/lib/search";

/** Trecho da entrada com as ocorrências do termo marcadas. */
function Excerpt({ text, term }: { text: string; term: string }) {
  return (
    <p className="mt-1 max-w-measure text-body text-ink-muted">
      {splitByTerm(text, term).map((segment, index) =>
        segment.isMatch ? (
          <mark
            key={index}
            className="bg-gold-wash px-0.5 text-ink"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  );
}

/**
 * Resultados da busca agrupados por categoria.
 *
 * O agrupamento é o que mostra que a busca atravessou o acervo inteiro: a
 * pessoa vê, de uma vez, que "eucaristia" aparece em milagres, no Catecismo e
 * na Crisma — em vez de uma lista corrida sem procedência.
 */
export function SearchResults({
  groups,
  term,
}: {
  groups: CategoryGroup[];
  term: string;
}) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.slug} aria-labelledby={`grupo-${group.slug}`}>
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-gold pb-2">
            <h2
              id={`grupo-${group.slug}`}
              className="font-display text-title-sm text-bordeaux"
            >
              {group.label}
            </h2>
            <p className="kicker">
              {group.results.length === 1
                ? "1 ocorrência"
                : `${group.results.length} ocorrências`}
            </p>
          </div>

          <ul className="flex flex-col">
            {group.results.map((result) => (
              <li
                key={`${result.categoria}:${result.slug}`}
                className="border-b border-rule-faint"
              >
                <Link
                  href={entryPath(result.categoria, result.slug)}
                  className="group block py-5 transition-colors hover:bg-parchment-raised"
                >
                  <h3 className="font-display text-title-sm text-ink group-hover:text-bordeaux">
                    {result.titulo}
                  </h3>
                  <Excerpt text={result.trecho} term={term} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
