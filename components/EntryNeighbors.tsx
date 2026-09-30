import Link from "next/link";

import { entryPath } from "@/lib/categories";
import { DEFAULT_LOCALE, dictionaryFor, localePath, type SiteLang } from "@/lib/i18n";
import type { Neighbors } from "@/lib/neighbors";
import type { CategoryIndexItem } from "@/lib/services/acervoService";
import type { CategorySlug } from "@/lib/schemas";

type Props = {
  categoria: CategorySlug;
  neighbors: Neighbors<CategoryIndexItem>;
  lang?: SiteLang;
};

/** Links para a entrada anterior e a próxima da mesma categoria (links reais, sem JavaScript). */
export function EntryNeighbors({ categoria, neighbors, lang = DEFAULT_LOCALE }: Props) {
  const { previous, next } = neighbors;
  const t = dictionaryFor(lang);
  if (!previous && !next) return null;

  const linkStyle =
    "group flex flex-col gap-1 rounded-edge border border-border px-4 py-3 transition-colors hover:border-accent hover:bg-surface";

  return (
    <nav
      aria-label={t.neighborsLabel}
      className="mt-section grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link href={localePath(lang, entryPath(categoria, previous.slug))} rel="prev" className={linkStyle}>
          <span className="kicker">{t.previous}</span>
          <span className="font-display text-title-md text-ink group-hover:text-accent">
            {previous.titulo}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={localePath(lang, entryPath(categoria, next.slug))}
          rel="next"
          className={`${linkStyle} sm:text-right`}
        >
          <span className="kicker">{t.next}</span>
          <span className="font-display text-title-md text-ink group-hover:text-accent">
            {next.titulo}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
