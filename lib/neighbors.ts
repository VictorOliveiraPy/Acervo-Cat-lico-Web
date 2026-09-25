/**
 * Entrada anterior e próxima dentro da sequência de uma categoria.
 *
 * Existe para o robô de busca: cada entrada aponta para as vizinhas, então as
 * 1.700 páginas formam uma cadeia rastreável a partir de qualquer uma, em vez de
 * dependerem só do sitemap.
 */

export type Neighbors<T> = { previous: T | null; next: T | null };

export function neighborsOf<T extends { slug: string }>(items: T[], slug: string): Neighbors<T> {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: items[index - 1] ?? null,
    next: items[index + 1] ?? null,
  };
}
