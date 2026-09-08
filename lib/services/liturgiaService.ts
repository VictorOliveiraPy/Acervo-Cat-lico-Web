/**
 * Serviço de domínio da liturgia diária — mesma forma de `acervoService.ts`,
 * mas contra `/api/liturgia-diaria`.
 */

import { apiGet } from "@/lib/api";
import { liturgiaDiariaSchema, type LiturgiaDiaria } from "@/lib/liturgiaSchemas";

/**
 * Liturgia de hoje (ou de `data`, se passada) — nunca cacheada pelo Next:
 * o backend já cacheia por dia (ver `liturgia_repository.py`), cachear de
 * novo aqui só arriscaria servir o dia errado depois da virada da meia-noite.
 */
export function fetchLiturgiaDiaria(data?: string): Promise<LiturgiaDiaria> {
  return apiGet("/liturgia-diaria", liturgiaDiariaSchema, {
    query: { data },
    revalidateSeconds: 0,
  });
}
