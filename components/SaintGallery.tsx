import Image from "next/image";
import Link from "next/link";

import { entryPath } from "@/lib/categories";
import { SAINT_ASSETS } from "@/lib/saintAssets";

/**
 * Galeria dos santos com arte revisada, no topo da categoria Santos.
 *
 * É o único lugar em que muitos retratos juntos fazem sentido, porque a imagem
 * é o próprio objeto de descoberta. Mostra só `SAINT_ASSETS`: o restante do kit
 * segue fora até a revisão de iconografia. A lista completa da categoria
 * continua logo abaixo, com ou sem ilustração.
 */
export function SaintGallery() {
  return (
    <section aria-labelledby="galeria-santos">
      <p className="eyebrow">Galeria</p>
      <h2 id="galeria-santos" className="mt-2 font-display text-title-md text-ink">
        Vidas que inspiram
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {SAINT_ASSETS.map((saint) => (
          <li key={saint.slug}>
            <Link
              href={entryPath("santos", saint.slug)}
              className="group block h-full overflow-hidden rounded-panel border border-border bg-surface transition-colors hover:border-border-strong"
            >
              <Image
                src={saint.card}
                alt={saint.alt}
                width={320}
                height={400}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="p-3 sm:p-4">
                <h3 className="font-display text-title-sm leading-tight text-ink group-hover:text-accent">
                  {saint.name}
                </h3>
                <p className="mt-1 text-meta text-ink-muted">{saint.attributes}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-meta text-ink-muted">
        Ilustrações devocionais contemporâneas, não retratos históricos.
      </p>
    </section>
  );
}
