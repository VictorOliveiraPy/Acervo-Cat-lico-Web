import Image from "next/image";
import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { CATEGORY_LABELS, entryPath } from "@/lib/categories";
import { imagePosition, readingMinutes } from "@/lib/entryDisplay";
import { saintAssetFor } from "@/lib/saintAssets";
import type { Entry } from "@/lib/schemas";

type Props = {
  entries: Entry[];
};

/**
 * Amostra de entradas da home, no cartão do Design System: imagem em cima e
 * texto embaixo, sem título sobre a foto nem véu escuro. Só para esta vitrine
 * curta: a listagem de uma categoria inteira continua em `EntryList`.
 */
export function EntryGrid({ entries }: Props) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {entries.map((entry) => {
        const saintAsset = saintAssetFor(entry);
        const image = saintAsset?.card ?? entry.imagem;
        const label = CATEGORY_LABELS[entry.categoria];
        return (
          <li key={entry.id}>
            <Link
              href={entryPath(entry.categoria, entry.slug)}
              className="group block h-full overflow-hidden rounded-panel border border-border bg-surface transition-colors hover:border-border-strong"
            >
              <div className="relative aspect-[4/3] bg-canvas">
                {image ? (
                  <Image
                    src={image}
                    alt={entry.titulo}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className={`object-cover ${saintAsset ? "object-top" : ""}`}
                    style={saintAsset ? undefined : { objectPosition: imagePosition(entry) }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center"
                  >
                    <BrandMark className="h-12 w-12 opacity-40" />
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <p className="kicker">{label.nav}</p>
                <h3 className="mt-1 line-clamp-3 font-display text-title-sm leading-tight text-ink group-hover:text-accent">
                  {entry.titulo}
                </h3>
                <p className="mt-1 text-meta text-ink-muted">{readingMinutes(entry.corpo)} min de leitura</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
