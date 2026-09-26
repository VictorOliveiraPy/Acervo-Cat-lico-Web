/**
 * Elenco dos santos que atravessam a página inicial, cada um segurando uma
 * placa com um tema do acervo (ver `components/SantosCaminhantes.tsx`).
 *
 * São figuras genéricas e estilizadas, não retratos: o desenho sugere o
 * ofício (hábito, mitra, asas) sem pretender ser a imagem de um santo real.
 */

import type { CategorySlug } from "@/lib/schemas";

export type SantoFigura =
  | "francisco"
  | "papa"
  | "anjo"
  | "maria"
  | "bispo"
  | "monge"
  | "peregrino"
  | "evangelista"
  | "santa";

export type SantoCaminhante = {
  figura: SantoFigura;
  /** Categoria para onde a placa leva. */
  categoria: CategorySlug;
  /** Texto curto da placa. */
  placa: string;
};

export const SANTOS_CAMINHANTES: readonly SantoCaminhante[] = [
  { figura: "francisco", categoria: "santos", placa: "Santos" },
  { figura: "papa", categoria: "papas", placa: "Papas" },
  { figura: "anjo", categoria: "anjos-demonios", placa: "Anjos" },
  { figura: "maria", categoria: "nossa-senhora", placa: "Nossa Senhora" },
  { figura: "bispo", categoria: "padres-da-igreja", placa: "Padres da Igreja" },
  { figura: "monge", categoria: "ordens-religiosas", placa: "Ordens religiosas" },
  { figura: "peregrino", categoria: "terra-santa", placa: "Terra Santa" },
  { figura: "evangelista", categoria: "biblia", placa: "Bíblia" },
  { figura: "santa", categoria: "oracoes", placa: "Orações" },
];

/** Quantos santos aparecem ao mesmo tempo na tela. */
export const SANTOS_SIMULTANEOS = 3;

/** Segundos que um santo leva para cruzar a tela. */
export const SEGUNDOS_POR_TRAVESSIA = 36;

/**
 * Ciclo completo de um santo: a travessia mais o tempo fora de cena. Com
 * `SANTOS_SIMULTANEOS` na tela e o elenco todo revezando, o ciclo é a
 * travessia multiplicada pelo tamanho do elenco dividido pelos simultâneos.
 */
export function cicloEmSegundos(total: number = SANTOS_CAMINHANTES.length): number {
  return (SEGUNDOS_POR_TRAVESSIA * total) / SANTOS_SIMULTANEOS;
}

/**
 * Atraso (negativo, para já começar com gente na tela) do santo de índice
 * `indice`: escalonados de uma travessia dividida pelos simultâneos.
 */
export function atrasoEmSegundos(indice: number): number {
  return -(indice * SEGUNDOS_POR_TRAVESSIA) / SANTOS_SIMULTANEOS;
}
