/**
 * Os tipos de vela que a pessoa pode escolher ao acender.
 *
 * Mesmo padrão de `CATEGORY_LABELS`: o rótulo mora no frontend, não vem da
 * API — o backend só guarda o slug (`TipoVela`) e valida contra ele.
 * Adicionar um tipo aqui sem adicionar no `TipoVela` do backend (ou
 * vice-versa) quebra a escolha na tela ou a gravação; os dois lados têm
 * que mudar juntos.
 *
 * Cada tipo tem sua própria foto de vela (não um retrato do santo — o card
 * continua sendo sobre a vela) — trocado em 2026-09-19 depois de duas
 * rodadas de ajuste: a primeira foto (rack de copos votivos) mal deixava a
 * vela aparecer; a segunda (uma vela só, compartilhada por todas) corrigiu
 * isso mas ainda deixava as 12 opções visualmente idênticas. Boas fotos de
 * "vela inteira" verificadas no Wikimedia Commons são um recurso escasso,
 * então 7 fotos distintas se repetem entre as 12 devoções por afinidade
 * temática (cor litúrgica, símbolo, tom) — 12 fotos únicas exigiria aceitar
 * material de qualidade/composição bem inferior às já aprovadas.
 */

import type { VelaTipo } from "@/lib/velasSchemas";

export type VelaTipoInfo = {
  tipo: VelaTipo;
  label: string;
  imagem: string;
  imagemCredito: string;
};

const CIRIO_PASCAL = {
  imagem: "/img-acervo/vela-cirio-pascal.jpg",
  imagemCredito: "Chris Nyborg — Wikimedia Commons, CC BY-SA 3.0",
};
/** Medalhão do Cordeiro de Deus — João Batista é quem o proclama (Jo 1,29). */
const CORDEIRO = {
  imagem: "/img-acervo/vela-cordeiro.jpg",
  imagemCredito: "Acabashi — Wikimedia Commons, CC BY-SA 4.0",
};
/** Monograma Chi-Rho — tom solene, para os dois Doutores/fundadores. */
const CHIRHO = {
  imagem: "/img-acervo/vela-chirho.jpg",
  imagemCredito: "Acabashi — Wikimedia Commons, CC BY-SA 4.0",
};
/** Vermelha — cor litúrgica do Espírito Santo/Pentecostes. */
const VERMELHA = {
  imagem: "/img-acervo/vela-vermelha.jpg",
  imagemCredito: "Donald Olszewski — Wikimedia Commons, CC BY 4.0",
};
/** Tom rosado/malva suave — mariano; combina com as rosas de Santa Terezinha. */
const ROSADA = {
  imagem: "/img-acervo/vela-rosada.jpg",
  imagemCredito: "WillieWax — Wikimedia Commons, CC BY-SA 3.0",
};
/** Branca elegante, com castiçais ao fundo. */
const BRANCA = {
  imagem: "/img-acervo/vela-branca.jpg",
  imagemCredito: "Solaris2006 — Wikimedia Commons, CC BY-SA 3.0",
};
/** Marfim simples — a foto padrão/genérica (também usada no banner da home). */
const MARFIM = {
  imagem: "/img-acervo/vela-acesa.jpg",
  imagemCredito: "Richard W.M. Jones (retoque: Forrestjunky) — Wikimedia Commons, domínio público",
};

export const VELA_TIPOS: readonly VelaTipoInfo[] = [
  { tipo: "jesus", label: "Jesus Cristo", ...CIRIO_PASCAL },
  { tipo: "nossa_senhora", label: "Nossa Senhora", ...ROSADA },
  { tipo: "aparecida", label: "N. Sra. Aparecida", ...BRANCA },
  { tipo: "sao_jose", label: "São José", ...MARFIM },
  { tipo: "espirito_santo", label: "Espírito Santo", ...VERMELHA },
  { tipo: "sao_judas_tadeu", label: "São Judas Tadeu", ...BRANCA },
  { tipo: "carlo_acutis", label: "São Carlo Acutis", ...MARFIM },
  { tipo: "santo_agostinho", label: "Santo Agostinho", ...CHIRHO },
  { tipo: "sao_bento", label: "São Bento", ...CHIRHO },
  { tipo: "santa_terezinha", label: "Santa Terezinha", ...ROSADA },
  { tipo: "santo_antonio", label: "Santo Antônio", ...MARFIM },
  { tipo: "sao_joao_batista", label: "São João Batista", ...CORDEIRO },
] as const;

/** Foto genérica do banner "Acenda uma vela" da home — não é de um tipo específico. */
export const VELA_IMAGEM = MARFIM.imagem;
export const VELA_IMAGEM_CREDITO = MARFIM.imagemCredito;

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
