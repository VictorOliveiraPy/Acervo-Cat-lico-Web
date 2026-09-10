/**
 * Os tipos de vela que a pessoa pode escolher ao acender.
 *
 * Mesmo padrão de `CATEGORY_LABELS`: o rótulo mora no frontend, não vem da
 * API — o backend só guarda o slug (`TipoVela`) e valida contra ele.
 * Adicionar um tipo aqui sem adicionar no `TipoVela` do backend (ou
 * vice-versa) quebra a escolha na tela ou a gravação; os dois lados têm
 * que mudar juntos.
 *
 * Antes cada tipo tinha sua própria foto do santo/devoção — mas o card de
 * uma vela acesa é sobre a vela, não sobre um retrato; agora todos usam a
 * mesma foto de vela votiva (`VELA_IMAGEM`), e o rótulo (`label`) é quem
 * diz por quem é a intenção.
 */

import type { VelaTipo } from "@/lib/velasSchemas";

export type VelaTipoInfo = {
  tipo: VelaTipo;
  label: string;
};

export const VELA_TIPOS: readonly VelaTipoInfo[] = [
  { tipo: "jesus", label: "Jesus Cristo" },
  { tipo: "nossa_senhora", label: "Nossa Senhora" },
  { tipo: "aparecida", label: "N. Sra. Aparecida" },
  { tipo: "sao_jose", label: "São José" },
  { tipo: "espirito_santo", label: "Espírito Santo" },
  { tipo: "sao_judas_tadeu", label: "São Judas Tadeu" },
  { tipo: "carlo_acutis", label: "São Carlo Acutis" },
  { tipo: "santo_agostinho", label: "Santo Agostinho" },
  { tipo: "sao_bento", label: "São Bento" },
  { tipo: "santa_terezinha", label: "Santa Terezinha" },
  { tipo: "santo_antonio", label: "Santo Antônio" },
  { tipo: "sao_joao_batista", label: "São João Batista" },
] as const;

/** Foto compartilhada por toda vela — rack de velas votivas acesas. */
export const VELA_IMAGEM = "/img-acervo/vela-votiva.jpg";
export const VELA_IMAGEM_CREDITO = "Zarn02 — Wikimedia Commons, CC BY-SA 3.0";

/** Vela pré-selecionada ao abrir o formulário — a primeira da lista acima. */
export const DEFAULT_VELA_TIPO: VelaTipo = "jesus";

export function velaTipoInfo(tipo: VelaTipo): VelaTipoInfo {
  const found = VELA_TIPOS.find((item) => item.tipo === tipo);
  // Nunca deveria faltar: `tipo` já veio validado pelo schema Zod contra o
  // mesmo enum que gera este array. Se faltar, é os dois lados fora de sync.
  if (!found) throw new Error(`Tipo de vela desconhecido: ${tipo}`);
  return found;
}

/** Data de uma vela em formato curto brasileiro, ex.: "6 de set. de 2026". */
export function formatVelaDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** "Cidade, Estado", só "Cidade" ou só "Estado" — o que a pessoa preencheu. */
export function formatVelaLocation(
  cidade: string | null,
  estado: string | null,
): string | null {
  return [cidade, estado].filter(Boolean).join(", ") || null;
}
