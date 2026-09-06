import Link from "next/link";

import { CategoryNav } from "@/components/CategoryNav";
import { SearchField } from "@/components/SearchField";

/**
 * Cabeçalho em duas faixas: identidade + busca na primeira, categorias na
 * segunda (recuada). A busca fica no cabeçalho, e não só na página inicial,
 * porque atravessar todas as categorias é o caminho principal do acervo.
 */
export function SiteHeader() {
  return (
    <header className="bg-parchment">
      <div className="mx-auto flex max-w-shell flex-col gap-band px-4 py-band sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group flex flex-col">
          <span className="flex items-center gap-2 font-display text-title-md leading-none text-bordeaux">
            <span aria-hidden="true">🇻🇦</span>
            Compêndio Católico
          </span>
          <span className="kicker mt-1 group-hover:text-ink">
            Catálogo de consulta · fé, doutrina e vida católica
          </span>
        </Link>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
          <div className="w-full md:max-w-sm">
            <SearchField label="Buscar em todo o acervo" />
          </div>
          <Link
            href="/velas"
            className="flex shrink-0 items-center justify-center gap-2 rounded-edge border border-gold bg-gold-wash/40 px-4 py-2.5 text-meta text-ink transition-colors hover:border-bordeaux hover:text-bordeaux"
          >
            <span aria-hidden="true">🕯️</span>
            Acender uma vela
          </Link>
        </div>
      </div>

      <CategoryNav />
    </header>
  );
}
