"use client";

import { useState } from "react";
import Link from "next/link";

import { entryPath } from "@/lib/categories";
import { splitByTerm, type CategoryGroup } from "@/lib/search";

/** Quantos resultados mostrar de saída, antes de "mostrar mais resultados". */
const INITIAL_VISIBLE = 15;
/** Quantos resultados a mais cada clique em "mostrar mais" revela. */
const REVEAL_STEP = 15;

/** Trecho da entrada com as ocorrências do termo marcadas. */
function Excerpt({ text, term }: { text: string; term: string }) {
  return (
    <p className="mt-1 max-w-measure text-body text-ink-muted">
      {splitByTerm(text, term).map((segment, index) =>
        segment.isMatch ? (
          <mark
            key={index}
            className="bg-gold-wash px-0.5 text-ink"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  );
}

/**
 * Resultados da busca agrupados por categoria, revelados aos poucos.
 *
 * O agrupamento é o que mostra que a busca atravessou o acervo inteiro: a
 * pessoa vê, de uma vez, que "eucaristia" aparece em milagres, no Catecismo e
 * na Crisma — em vez de uma lista corrida sem procedência. Mas um termo
 * comum pode bater em 50 entradas espalhadas por 20 categorias — sem limite,
 * a página vira uma rolagem enorme antes do fim. O backend de busca não pagina
 * (`/api/search` só tem `limit`, sem `offset`), e mudar isso é fora do
 * escopo deste redesign — em vez disso, revela aos poucos os resultados que
 * já vieram numa única resposta, sem nova requisição a cada clique.
 *
 * Cada grupo sempre mostra sua contagem TOTAL de ocorrências no cabeçalho
 * (não só quantas estão visíveis agora) — continua provando que a busca
 * "olhou" ali, mesmo antes de revelar os itens dessa categoria.
 */
export function SearchResults({
  groups,
  term,
}: {
  groups: CategoryGroup[];
  term: string;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const totalResults = groups.reduce((sum, group) => sum + group.results.length, 0);
  let remaining = visibleCount;

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => {
        const shown = group.results.slice(0, Math.max(remaining, 0));
        remaining -= shown.length;
        if (shown.length === 0) return null;

        return (
          <section key={group.slug} aria-labelledby={`grupo-${group.slug}`}>
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-gold pb-2">
              <h2
                id={`grupo-${group.slug}`}
                className="font-display text-title-sm text-bordeaux"
              >
                {group.label}
              </h2>
              <p className="kicker">
                {group.results.length === 1
                  ? "1 ocorrência"
                  : `${group.results.length} ocorrências`}
              </p>
            </div>

            <ul className="flex flex-col">
              {shown.map((result) => (
                <li
                  key={`${result.categoria}:${result.slug}`}
                  className="border-b border-rule-faint"
                >
                  <Link
                    href={entryPath(result.categoria, result.slug)}
                    className="group block py-5 transition-colors hover:bg-parchment-raised"
                  >
                    <h3 className="font-display text-title-sm text-ink group-hover:text-bordeaux">
                      {result.titulo}
                    </h3>
                    <Excerpt text={result.trecho} term={term} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {visibleCount < totalResults ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + REVEAL_STEP)}
          className="self-start rounded-edge border border-bordeaux px-5 py-2.5 text-label uppercase tracking-[0.09em] text-bordeaux transition-colors hover:bg-bordeaux hover:text-parchment-raised"
        >
          Mostrar mais resultados ({totalResults - visibleCount} restantes)
        </button>
      ) : null}
    </div>
  );
}
