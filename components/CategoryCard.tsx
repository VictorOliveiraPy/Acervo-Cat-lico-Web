import Link from "next/link";

import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { formatEntryCount } from "@/lib/entryDisplay";
import type { CategoryInfo } from "@/lib/schemas";

/**
 * Card de categoria da página inicial.
 *
 * Aqui o card se justifica: são vários destinos concorrentes, e a moldura é o
 * que diz "cada um destes é um lugar para onde ir". O total vem da API, não é
 * decorativo — é a prova de que a categoria tem conteúdo.
 */
export function CategoryCard({ info }: { info: CategoryInfo }) {
  const label = CATEGORY_LABELS[info.categoria];

  return (
    <Link
      href={categoryPath(info.categoria)}
      className="group flex h-full flex-col justify-between gap-6 rounded-edge border border-rule-faint bg-parchment-raised p-6 transition-colors hover:border-bordeaux"
    >
      <div>
        <span aria-hidden="true" className="text-title-md">
          {label.icon}
        </span>
        <h3 className="mt-2 font-display text-title-sm text-ink group-hover:text-bordeaux">
          {label.nav}
        </h3>
        <p className="mt-2 text-meta text-ink-muted">{label.tagline}</p>
      </div>

      <p className="kicker border-t border-rule-faint pt-3 text-bordeaux">
        {formatEntryCount(info.total)}
      </p>
    </Link>
  );
}
