/**
 * Lógica da busca no lado do cliente: agrupar e destacar o que a API devolveu.
 *
 * O backend é quem decide relevância e recorta o trecho; aqui só organizamos a
 * mesma lista por categoria (para a pessoa ver que a busca varreu o acervo
 * inteiro) e marcamos onde o termo aparece.
 */

import { CATEGORY_LABELS } from "@/lib/categories";
import { CATEGORY_SLUGS, type CategorySlug, type SearchResult } from "@/lib/schemas";

/** Resultados de uma categoria, já com o rótulo pronto para o cabeçalho. */
export type CategoryGroup = {
  slug: CategorySlug;
  label: string;
  results: SearchResult[];
};

/** Pedaço de texto do trecho, marcado ou não como ocorrência do termo. */
export type Segment = {
  text: string;
  isMatch: boolean;
};

/**
 * Normaliza texto para comparação sem acento e sem caixa, **preservando o
 * comprimento** (1 caractere → 1 caractere).
 *
 * O comprimento preservado é o que permite usar o índice achado no texto
 * normalizado para recortar o texto original — mesma estratégia do backend.
 */
export function normalizeForMatch(text: string): string {
  return Array.from(text)
    .map((char) => {
      const folded = char
        .normalize("NFKD")
        .replace(/\p{Mn}/gu, "")
        .toLowerCase();
      return folded.length ? folded[0]! : char;
    })
    .join("");
}

/**
 * Agrupa os resultados por categoria, na ordem editorial da navegação.
 *
 * Categoria sem resultado é omitida: o agrupamento serve para mostrar onde a
 * busca encontrou algo, não para listar cabeçalhos vazios.
 */
export function groupByCategory(results: readonly SearchResult[]): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  for (const slug of CATEGORY_SLUGS) {
    const matched = results.filter((result) => result.categoria === slug);
    if (matched.length === 0) continue;
    groups.push({ slug, label: CATEGORY_LABELS[slug].nav, results: matched });
  }
  return groups;
}

/**
 * Divide um texto nos pedaços que casam com o termo, ignorando acento e caixa.
 *
 * Devolve segmentos em vez de HTML de propósito: o texto vem de conteúdo
 * editorial e é renderizado como texto pelo React, sem `dangerouslySetInnerHTML`.
 */
export function splitByTerm(text: string, term: string): Segment[] {
  const needle = normalizeForMatch(term.trim());
  if (!needle) return [{ text, isMatch: false }];

  const haystack = normalizeForMatch(text);
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const found = haystack.indexOf(needle, cursor);
    if (found === -1) break;
    if (found > cursor) {
      segments.push({ text: text.slice(cursor, found), isMatch: false });
    }
    segments.push({
      text: text.slice(found, found + needle.length),
      isMatch: true,
    });
    cursor = found + needle.length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }
  return segments;
}

/** Resumo em texto do resultado da busca, usado como título da seção. */
export function describeSearchResults(
  count: number,
  categoryCount: number,
): string {
  if (count === 0) return "Nenhuma ocorrência";
  const entries = count === 1 ? "1 ocorrência" : `${count} ocorrências`;
  const where =
    categoryCount === 1 ? "1 categoria" : `${categoryCount} categorias`;
  return `${entries} em ${where}`;
}
