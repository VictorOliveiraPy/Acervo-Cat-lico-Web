"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { PRIMARY_CATEGORY_SLUGS } from "@/lib/categoryGroups";
import type { CategorySlug } from "@/lib/schemas";

const LINK_BASE =
  "-mb-px flex h-9 items-center border-b-2 font-sans text-meta transition-colors";

function linkStyle(isActive: boolean): string {
  return `${LINK_BASE} ${
    isActive
      ? "border-accent text-accent"
      : "border-transparent text-ink-muted hover:border-border-strong hover:text-ink"
  }`;
}

/**
 * Navegação das categorias de acesso mais direto, presente em toda página.
 *
 * Só as `PRIMARY_CATEGORY_SLUGS` (as mais buscadas/clássicas). No desktop
 * aparece como faixa abaixo do header. No mobile aparece como scroll horizontal
 * compacto — visível em qualquer tela, porque em celular é o único atalho
 * rápido para categorias (o footer fica fora da tela).
 *
 * Não aparece na home: o bloco "Explore a fé" já cobre esse papel.
 * Não aparece na Academia: a navegação da Academia é interna.
 */
export function CategoryNav() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/academia")) return null;

  function isActive(slug: CategorySlug): boolean {
    const href = categoryPath(slug);
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Categorias de acesso direto"
      className="border-t border-border bg-canvas"
    >
      <ul className="mx-auto flex max-w-shell items-stretch gap-4 overflow-x-auto px-4 sm:gap-6 sm:px-6">
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
        {/* "Todas" como atalho rápido para o índice completo no rodapé */}
        <li className="shrink-0">
          <a
            href="#todas-categorias"
            className={`${LINK_BASE} border-transparent text-ink-muted hover:border-border-strong hover:text-ink`}
          >
            Todas →
          </a>
        </li>
      </ul>
    </nav>
  );
}
