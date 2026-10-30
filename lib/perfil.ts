import { z } from "zod";

import type { Entry } from "@/lib/schemas";

/** Níveis por pontos. Para mudar nomes ou faixas, basta editar esta lista. */
export const LEVELS = [
  { nome: "Catecúmeno", minimo: 0 },
  { nome: "Discípulo", minimo: 50 },
  { nome: "Apóstolo", minimo: 200 },
] as const;

export function levelFor(points: number): {
  nome: string;
  proximo: { nome: string; faltam: number } | null;
} {
  const index = LEVELS.reduce((found, level, i) => (points >= level.minimo ? i : found), 0);
  const next = LEVELS[index + 1];
  return {
    nome: LEVELS[index]?.nome ?? LEVELS[0].nome,
    proximo: next ? { nome: next.nome, faltam: next.minimo - points } : null,
  };
}

export const FAVORITE_KINDS = ["Bíblia", "Catecismo", "Oração", "Santos"] as const;
export const NOTE_TAGS = [
  "Lição",
  "Leitura do dia",
  "Homilia",
  "Oração",
  "Dúvida para o padre",
] as const;

/** Mesmo limite da API; aqui serve para avisar antes de ir à rede. */
export const MAX_TEXT_LENGTH = 2000;
const MAX_REFERENCE_LENGTH = 200;

const longText = z.string().trim().min(1, "Escreva o texto.").max(
  MAX_TEXT_LENGTH,
  `O texto pode ter até ${MAX_TEXT_LENGTH} caracteres.`,
);

export const favoriteInputSchema = z.object({
  tipo: z.enum(FAVORITE_KINDS),
  texto: longText,
  referencia: z.string().trim().max(MAX_REFERENCE_LENGTH).default(""),
  // Só caminho interno: este valor vira um link na página.
  url_origem: z
    .string()
    .regex(/^\/(?:[^/\s\\][^\s\\]{0,298})?$/)
    .nullable()
    .default(null),
});

export const noteInputSchema = z.object({
  categoria: z.enum(NOTE_TAGS),
  texto: longText,
  licao: z
    .string()
    .regex(/^[a-z0-9-]{1,80}$/)
    .nullable()
    .default(null),
});

export type FavoriteInput = z.input<typeof favoriteInputSchema>;
export type NoteInput = z.input<typeof noteInputSchema>;

export const favoriteSchema = z.object({
  id: z.number(),
  tipo: z.string(),
  texto: z.string(),
  referencia: z.string(),
  url_origem: z.string().nullable(),
  criado_em: z.string(),
});

export const noteSchema = z.object({
  id: z.number(),
  categoria: z.string(),
  texto: z.string(),
  licao: z.string().nullable(),
  criado_em: z.string(),
  atualizado_em: z.string(),
});

export type Favorite = z.output<typeof favoriteSchema>;
export type Note = z.output<typeof noteSchema>;

export const PROFILE_TABS = [
  { id: "favoritos", label: "Textos favoritos" },
  { id: "anotacoes", label: "Anotações" },
  { id: "confissao", label: "Preparar confissão" },
] as const;

export type ProfileTabId = (typeof PROFILE_TABS)[number]["id"];

/** Aba do `#hash` da URL; hash desconhecido abre a primeira. */
export function tabFromHash(hash: string): ProfileTabId {
  const id = hash.replace(/^#/, "");
  return PROFILE_TABS.find((tab) => tab.id === id)?.id ?? PROFILE_TABS[0].id;
}

/** Aba seguinte para as teclas de seta, Home e End; `null` para as demais teclas. */
export function tabForKey(current: ProfileTabId, key: string): ProfileTabId | null {
  const index = PROFILE_TABS.findIndex((tab) => tab.id === current);
  const last = PROFILE_TABS.length - 1;
  const target: Record<string, number> = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  };
  const next = target[key];
  return next === undefined ? null : (PROFILE_TABS[next]?.id ?? null);
}

/** Com fuso fixo, o servidor e o navegador escrevem a mesma data. */
export function formatNoteDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Dias de calendário entre duas datas `AAAA-MM-DD`, nunca negativo. */
export function daysBetween(fromIso: string, toIso: string): number {
  const days = (Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY_MS;
  return Math.max(0, Math.round(days));
}

/** Como a pessoa diz ao padre: "hoje", "há 12 dias", "há 3 meses". */
export function formatTimeSince(days: number): string {
  if (days < 1) return "hoje";
  if (days < 60) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  return `há ${Math.round(days / 30)} meses`;
}

/** O que o botão "Guardar texto" guarda de um verbete; `null` onde ele não aparece. */
export function favoriteFromEntry(entry: Entry): {
  tipo: (typeof FAVORITE_KINDS)[number];
  texto: string;
  rotulo: string;
} | null {
  const favorite =
    entry.categoria === "oracoes"
      ? { tipo: "Oração" as const, texto: entry.texto, rotulo: "Guardar esta oração" }
      : entry.categoria === "santos"
        ? { tipo: "Santos" as const, texto: entry.resumo, rotulo: "Guardar este resumo" }
        : null;
  return favorite && favorite.texto.trim() && favorite.texto.length <= MAX_TEXT_LENGTH ? favorite : null;
}
