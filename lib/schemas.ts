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
  "pecados",
  "liturgia",
  "sacramentos",
  "virtudes",
  "mandamentos",
  "biblia",
  "devocoes",
  "glossario",
  "calendario-liturgico",
  "novissimos",
  "ordens-religiosas",
  "estrutura-igreja",
  "santuarios",
  "documentos-magisterio",
  "beatos-canonizacao",
  "igreja-brasil",
  "sacramentais",
  "apologetica",
  "jesus-cristo",
  "personagens-biblicos",
  "parabolas",
  "milagres-de-jesus",
  "terra-santa",
  "padres-da-igreja",
  "heresias-cismas",
  "anjos-demonios",
  "doutrina-social",
  "liturgia-das-horas",
  "ritos-orientais",
  "arte-sacra-simbolos",
  "direito-canonico",
  "vocacoes-estados-de-vida",
  "primeira-comunhao",
  "musica-sacra",
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

const pecadoSchema = baseEntrySchema.extend({
  categoria: z.literal("pecados"),
  ordem: z.number().int().nullable().default(null),
  virtude_oposta: z.string().nullable().default(null),
});

const liturgiaSchema = baseEntrySchema.extend({
  categoria: z.literal("liturgia"),
  ordem: z.number().int().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const sacramentoSchema = baseEntrySchema.extend({
  categoria: z.literal("sacramentos"),
  ordem: z.number().int().nullable().default(null),
  materia: z.string().nullable().default(null),
  forma: z.string().nullable().default(null),
  ministro: z.string().nullable().default(null),
  efeitos: z.string().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const virtudeSchema = baseEntrySchema.extend({
  categoria: z.literal("virtudes"),
  tipo: z.enum([
    "teologal",
    "cardeal",
    "dom_espirito_santo",
    "fruto_espirito_santo",
    "bem_aventuranca",
    "obra_misericordia_corporal",
    "obra_misericordia_espiritual",
  ]),
  ordem: z.number().int().nullable().default(null),
  referencia_biblica: z.string().nullable().default(null),
});

const mandamentoSchema = baseEntrySchema.extend({
  categoria: z.literal("mandamentos"),
  tipo: z.enum(["decalogo", "igreja"]),
  ordem: z.number().int().nullable().default(null),
  referencia_biblica: z.string().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const livroBibliaSchema = baseEntrySchema.extend({
  categoria: z.literal("biblia"),
  ordem: z.number().int().nullable().default(null),
  testamento: z.enum(["antigo", "novo"]),
  genero_literario: z.string().nullable().default(null),
  autor_tradicional: z.string().nullable().default(null),
  data_composicao: z.string().nullable().default(null),
  deuterocanonico: z.boolean().default(false),
});

const devocaoSchema = baseEntrySchema.extend({
  categoria: z.literal("devocoes"),
  ordem: z.number().int().nullable().default(null),
  origem: z.string().nullable().default(null),
});

const termoGlossarioSchema = baseEntrySchema.extend({
  categoria: z.literal("glossario"),
});

const tempoLiturgicoSchema = baseEntrySchema.extend({
  categoria: z.literal("calendario-liturgico"),
  ordem: z.number().int().nullable().default(null),
  cor_liturgica: z.string().nullable().default(null),
});

const novissimoSchema = baseEntrySchema.extend({
  categoria: z.literal("novissimos"),
  ordem: z.number().int().nullable().default(null),
});

const ordemReligiosaSchema = baseEntrySchema.extend({
  categoria: z.literal("ordens-religiosas"),
  fundador: z.string().nullable().default(null),
  ano_fundacao: z.string().nullable().default(null),
  carisma: z.string().nullable().default(null),
});

const elementoEstruturalSchema = baseEntrySchema.extend({
  categoria: z.literal("estrutura-igreja"),
  ordem: z.number().int().nullable().default(null),
});

const santuarioSchema = baseEntrySchema.extend({
  categoria: z.literal("santuarios"),
  local: z.string().nullable().default(null),
  pais: z.string().nullable().default(null),
  ano: z.string().nullable().default(null),
});

const documentoMagisterioSchema = baseEntrySchema.extend({
  categoria: z.literal("documentos-magisterio"),
  tipo_documento: z.string().nullable().default(null),
  papa_autor: z.string().nullable().default(null),
  ano: z.string().nullable().default(null),
});

const processoCanonizacaoSchema = baseEntrySchema.extend({
  categoria: z.literal("beatos-canonizacao"),
  ordem: z.number().int().nullable().default(null),
});

const igrejaBrasilSchema = baseEntrySchema.extend({
  categoria: z.literal("igreja-brasil"),
  ordem: z.number().int().nullable().default(null),
});

const sacramentalSchema = baseEntrySchema.extend({
  categoria: z.literal("sacramentais"),
  ordem: z.number().int().nullable().default(null),
});

const questaoApologeticaSchema = baseEntrySchema.extend({
  categoria: z.literal("apologetica"),
  objecao: z.string().nullable().default(null),
});

const jesusSchema = baseEntrySchema.extend({
  categoria: z.literal("jesus-cristo"),
  tipo: z.enum(["misterio_vida", "titulo", "dogma_cristologico"]),
  ordem: z.number().int().nullable().default(null),
  referencia_biblica: z.string().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const personagemBiblicoSchema = baseEntrySchema.extend({
  categoria: z.literal("personagens-biblicos"),
  tipo: z.enum(["patriarca", "profeta", "rei", "apostolo", "mulher", "outro"]),
  testamento: z.enum(["antigo", "novo"]),
  referencia_biblica: z.string().nullable().default(null),
});

const parabolaSchema = baseEntrySchema.extend({
  categoria: z.literal("parabolas"),
  referencia_biblica: z.string().nullable().default(null),
  evangelistas: z.array(z.string()).default([]),
});

const milagreDeJesusSchema = baseEntrySchema.extend({
  categoria: z.literal("milagres-de-jesus"),
  tipo: z.enum(["cura", "exorcismo", "natureza", "ressureicao"]),
  referencia_biblica: z.string().nullable().default(null),
});

const localSagradoSchema = baseEntrySchema.extend({
  categoria: z.literal("terra-santa"),
  local: z.string().nullable().default(null),
  pais: z.string().nullable().default(null),
  tipo_local: z.string().nullable().default(null),
});

const padreDaIgrejaSchema = baseEntrySchema.extend({
  categoria: z.literal("padres-da-igreja"),
  regiao: z.string().nullable().default(null),
  seculo: z.string().nullable().default(null),
  e_doutor: z.boolean().default(false),
});

const heresiaCismaSchema = baseEntrySchema.extend({
  categoria: z.literal("heresias-cismas"),
  tipo: z.enum(["heresia", "cisma"]),
  seculo: z.string().nullable().default(null),
  condenacao: z.string().nullable().default(null),
});

const anjoDemonioSchema = baseEntrySchema.extend({
  categoria: z.literal("anjos-demonios"),
  tipo: z.enum(["arcanjo", "coro_angelico", "anjo_da_guarda", "demonio", "conceito"]),
});

const principioDoutrinaSocialSchema = baseEntrySchema.extend({
  categoria: z.literal("doutrina-social"),
  ordem: z.number().int().nullable().default(null),
});

const horaLiturgicaSchema = baseEntrySchema.extend({
  categoria: z.literal("liturgia-das-horas"),
  ordem: z.number().int().nullable().default(null),
});

const ritoOrientalSchema = baseEntrySchema.extend({
  categoria: z.literal("ritos-orientais"),
  familia_liturgica: z.string().nullable().default(null),
  regiao: z.string().nullable().default(null),
});

const simboloSacroSchema = baseEntrySchema.extend({
  categoria: z.literal("arte-sacra-simbolos"),
  ordem: z.number().int().nullable().default(null),
});

const topicoCanonicoSchema = baseEntrySchema.extend({
  categoria: z.literal("direito-canonico"),
  ordem: z.number().int().nullable().default(null),
});

const estadoDeVidaSchema = baseEntrySchema.extend({
  categoria: z.literal("vocacoes-estados-de-vida"),
  ordem: z.number().int().nullable().default(null),
});

const primeiraComunhaoSchema = baseEntrySchema.extend({
  categoria: z.literal("primeira-comunhao"),
  ordem: z.number().int().nullable().default(null),
  paragrafos_ccc: z.array(z.string()).default([]),
});

const obraMusicaSacraSchema = baseEntrySchema.extend({
  categoria: z.literal("musica-sacra"),
  idioma: z.string().nullable().default(null),
  ordem: z.number().int().nullable().default(null),
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
  pecadoSchema,
  liturgiaSchema,
  sacramentoSchema,
  virtudeSchema,
  mandamentoSchema,
  livroBibliaSchema,
  devocaoSchema,
  termoGlossarioSchema,
  tempoLiturgicoSchema,
  novissimoSchema,
  ordemReligiosaSchema,
  elementoEstruturalSchema,
  santuarioSchema,
  documentoMagisterioSchema,
  processoCanonizacaoSchema,
  igrejaBrasilSchema,
  sacramentalSchema,
  questaoApologeticaSchema,
  jesusSchema,
  personagemBiblicoSchema,
  parabolaSchema,
  milagreDeJesusSchema,
  localSagradoSchema,
  padreDaIgrejaSchema,
  heresiaCismaSchema,
  anjoDemonioSchema,
  principioDoutrinaSocialSchema,
  horaLiturgicaSchema,
  ritoOrientalSchema,
  simboloSacroSchema,
  topicoCanonicoSchema,
  estadoDeVidaSchema,
  primeiraComunhaoSchema,
  obraMusicaSacraSchema,
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
