"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/BrandMark";
import { CategoryNav } from "@/components/CategoryNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchField } from "@/components/SearchField";
import { DEFAULT_LOCALE, dictionaryFor, langFromPathname, localePath } from "@/lib/i18n";
import { MAIN_NAV, activeNavItem } from "@/lib/navigation";

/** Páginas que já têm a busca grande no conteúdo: repetir o campo aqui é a mesma busca duas vezes. */
const PAGES_WITH_OWN_SEARCH = new Set(["/", "/busca"]);

/**
 * Cabeçalho do Design System 1.0: marca, navegação superior e busca, sem
 * sidebar global. A busca continua no cabeçalho porque atravessar as categorias
 * é o caminho principal do acervo; no celular ela vira um atalho para `/busca`,
 * para o cabeçalho fixo não tomar a tela de leitura. `"use client"` só por causa
 * do `usePathname`: o cabeçalho não busca dado nenhum.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const lang = langFromPathname(pathname);
  const isPortuguese = lang === DEFAULT_LOCALE;
  const t = dictionaryFor(lang);
  const active = activeNavItem(pathname);
  const showSearch = isPortuguese && !PAGES_WITH_OWN_SEARCH.has(pathname);
  const [brandName, ...brandRest] = t.homeHeading.split(" ");

  return (
    <>
      {/* Fora do `header` fixo: a frase do site continua em toda página, sem
          tomar altura da tela de leitura ao rolar. */}
      <div className="bg-canvas">
        <p className="kicker mx-auto max-w-shell px-4 pt-2 sm:px-6">{t.siteTagline}</p>
      </div>
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-shell flex-wrap items-center gap-x-4 gap-y-1 px-4 md:gap-x-8 pt-2 sm:px-6 md:flex-nowrap md:py-3">
          <Link href={localePath(lang, "/")} className="flex shrink-0 items-center gap-3">
            <BrandMark />
            <span className="font-display text-title-sm font-bold leading-none text-ink">
              {brandName}
              <span className="mt-1 block font-sans text-[0.625rem] font-bold uppercase leading-none tracking-[0.16em]">
                {brandRest.join(" ")}
              </span>
            </span>
          </Link>

          {/* No celular a navegação desce para uma faixa própria, via `order`. */}
          {isPortuguese ? (
            <nav
              aria-label="Navegação principal"
              className="order-last -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6 md:order-none md:mx-0 md:w-auto md:px-0"
            >
              <ul className="flex items-center gap-6">
                {MAIN_NAV.map(({ id, label, href }) => (
                  <li key={id} className="shrink-0">
                    <Link
                      href={href}
                      aria-current={active === id ? (pathname === href ? "page" : "true") : undefined}
                      className={`flex h-10 items-center border-b-2 text-meta font-semibold transition-colors ${
                        active === id
                          ? "border-accent text-accent"
                          : "border-transparent text-ink-muted hover:text-accent"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="ml-auto flex items-center gap-4 md:min-w-0 md:flex-1 md:justify-end">
            <LanguageSwitcher />
            {showSearch ? (
              <>
                {/* Só a partir de `lg`: em tablet, marca e navegação espremiam o campo. */}
                <div className="hidden w-full max-w-xs lg:block">
                  <SearchField label="Buscar em todo o acervo" />
                </div>
                <Link
                  href="/busca"
                  aria-label="Buscar no acervo"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent lg:hidden"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="10.6" cy="10.6" r="6.9" stroke="currentColor" strokeWidth="1.7" />
                    <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </Link>
              </>
            ) : null}
          </div>
        </div>

        {isPortuguese ? <CategoryNav /> : null}
      </header>
    </>
  );
}
