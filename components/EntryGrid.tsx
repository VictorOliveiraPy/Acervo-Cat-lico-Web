import Image from "next/image";
import Link from "next/link";

import { CATEGORY_LABELS, entryPath } from "@/lib/categories";
import type { Entry } from "@/lib/schemas";

type Props = {
  entries: Entry[];
};

/**
 * Grade de entradas em estilo "episódio" — clone do mosaico de
 * https://padrepauloricardo.org/programas/homilia-diaria: cada célula é a
 * própria foto, de ponta a ponta, com o título em branco sobreposto na base
 * sobre um gradiente escuro (garante leitura em qualquer imagem, clara ou
 * escura) e um selo no canto. Lá o selo é a duração do episódio; aqui, sem
 * duração, é a categoria — o dado que mais ajuda a escanear a grade.
 *
 * Só para a amostra da home ("Do acervo"): a listagem de uma categoria
 * inteira continua em `EntryList` (lista, com resumo) — mosaico sem texto de
 * apoio funciona para uma vitrine de poucos itens, não para escanear uma
 * categoria de 60+ entradas.
 */
export function EntryGrid({ entries }: Props) {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={entryPath(entry.categoria, entry.slug)}
            className="group relative block aspect-square overflow-hidden rounded-edge bg-ink"
          >
            {entry.imagem ? (
              <Image
                src={entry.imagem}
                alt={entry.titulo}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                // A vitrine tem no máximo 12 fotos, todas visíveis perto do
                // topo da rolagem — carregar como lazy (padrão do next/image)
                // deixava as últimas em preto sólido (o `bg-ink` de fundo)
                // por um instante enquanto a rede ainda buscava a imagem.
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-full w-full items-center justify-center bg-parchment-deep text-title-lg"
              >
                {CATEGORY_LABELS[entry.categoria].icon}
              </div>
            )}

            {/* Gradiente escuro fixo na base: sem ele, um título branco sobre
                um céu claro ou uma página de manuscrito viraria ilegível —
                a referência não precisa disso porque as fotos dela já são
                escuras na base, mas o acervo tem de tudo (afrescos, ícones,
                manuscritos), então o gradiente é sempre desenhado. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
              <h3 className="font-display text-body font-bold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] sm:text-title-sm">
                {entry.titulo}
              </h3>
              <span className="shrink-0 whitespace-nowrap rounded-full border border-white/40 bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                {CATEGORY_LABELS[entry.categoria].nav}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
