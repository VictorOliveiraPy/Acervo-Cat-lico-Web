import Link from "next/link";

import { SearchField } from "@/components/SearchField";
import { StatusMessage } from "@/components/Editorial";
import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { PRIMARY_CATEGORY_SLUGS } from "@/lib/categoryGroups";

/**
 * Página 404: em vez de beco sem saída, oferece a busca e um ponto de
 * partida — não a lista inteira. Mesma decisão já tomada na home
 * ("Comece por aqui"): 49 categorias de uma vez é índice, não atalho, e o
 * rodapé (presente aqui também, via `SiteFooter` global) já é o lugar
 * certo pra quem quer ver tudo.
 */
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

      <nav aria-label="Categorias mais buscadas" className="mt-10">
        <h2 className="kicker">Comece por aqui</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {PRIMARY_CATEGORY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={categoryPath(slug)}
                className="block rounded-edge border border-rule-faint bg-parchment-raised px-4 py-2.5 text-body text-ink transition-colors hover:border-bordeaux hover:text-bordeaux"
              >
                {CATEGORY_LABELS[slug].nav}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          {/* Âncora do próprio rodapé desta página (`SiteFooter` é global,
              não só da home) — não precisa navegar pra lugar nenhum. */}
          <a
            href="#todas-categorias"
            className="text-meta text-bordeaux underline-offset-4 hover:underline"
          >
            Ou veja todas as categorias no rodapé ↓
          </a>
        </p>
      </nav>
    </div>
  );
}
