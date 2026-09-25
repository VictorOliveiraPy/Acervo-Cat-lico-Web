/**
 * Serviço de domínio do acervo — uma função por rota real do backend.
 *
 * Cada função conhece o caminho, os parâmetros aceitos e o schema da resposta;
 * as páginas chamam daqui e nunca montam URL de API por conta própria.
 */

import { apiGet, type GetOptions } from "@/lib/api";
import {
  categoryInfoListSchema,
  entryPageSchema,
  entrySchema,
  healthStatusSchema,
  searchResultListSchema,
  type CategoryInfo,
  type CategorySlug,
  type Entry,
  type EntryPage,
  type HealthStatus,
  type SearchResult,
} from "@/lib/schemas";

/**
 * Itens por página nas listagens (o backend limita a 100).
 *
 * 100, o máximo: quase todas as categorias cabem em uma ou duas páginas, então
 * cada entrada fica a um clique da categoria. Com 12 por página, uma entrada
 * no fim de "papas" ficava a 16 cliques e o Google não chegava até ela.
 */
export const PAGE_SIZE = 100;

/**
 * Mínimo de caracteres aceito por `/api/search`.
 *
 * Repetido aqui de propósito: com o mesmo mínimo do backend, um termo curto
 * vira estado "digite mais um pouco" na interface em vez de um 422 na rede.
 */
export const MIN_SEARCH_LENGTH = 2;

/** Teto de resultados devolvidos pela busca (o backend corta em 50). */
export const SEARCH_LIMIT = 50;

/** Categorias com nome, descrição, total de entradas e aviso editorial. */
export function fetchCategories(options?: GetOptions): Promise<CategoryInfo[]> {
  return apiGet("/categories", categoryInfoListSchema, options);
}

/** Página de entradas de uma categoria, na ordem curada pelo acervo. */
export function fetchEntryPage(
  categoria: CategorySlug,
  { limit = PAGE_SIZE, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<EntryPage> {
  return apiGet(`/${categoria}`, entryPageSchema, {
    query: { limit, offset },
  });
}

/** O mínimo de cada entrada que o índice de uma categoria precisa. */
export type CategoryIndexItem = {
  slug: string;
  titulo: string;
  atualizado_em: string | null;
};

/** Teto de itens por página que o backend aceita. */
const INDEX_PAGE_SIZE = 100;

/**
 * Todas as entradas de uma categoria, na ordem curada pelo acervo, só com o que
 * o sitemap e os links de anterior/próximo usam. Pagina até cobrir o total.
 */
export async function fetchCategoryIndex(categoria: CategorySlug): Promise<CategoryIndexItem[]> {
  const items: CategoryIndexItem[] = [];
  let offset = 0;

  while (true) {
    const page = await fetchEntryPage(categoria, { limit: INDEX_PAGE_SIZE, offset });
    items.push(
      ...page.itens.map((entry) => ({
        slug: entry.slug,
        titulo: entry.titulo,
        atualizado_em: entry.atualizado_em,
      })),
    );
    offset += page.itens.length;
    if (page.itens.length === 0 || offset >= page.total) break;
  }

  return items;
}

/** Entrada completa de uma categoria (corpo, campos próprios e fontes). */
export function fetchEntry(
  categoria: CategorySlug,
  slug: string,
): Promise<Entry> {
  return apiGet(`/${categoria}/${encodeURIComponent(slug)}`, entrySchema);
}

/**
 * Busca textual no acervo inteiro (ou restrita a uma categoria).
 *
 * Sem `categoria` a varredura cobre todas as categorias — é o caminho
 * principal do site, e por isso o padrão. Termo curto devolve lista vazia
 * sem ir à rede.
 */
export async function searchAcervo({
  q,
  categoria,
  limit = SEARCH_LIMIT,
}: {
  q: string;
  categoria?: CategorySlug;
  limit?: number;
}): Promise<SearchResult[]> {
  const term = q.trim();
  if (term.length < MIN_SEARCH_LENGTH) return [];

  return apiGet("/search", searchResultListSchema, {
    query: { q: term, categoria, limit },
    // Busca não é cacheada por tempo: o termo já é a chave da URL, e uma
    // janela de revalidação aqui só criaria resultado velho por engano.
    revalidateSeconds: 0,
  });
}

/** Status da API e tamanho do acervo carregado. */
export function fetchHealth(): Promise<HealthStatus> {
  return apiGet("/health", healthStatusSchema, { revalidateSeconds: 30 });
}
