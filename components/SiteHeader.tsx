"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CategoryNav } from "@/components/CategoryNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchField } from "@/components/SearchField";
import { DEFAULT_LOCALE, dictionaryFor, langFromPathname, localePath } from "@/lib/i18n";

/**
 * Cabeçalho em duas faixas: identidade + busca na primeira, categorias na
 * segunda (recuada). A busca fica no cabeçalho, e não só na página inicial,
 * porque atravessar todas as categorias é o caminho principal do acervo —
 * exceto na própria home, que já tem sua busca grande no herói logo abaixo:
 * repetir o campo aqui empilhado em cima dela (mobile) é a mesma busca duas
 * vezes na primeira tela. `"use client"` só por causa do `usePathname`
 * dessa checagem (e do já usado por `CategoryNav`) — o cabeçalho não busca
 * dado nenhum, então não custa nada virar client.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const lang = langFromPathname(pathname);
  const isPortuguese = lang === DEFAULT_LOCALE;
  const t = dictionaryFor(lang);
  // Busca, velas e o menu de categorias ainda são só em português.
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas">
      {/* `py-3`/`gap-2.5`, não `py-band`/`gap-band`: pedido explícito de
          diminuir o cabeçalho, depois que "Todas as categorias" saiu da
          faixa de baixo (`CategoryNav`) — o resto do cabeçalho também
          podia ocupar menos altura. */}
      <div className="mx-auto flex max-w-shell flex-col gap-2.5 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href={localePath(lang, "/")} className="group flex flex-col">
          <span className="flex items-center gap-2 font-display text-title-sm leading-none text-accent sm:text-title-md">
            {/* Emoji de bandeira (🇻🇦) em vez de imagem: Windows não tem a
                fonte de emoji de bandeiras, então a maioria dos navegadores
                ali (Chrome, Firefox) mostra as duas letras do código do país
                ("VA") soltas em vez da bandeira — troca pro SVG da própria
                bandeira, que renderiza igual em qualquer SO. */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vatican_City_%282023%E2%80%93present%29.svg"
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="h-5 w-5 shrink-0"
            />
            {t.homeHeading}
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/7/76/Campinas_-_13_de_setembro-96_%28cropped%29.jpg"
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              className="h-6 w-6 shrink-0 rounded-edge object-cover object-[50%_28%] sm:h-7 sm:w-7"
            />
          </span>
          <span className="kicker mt-1 group-hover:text-ink">
            {t.siteTagline}
          </span>
        </Link>

        <div className="flex w-full flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-end md:w-auto">
          <LanguageSwitcher />
          {isHome || !isPortuguese ? null : (
            <div className="w-full md:max-w-sm">
              <SearchField label="Buscar em todo o acervo" />
            </div>
          )}
          {isPortuguese ? (
            <Link
              href="/velas"
              className="flex shrink-0 items-center justify-center gap-2 rounded-edge border border-accent bg-accent px-4 py-2.5 text-label uppercase tracking-[0.09em] text-surface transition-colors hover:bg-accent-hover"
            >
              <span aria-hidden="true">🕯️</span>
              Acender uma vela
            </Link>
          ) : null}
        </div>
      </div>

      {isPortuguese ? <CategoryNav /> : null}
    </header>
  );
}
