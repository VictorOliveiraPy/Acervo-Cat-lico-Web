/**
 * Os tipos de vela que a pessoa pode escolher ao acender, com a imagem de
 * cada um.
 *
 * Mesmo padrão de `CATEGORY_LABELS`: o rótulo e a imagem moram no frontend,
 * não vêm da API — o backend só guarda o slug (`TipoVela`) e valida contra
 * ele. Adicionar um tipo aqui sem adicionar no `TipoVela` do backend (ou
 * vice-versa) quebra a escolha na tela ou a gravação; os dois lados têm
 * que mudar juntos.
 */

import type { VelaTipo } from "@/lib/velasSchemas";

export type VelaTipoInfo = {
  tipo: VelaTipo;
  label: string;
  imagem: string;
  imagemCredito: string | null;
};

export const VELA_TIPOS: readonly VelaTipoInfo[] = [
  {
    tipo: "branca",
    label: "Branca",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/9/92/Candle_02.jpg",
    imagemCredito: null,
  },
  {
    tipo: "vermelha",
    label: "Vermelha",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Red_candle_flame.jpg",
    imagemCredito: null,
  },
  {
    tipo: "dourada",
    label: "Dourada",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/6/69/Kerzen_--_2021_--_5553.jpg",
    imagemCredito: "Dietmar Rabich — Wikimedia Commons, CC BY-SA 4.0",
  },
  {
    tipo: "azul",
    label: "Azul",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/7/78/Candle_blue.JPG",
    imagemCredito: null,
  },
  {
    tipo: "roxa",
    label: "Roxa",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/d/df/Candle_shadow.jpg",
    imagemCredito: null,
  },
] as const;

/** Vela pré-selecionada ao abrir o formulário — a primeira da lista acima. */
export const DEFAULT_VELA_TIPO: VelaTipo = "branca";

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
