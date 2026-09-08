/**
 * Contrato da liturgia diária, espelhando `backend/app/liturgia_models.py`.
 *
 * Arquivo separado de `schemas.ts` de propósito, mesmo espírito de
 * `velasSchemas.ts`: não é conteúdo do acervo (curado, versionado em JSON),
 * é conteúdo vivo que muda todo dia.
 */

import { z } from "zod";

export const leituraLiturgicaSchema = z.object({
  referencia: z.string(),
  texto: z.string(),
});

export const liturgiaDiariaSchema = z.object({
  data: z.string(),
  cor_liturgica: z.string().nullable(),
  celebracao: z.string().nullable(),
  primeira_leitura: leituraLiturgicaSchema,
  salmo: leituraLiturgicaSchema,
  segunda_leitura: leituraLiturgicaSchema.nullable(),
  evangelho: leituraLiturgicaSchema,
  fonte: z.string(),
});

export type LeituraLiturgica = z.infer<typeof leituraLiturgicaSchema>;
export type LiturgiaDiaria = z.infer<typeof liturgiaDiariaSchema>;
