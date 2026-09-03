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
          <span className="font-display text-title-md leading-none text-bordeaux">
            Acervo Católico
          </span>
          <span className="kicker mt-1 group-hover:text-ink">
            Catálogo de consulta · santos, papas, doutrina e história
          </span>
        </Link>

        <div className="w-full md:max-w-sm">
          <SearchField label="Buscar em todo o acervo" />
        </div>
      </div>

      <CategoryNav />
    </header>
  );
}
