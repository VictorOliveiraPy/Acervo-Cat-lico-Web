"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { PRIMARY_CATEGORY_SLUGS } from "@/lib/categoryGroups";
import type { CategorySlug } from "@/lib/schemas";

const LINK_BASE =
  "-mb-px flex h-9 items-center border-b-2 font-body text-meta transition-colors";

function linkStyle(isActive: boolean): string {
  return `${LINK_BASE} ${
    isActive
      ? "border-bordeaux text-bordeaux"
      : "border-transparent text-ink-muted hover:border-gold hover:text-ink"
  }`;
}

/**
 * Navegação das categorias de acesso mais direto, presente em toda página.
 *
 * Só as `PRIMARY_CATEGORY_SLUGS` (as mais buscadas/clássicas) — o painel
 * "Todas as categorias" que existia aqui foi removido: com "Percorrer por
 * categoria" na home virando um índice completo das 45, agrupado por
 * assunto (ver `app/page.tsx`), e o rodapé já trazendo o mesmo índice em
 * toda página (`SiteFooter`), duplicar essa lista inteira aqui — atrás de
 * um clique, sobre a faixa de navegação — parou de justificar o peso.
 * Faixa também mais baixa (`h-9`, era `h-11`): fazia parte do mesmo pedido
 * de "diminuir o cabeçalho".
 */
export function CategoryNav() {
  const pathname = usePathname();

  function isActive(slug: CategorySlug): boolean {
    const href = categoryPath(slug);
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Categorias de acesso direto"
      className="border-t border-rule-faint bg-parchment-deep"
    >
      <ul className="mx-auto flex max-w-shell items-stretch gap-6 overflow-x-auto px-4 sm:px-6">
        {PRIMARY_CATEGORY_SLUGS.map((slug) => (
          <li key={slug} className="shrink-0">
            <Link
              href={categoryPath(slug)}
              aria-current={isActive(slug) ? "page" : undefined}
              className={linkStyle(isActive(slug))}
            >
              {CATEGORY_LABELS[slug].nav}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
