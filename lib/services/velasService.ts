/**
 * Serviço de domínio do mural de velas — mesma forma de `acervoService.ts`,
 * mas contra `/api/velas`, a única rota de escrita do site.
 */

import { apiGet, apiPost } from "@/lib/api";
import {
  velaPageSchema,
  velaSchema,
  type Vela,
  type VelaPage,
  type VelaTipo,
} from "@/lib/velasSchemas";

/** Itens por página no mural (mesmo tamanho das listagens do acervo). */
export const VELAS_PAGE_SIZE = 12;

/** Página do mural, mais recentes primeiro — nunca cacheada: é conteúdo vivo. */
export function fetchVelas({
  limit = VELAS_PAGE_SIZE,
  offset = 0,
}: { limit?: number; offset?: number } = {}): Promise<VelaPage> {
  return apiGet("/velas", velaPageSchema, {
    query: { limit, offset },
    revalidateSeconds: 0,
  });
}

export type AcenderVelaInput = {
  nome: string;
  intencao?: string;
  tipo: VelaTipo;
};

/** Acende uma vela — a única mutação do site. */
export function acenderVela(input: AcenderVelaInput): Promise<Vela> {
  const intencao = input.intencao?.trim();
  return apiPost(
    "/velas",
    {
      nome: input.nome.trim(),
      intencao: intencao ? intencao : null,
      tipo: input.tipo,
    },
    velaSchema,
  );
}
