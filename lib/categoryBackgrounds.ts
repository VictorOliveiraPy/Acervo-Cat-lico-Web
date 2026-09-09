import type { CategorySlug } from "@/lib/schemas";

export type CategoryBackground = {
  /** Caminho em `public/`, sempre auto-hospedado (ver `public/img-acervo/`). */
  src: string;
  credito: string;
};

/**
 * Foto de fundo do banner de cada página de categoria (`app/[categoria]/page.tsx`).
 *
 * Mapa parcial de propósito: cobrir as 45 categorias com uma foto à altura
 * (temática certa, sóbria, licença clara) é trabalho de curadoria, não de
 * código — cada categoria nova aqui é uma decisão editorial, não um valor
 * padrão. Categoria sem entrada continua caindo no `PageHeader` de sempre,
 * sem banner.
 */
export const CATEGORY_BACKGROUNDS: Partial<Record<CategorySlug, CategoryBackground>> = {
  papas: {
    src: "/img-acervo/ig-papa-costas.jpg",
    credito: "Foto: Coronel G / Unsplash",
  },
};
