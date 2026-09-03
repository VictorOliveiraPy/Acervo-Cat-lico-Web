/**
 * Contrato de dados do acervo, espelhando `backend/app/models.py`.
 *
 * A união é discriminada por `categoria` igual à do backend: é isso que
 * permite, no detalhe de uma entrada, acessar `entry.festa` ou
 * `entry.ano_inicio` com o TypeScript sabendo que o campo existe naquele caso.
 */

import { z } from "zod";

/** Slugs de categoria na ordem editorial da navegação do site. */
export const CATEGORY_SLUGS = [
  "santos",
  "papas",
  "milagres-eucaristicos",
  "catecismo",
  "crisma",
  "historia",
  "doutores-igreja",
  "concilios",
  "nossa-senhora",
  "livros",
  "oracoes",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const categorySchema = z.enum(CATEGORY_SLUGS);

/** Narrowing de um segmento de URL desconhecido para `CategorySlug`. */
export function isCategorySlug(value: unknown): value is CategorySlug {
  return categorySchema.safeParse(value).success;
}

const baseEntrySchema = z.object({
  id: z.string(),
  slug: z.string(),
  titulo: z.string(),
  resumo: z.string(),
  corpo: z.string(),
  tags: z.array(z.string()).default([]),
  imagem: z.string().nullable().default(null),
  imagem_credito: z.string().nullable().default(null),
  fontes: z.array(z.string()).default([]),
});

const santoSchema = baseEntrySchema.extend({
  categoria: z.literal("santos"),
  festa: z.string().nullable().default(null),
  patronato: z.array(z.string()).default([]),
  nascimento: z.string().nullable().default(null),
  morte: z.string().nullable().default(null),
});

const papaSchema = baseEntrySchema.extend({
  categoria: z.literal("papas"),
  numero_ordem: z.number().int().nullable().default(null),
  pontificado_inicio: z.string().nullable().default(null),
  pontificado_fim: z.string().nullable().default(null),
});

const concilioSchema = baseEntrySchema.extend({
  categoria: z.literal("concilios"),
  numero_ordem: z.number().int().nullable().default(null),
  ano_inicio: z.number().int().nullable().default(null),
  ano_fim: z.number().int().nullable().default(null),
  local: z.string().nullable().default(null),
});

const milagreEucaristicoSchema = baseEntrySchema.extend({
  categoria: z.literal("milagres-eucaristicos"),
  local: z.string().nullable().default(null),
  ano: z.string().nullable().default(null),
});

const catecismoSchema = baseEntrySchema.extend({
  categoria: z.literal("catecismo"),
  ordem: z.number().int().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const crismaSchema = baseEntrySchema.extend({
  categoria: z.literal("crisma"),
  ordem: z.number().int().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const doutorIgrejaSchema = baseEntrySchema.extend({
  categoria: z.literal("doutores-igreja"),
  titulo_honorifico: z.string().nullable().default(null),
  ano_proclamacao: z.number().int().nullable().default(null),
});

const periodoHistoricoSchema = baseEntrySchema.extend({
  categoria: z.literal("historia"),
  periodo: z.string().nullable().default(null),
});

const nossaSenhoraSchema = baseEntrySchema.extend({
  categoria: z.literal("nossa-senhora"),
  tipo: z.enum(["dogma", "aparicao", "titulo"]),
  ano: z.string().nullable().default(null),
  local: z.string().nullable().default(null),
});

const livroSchema = baseEntrySchema.extend({
  categoria: z.literal("livros"),
  autor: z.string().nullable().default(null),
  ano_publicacao: z.string().nullable().default(null),
  genero: z.string().nullable().default(null),
});

const oracaoSchema = baseEntrySchema.extend({
  categoria: z.literal("oracoes"),
  texto: z.string(),
  uso: z.string().nullable().default(null),
  origem: z.string().nullable().default(null),
});

export const entrySchema = z.discriminatedUnion("categoria", [
  santoSchema,
  papaSchema,
  concilioSchema,
  milagreEucaristicoSchema,
  catecismoSchema,
  crismaSchema,
  doutorIgrejaSchema,
  periodoHistoricoSchema,
  nossaSenhoraSchema,
  livroSchema,
  oracaoSchema,
]);

export const categoryInfoSchema = z.object({
  categoria: categorySchema,
  nome: z.string(),
  descricao: z.string(),
  total: z.number().int(),
  aviso: z.string(),
});

export const searchResultSchema = z.object({
  categoria: categorySchema,
  slug: z.string(),
  titulo: z.string(),
  trecho: z.string(),
});

export const entryPageSchema = z.object({
  categoria: categorySchema,
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
  itens: z.array(entrySchema),
});

export const healthStatusSchema = z.object({
  status: z.literal("ok"),
  categorias: z.number().int(),
  total_entradas: z.number().int(),
});

export const categoryInfoListSchema = z.array(categoryInfoSchema);
export const searchResultListSchema = z.array(searchResultSchema);

export type Entry = z.infer<typeof entrySchema>;
export type CategoryInfo = z.infer<typeof categoryInfoSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type EntryPage = z.infer<typeof entryPageSchema>;
export type HealthStatus = z.infer<typeof healthStatusSchema>;

/** Extrai o tipo de entrada de uma categoria específica da união. */
export type EntryOf<C extends CategorySlug> = Extract<Entry, { categoria: C }>;
