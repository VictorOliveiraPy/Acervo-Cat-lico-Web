import type { CategorySlug } from "@/lib/schemas";

export type CategoryBackground = {
  /** Caminho em `public/`, sempre auto-hospedado (ver `public/img-acervo/`). */
  src: string;
  credito: string;
  /**
   * `object-position` do CSS (ex.: "top", "bottom", "20% 60%"). Padrão
   * "center" quando omitido. Existe porque o banner é bem mais largo que
   * alto — uma foto vertical recortada bem no centro às vezes esconde
   * exatamente o elemento que justificou a escolha da foto.
   */
  objectPosition?: string;
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
  santos: {
    // A ilustração dos 5 santos (usada na lateral da home) é vertical
    // demais (recorte 0,34:1) pra um banner bem mais largo que alto — o
    // `object-cover` precisa ampliar tanto pra cobrir a largura que vira só
    // um rosto irreconhecível. Teto de afresco barroco com vários santos e
    // anjos é genérico o bastante pra representar a categoria (143
    // verbetes, não um santo só) e tem proporção horizontal de verdade.
    src: "/img-acervo/ig-teto-afresco.jpg",
    credito: "Foto: Clay Banks / Unsplash",
  },
  "jesus-cristo": {
    src: "/img-acervo/paixao-e-crucificacao.jpg",
    credito: "Foto: Christina Victoria Craft / Unsplash",
  },
  "nossa-senhora": {
    src: "/img-acervo/ig-nossa-senhora-neblina.jpg",
    credito: "Foto: Haley Phelps / Unsplash",
  },
  oracoes: {
    src: "/img-acervo/ig-terco-biblia.jpg",
    credito: "Foto: Lennon Caranzo / Unsplash",
  },
  liturgia: {
    src: "/img-acervo/ig-missal-velas.jpg",
    credito: "Foto: Grant Whitty / Unsplash",
  },
  sacramentos: {
    src: "/img-acervo/eucaristia-ostensorio.jpg",
    credito: "Foto: Maria Oswalt / Unsplash",
  },
  devocoes: {
    src: "/img-acervo/sagrado-coracao-de-jesus.jpg",
    credito: "Foto: Matea Gregg / Unsplash",
  },
  "arte-sacra-simbolos": {
    // Centralizado (padrão), o recorte pegava só a faixa de texto "DEI" no
    // meio da pintura, cortando o cordeiro — o elemento que dá nome ao
    // símbolo — de fora. Empurrando pra baixo, o cordeiro aparece.
    src: "/img-acervo/ig-agnus-dei.jpg",
    credito: "Foto: Jasmin Staab / Unsplash",
    objectPosition: "center 65%",
  },
  santuarios: {
    src: "/img-acervo/basilica-de-sao-pedro.jpg",
    credito: "Foto: Clay Banks / Unsplash",
  },
  biblia: {
    src: "/img-acervo/ig-versiculo-joao146.jpg",
    credito: "Foto: Tim Wildsmith / Unsplash",
  },
  "milagres-eucaristicos": {
    src: "/img-acervo/ig-monstrancia-sunburst.jpg",
    credito: "Foto: Jacob Bentzinger / Unsplash",
  },
};
