"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CategoryNav } from "@/components/CategoryNav";
import { SearchField } from "@/components/SearchField";

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
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-rule-faint bg-parchment shadow-sm">
      {/* `py-3`/`gap-2.5`, não `py-band`/`gap-band`: pedido explícito de
          diminuir o cabeçalho, depois que "Todas as categorias" saiu da
          faixa de baixo (`CategoryNav`) — o resto do cabeçalho também
          podia ocupar menos altura. */}
      <div className="mx-auto flex max-w-shell flex-col gap-2.5 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group flex flex-col">
          <span className="flex items-center gap-2 font-display text-title-md leading-none text-bordeaux">
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
            Compêndio Católico
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/7/76/Campinas_-_13_de_setembro-96_%28cropped%29.jpg"
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              className="h-7 w-7 shrink-0 rounded-edge object-cover object-[50%_28%]"
            />
          </span>
          <span className="kicker mt-1 group-hover:text-ink">
            Catálogo de consulta · fé, doutrina e vida católica
          </span>
        </Link>

        <div className="flex w-full flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-end md:w-auto">
          {isHome ? null : (
            <div className="w-full md:max-w-sm">
              <SearchField label="Buscar em todo o acervo" />
            </div>
          )}
          {/* Chatbot do acervo: até aqui só alcançável pelo rodapé — um
              diferencial real (poucos sites católicos têm isso) invisível na
              navegação principal. Link de texto, não botão, pra não crescer
              a altura do cabeçalho nem competir com "Acender uma vela";
              cabe na mesma linha em telas médias/grandes. */}
          <Link
            href="/perguntar"
            className="shrink-0 text-meta text-ink-muted underline-offset-4 hover:text-bordeaux hover:underline"
          >
            💬 Perguntar ao acervo
          </Link>
          <Link
            href="/velas"
            className="flex shrink-0 items-center justify-center gap-2 rounded-edge border border-bordeaux bg-bordeaux px-4 py-2.5 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft"
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
