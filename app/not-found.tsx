import Link from "next/link";

import { SearchField } from "@/components/SearchField";
import { StatusMessage } from "@/components/Editorial";
import { CATEGORY_NAV, categoryPath } from "@/lib/categories";

/** Página 404: em vez de beco sem saída, oferece a busca e as oito categorias. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-shell px-4 py-16 sm:px-6">
      <StatusMessage title="Esta página não existe no acervo">
        <p>
          O endereço pode estar com erro de digitação, ou a entrada ainda não foi
          publicada. Busque pelo nome ou escolha uma categoria abaixo.
        </p>
      </StatusMessage>

      <div className="mt-8 max-w-2xl">
        <SearchField variant="prominent" label="Buscar em todo o acervo" />
      </div>

      <nav aria-label="Categorias do acervo" className="mt-10">
        <h2 className="kicker">Categorias</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_NAV.map(({ slug, label }) => (
            <li key={slug}>
              <Link
                href={categoryPath(slug)}
                className="block rounded-edge border border-rule-faint bg-parchment-raised px-4 py-3 text-body text-ink transition-colors hover:border-bordeaux hover:text-bordeaux"
              >
                {label.nav}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
