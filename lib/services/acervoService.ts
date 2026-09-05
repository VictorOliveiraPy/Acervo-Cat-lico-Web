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

/** Itens por página nas listagens (o backend limita a 100). */
export const PAGE_SIZE = 12;

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
