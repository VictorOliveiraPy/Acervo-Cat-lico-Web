"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { CATEGORY_GROUPS, PRIMARY_CATEGORY_SLUGS } from "@/lib/categoryGroups";
import type { CategorySlug } from "@/lib/schemas";

const LINK_BASE =
  "-mb-px flex h-11 items-center border-b-2 font-body text-meta transition-colors";

function linkStyle(isActive: boolean): string {
  return `${LINK_BASE} ${
    isActive
      ? "border-bordeaux text-bordeaux"
      : "border-transparent text-ink-muted hover:border-gold hover:text-ink"
  }`;
}

/**
 * Navegação das categorias do acervo, presente em toda página.
 *
 * Com 45 categorias, listar todas soltas na faixa virou uma rolagem
 * cansativa de escanear. A solução tem duas partes: a faixa mostra só as
 * categorias de acesso mais direto (`PRIMARY_CATEGORY_SLUGS`), e um botão
 * "Todas as categorias" abre um painel com as 45 agrupadas por assunto
 * (`CATEGORY_GROUPS`) — a mesma ideia de agrupamento que estrutura o
 * rodapé (`SiteFooter`), só que atrás de um clique em vez de sempre visível.
 */
export function CategoryNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fecha ao navegar, ao clicar fora do painel/botão, ou com Esc — os três
  // jeitos que uma pessoa "sai" de um menu sem perceber que é uma ação
  // explícita de fechar.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function isActive(slug: CategorySlug): boolean {
    const href = categoryPath(slug);
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Categorias do acervo"
      className="relative border-t border-rule-faint bg-parchment-deep"
      ref={panelRef}
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
        <li className="shrink-0">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={`${LINK_BASE} gap-1 border-transparent text-ink-muted hover:border-gold hover:text-ink`}
          >
            Todas as categorias
            <span aria-hidden="true">{open ? "▴" : "▾"}</span>
          </button>
        </li>
      </ul>

      {open ? (
        <div className="absolute inset-x-0 top-full z-20 border-b border-t border-rule-faint bg-parchment-raised shadow-lg">
          <div className="mx-auto grid max-w-shell gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="kicker text-bordeaux">{group.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.slugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={categoryPath(slug)}
                        aria-current={isActive(slug) ? "page" : undefined}
                        className={`text-meta transition-colors ${
                          isActive(slug)
                            ? "text-bordeaux"
                            : "text-ink-muted hover:text-bordeaux hover:underline"
                        }`}
                      >
                        {CATEGORY_LABELS[slug].nav}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
