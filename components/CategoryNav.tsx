"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CATEGORY_NAV, categoryPath } from "@/lib/categories";

/**
 * Navegação das oito categorias, presente em toda página.
 *
 * É client component apenas por causa do estado ativo (`usePathname`): saber em
 * que categoria a pessoa está é o que impede o menu de virar oito links iguais.
 * Em telas estreitas a faixa rola na horizontal em vez de virar menu escondido —
 * as oito categorias são a estrutura do acervo, e esconder isso atrás de um
 * botão obrigaria a pessoa a adivinhar o que existe.
 */
export function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Categorias do acervo" className="border-t border-rule-faint bg-parchment-deep">
      <ul className="mx-auto flex max-w-shell items-stretch gap-6 overflow-x-auto px-4 sm:px-6">
        {CATEGORY_NAV.map(({ slug, label }) => {
          const href = categoryPath(slug);
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={slug} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`-mb-px flex h-11 items-center border-b-2 font-body text-meta transition-colors ${
                  isActive
                    ? "border-bordeaux text-bordeaux"
                    : "border-transparent text-ink-muted hover:border-gold hover:text-ink"
                }`}
              >
                {label.nav}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
