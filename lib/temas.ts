/** Tema com menos entradas que isto não é indexado nem entra no sitemap. */
export const THEME_MIN_ENTRIES = 3;

export const THEME_PAGE_SIZE = 50;

/**
 * Descrição opcional de cada tema, por slug. Tema sem texto aqui mostra só a contagem.
 * TODO(responsável): escrever as descrições dos temas principais.
 */
export const THEME_DESCRIPTIONS: Readonly<Record<string, string>> = {};

export function themePath(slug: string, page = 1): string {
  return page > 1 ? `/tema/${slug}/${page}` : `/tema/${slug}`;
}

/** Só `/tema/x/2` em diante: `/tema/x/1` duplicaria a página principal e vira 404. */
export function parseThemePage(segments: readonly string[] | undefined): number | null {
  if (!segments || segments.length === 0) return 1;
  const [value] = segments;
  if (segments.length > 1 || !value || !/^[1-9]\d*$/.test(value) || value === "1") return null;
  return Number(value);
}

/** Agrupa mantendo a ordem: a API já entrega as entradas de cada categoria juntas. */
export function groupByCategory<T extends { categoria: string }>(
  entries: readonly T[],
): { categoria: T["categoria"]; entries: T[] }[] {
  const groups: { categoria: T["categoria"]; entries: T[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.categoria === entry.categoria) last.entries.push(entry);
    else groups.push({ categoria: entry.categoria, entries: [entry] });
  }
  return groups;
}
