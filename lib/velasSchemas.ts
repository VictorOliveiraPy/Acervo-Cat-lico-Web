/**
 * Contrato do mural de velas, espelhando `backend/app/velas_models.py`.
 *
 * Arquivo separado de `schemas.ts` de propósito, no mesmo espírito da
 * separação do backend: o mural é a única escrita persistida do site, e
 * mora à parte do contrato do acervo somente-leitura.
 */

import { z } from "zod";

export const VELA_TIPO_SLUGS = [
  "jesus",
  "nossa_senhora",
  "aparecida",
  "sao_jose",
  "espirito_santo",
  "sao_judas_tadeu",
] as const;

export type VelaTipo = (typeof VELA_TIPO_SLUGS)[number];

export const velaTipoSchema = z.enum(VELA_TIPO_SLUGS);

export const velaSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  intencao: z.string().nullable(),
  tipo: velaTipoSchema,
  criado_em: z.string(),
});

export const velaPageSchema = z.object({
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
  itens: z.array(velaSchema),
});

export type Vela = z.infer<typeof velaSchema>;
export type VelaPage = z.infer<typeof velaPageSchema>;

/** Limites espelhando `VelaCreate` no backend — a validação real é lá. */
export const VELA_NOME_MAX = 60;
export const VELA_INTENCAO_MAX = 280;
