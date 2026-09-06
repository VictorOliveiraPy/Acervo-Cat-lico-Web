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
  cidade?: string;
  estado?: string;
  /** Contato privado — nunca volta em `Vela` (ver `velaSchema`). */
  email?: string;
};

/** `undefined`/`""` viram `null`: o backend trata string vazia como ausente
 * (`_clean_text`), mas por que depender disso se dá pra já mandar certo. */
function blankToNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Acende uma vela — a única mutação do site. */
export function acenderVela(input: AcenderVelaInput): Promise<Vela> {
  return apiPost(
    "/velas",
    {
      nome: input.nome.trim(),
      intencao: blankToNull(input.intencao),
      tipo: input.tipo,
      cidade: blankToNull(input.cidade),
      estado: blankToNull(input.estado),
      email: blankToNull(input.email),
    },
    velaSchema,
  );
}
