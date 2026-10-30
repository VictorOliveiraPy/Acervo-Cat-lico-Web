/**
 * Serviço de domínio da liturgia diária — mesma forma de `acervoService.ts`,
 * mas contra `/api/liturgia-diaria`.
 */

import { apiGet } from "@/lib/api";
import { liturgiaDiariaSchema, type LiturgiaDiaria } from "@/lib/liturgiaSchemas";

/**
 * Liturgia de hoje (ou de `data`, se passada). A API lê do próprio banco, e os 5
 * minutos de cache limitam quanto tempo o dia anterior aparece depois da meia-noite.
 */
export function fetchLiturgiaDiaria(data?: string): Promise<LiturgiaDiaria> {
  return apiGet("/liturgia-diaria", liturgiaDiariaSchema, {
    query: { data },
    revalidateSeconds: 300,
  });
}
