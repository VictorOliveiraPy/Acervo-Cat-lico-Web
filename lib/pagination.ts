/**
 * Cálculo de paginação das listagens.
 *
 * A API pagina por `limit`/`offset`; a interface fala em "página 2 de 3" e em
 * "13–24 de 31". A conversão entre as duas linguagens é aqui, num único lugar
 * testável, e não espalhada nos componentes de link.
 */

export type PaginationState = {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  previousOffset: number;
  nextOffset: number;
  /** Ex.: "13–24 de 31" — vazio quando não há nenhuma entrada. */
  rangeLabel: string;
};

/** Lê um parâmetro de query numérico, ignorando valor inválido ou negativo. */
export function parseOffset(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/** Deriva o estado de paginação a partir da resposta da API. */
export function computePagination({
  total,
  limit,
  offset,
}: {
  total: number;
  limit: number;
  offset: number;
}): PaginationState {
  const safeLimit = Math.max(limit, 1);
  const safeOffset = Math.max(offset, 0);
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);
  const page = Math.min(Math.floor(safeOffset / safeLimit) + 1, totalPages);
  const firstShown = total === 0 ? 0 : safeOffset + 1;
  const lastShown = Math.min(safeOffset + safeLimit, total);

  return {
    page,
    totalPages,
    hasPrevious: safeOffset > 0,
    hasNext: safeOffset + safeLimit < total,
    previousOffset: Math.max(safeOffset - safeLimit, 0),
    nextOffset: safeOffset + safeLimit,
    rangeLabel: total === 0 ? "" : `${firstShown}\u2013${lastShown} de ${total}`,
  };
}
