import type { Entry } from "@/lib/schemas";

/**
 * Imagens do compêndio liberadas para esta primeira etapa da migração.
 *
 * O registro é deliberadamente explícito e indexado por slug: não varre
 * pastas nem deduz nomes a partir de uma prancha. Assim cada santo recebe um
 * único conjunto de arquivos e um lote posterior não consegue sobrescrevê-lo
 * silenciosamente. Entradas marcadas como `revisar` nos manifestos não entram
 * aqui até a revisão editorial humana.
 */
export type SaintAsset = {
  /** Slug do verbete na API, que é o que aparece na URL. */
  slug: string;
  name: string;
  /** Atributos iconográficos conferidos no manifesto, exibidos como texto. */
  attributes: string;
  avatar: string;
  card: string;
  portrait: string;
  alt: string;
  credit: string;
};

export type SaintCatalogEntry = {
  slug: string;
  name: string;
  reviewStatus: "reviewed" | "pending";
  /** Lotes de origem; mais de um lote explicita uma duplicação já resolvida. */
  batches: readonly string[];
};

const PENDING_SAINTS = [
  ["sao-tomas-de-aquino", "São Tomás de Aquino", ["base"]],
  ["sao-francisco-de-assis", "São Francisco de Assis", ["base"]],
  ["santa-teresinha", "Santa Teresinha do Menino Jesus", ["base"]],
  ["sao-bento", "São Bento", ["base"]],
  ["santo-agostinho", "Santo Agostinho", ["base"]],
  ["sao-joao-paulo-ii", "São João Paulo II", ["base"]],
  ["sao-jose", "São José", ["lote-02"]],
  ["sao-pio-de-pietrelcina", "São Pio de Pietrelcina", ["lote-02"]],
  ["santa-teresa-de-avila", "Santa Teresa de Ávila", ["lote-02"]],
  ["santa-catarina-de-siena", "Santa Catarina de Sena", ["lote-02"]],
  ["santa-clara-de-assis", "Santa Clara de Assis", ["lote-02"]],
  ["sao-joao-bosco", "São João Bosco", ["lote-02"]],
  ["santo-inacio-de-loyola", "Santo Inácio de Loyola", ["lote-02"]],
  ["sao-tarcisio", "São Tarcísio", ["lote-02"]],
  ["santa-faustina-kowalska", "Santa Faustina Kowalska", ["lote-02"]],
  ["santa-rita-de-cassia", "Santa Rita de Cássia", ["lote-02"]],
  ["sao-pedro", "São Pedro", ["lote-03", "apostolos-01"]],
  ["sao-paulo", "São Paulo", ["lote-03"]],
  ["santo-antonio-de-padua", "Santo Antônio de Pádua", ["lote-03"]],
  ["sao-domingos-de-gusmao", "São Domingos de Gusmão", ["lote-03"]],
  ["santa-hildegarda-de-bingen", "Santa Hildegarda de Bingen", ["lote-03"]],
  ["santa-edith-stein", "Santa Edith Stein", ["lote-03"]],
  ["sao-maximiliano-kolbe", "São Maximiliano Kolbe", ["lote-03"]],
  ["santa-gianna-beretta-molla", "Santa Gianna Beretta Molla", ["lote-03"]],
  ["sao-carlos-acutis", "São Carlos Acutis", ["lote-03"]],
  ["santa-bernadette-soubirous", "Santa Bernadette Soubirous", ["lote-03"]],
  ["santa-luzia", "Santa Luzia", ["lote-04"]],
  ["santa-maria-madalena", "Santa Maria Madalena", ["lote-04"]],
  ["sao-nicolau", "São Nicolau", ["lote-04"]],
  ["sao-martinho-de-tours", "São Martinho de Tours", ["lote-04"]],
  ["sao-filipe-neri", "São Filipe Néri", ["lote-04"]],
  ["sao-carlos-borromeu", "São Carlos Borromeu", ["lote-04"]],
  ["santa-isabel-da-hungria", "Santa Isabel da Hungria", ["lote-04"]],
  ["sao-joao-da-cruz", "São João da Cruz", ["lote-04"]],
  ["sao-francisco-xavier", "São Francisco Xavier", ["lote-04"]],
  ["santa-brigida-da-suecia", "Santa Brígida da Suécia", ["lote-04"]],
  ["santa-teresa-dos-andes", "Santa Teresa de Jesus dos Andes", ["lote-05"]],
  ["sao-vicente-de-paulo", "São Vicente de Paulo", ["lote-05"]],
  ["santa-isabel-de-portugal", "Santa Isabel de Portugal", ["lote-05"]],
  ["sao-joao-evangelista", "São João Evangelista", ["apostolos-01"]],
  ["sao-tiago-maior", "São Tiago Maior", ["apostolos-01"]],
  ["santo-andre", "Santo André", ["apostolos-01"]],
  ["sao-filipe", "São Filipe", ["apostolos-01"]],
  ["sao-bartolomeu", "São Bartolomeu", ["apostolos-01"]],
  ["sao-tome", "São Tomé", ["apostolos-01"]],
  ["sao-mateus", "São Mateus", ["apostolos-01"]],
  ["sao-tiago-menor", "São Tiago Menor", ["apostolos-01"]],
  ["sao-judas-tadeu", "São Judas Tadeu", ["apostolos-01"]],
] as const;

/**
 * [slug do catálogo, slug do verbete na API, nome, arquivo, atributos].
 *
 * Os dois slugs são diferentes de propósito: o catálogo segue os manifestos do
 * kit (`santa-cecilia`) e a API tem os próprios (`cecilia-de-roma`). Ao liberar
 * um santo pendente, o slug da API precisa ser conferido no acervo: um slug
 * errado não falha, apenas faz a imagem nunca aparecer.
 */
const REVIEWED_SAINTS = [
  ["santa-cecilia", "cecilia-de-roma", "Santa Cecília", "santa_cecilia", "Harpa e palma do martírio"],
  ["sao-joao-maria-vianney", "joao-maria-vianney", "São João Maria Vianney", "sao_joao_maria_vianney", "Veste sacerdotal e crucifixo"],
  ["santa-rosa-de-lima", "rosa-de-lima", "Santa Rosa de Lima", "santa_rosa_de_lima", "Hábito, rosas e lírios"],
  ["sao-sebastiao", "sebastiao-martir", "São Sebastião", "sao_sebastiao", "Flechas do martírio"],
  ["santa-helena", "helena-imperatriz", "Santa Helena", "santa_helena", "Coroa e cruz"],
  ["sao-luis-gonzaga", "luis-gonzaga", "São Luís Gonzaga", "sao_luis_gonzaga", "Veste religiosa, lírios e crucifixo"],
  ["sao-patricio", "patricio-da-irlanda", "São Patrício", "sao_patricio", "Traje episcopal, trevo e báculo"],
] as const;

export const SAINT_CATALOG: readonly SaintCatalogEntry[] = [
  ...PENDING_SAINTS.map(([slug, name, batches]) => ({
    slug,
    name,
    batches,
    reviewStatus: "pending" as const,
  })),
  ...REVIEWED_SAINTS.map(([slug, , name]) => ({
    slug,
    name,
    batches: ["lote-05"],
    reviewStatus: "reviewed" as const,
  })),
];

export const SAINT_ASSETS: readonly SaintAsset[] = REVIEWED_SAINTS.map(
  ([, slug, name, file, attributes]) => ({
    slug,
    name,
    attributes,
    avatar: `/santos/avatars/${file}.png`,
    card: `/santos/cards/${file}.webp`,
    portrait: `/santos/retratos/${file}.webp`,
    alt: `Ilustração editorial de ${name}. ${attributes}.`,
    credit: "Ilustração devocional contemporânea, não retrato histórico · iconografia revisada visualmente",
  }),
);

const ASSET_BY_SLUG = new Map(SAINT_ASSETS.map((asset) => [asset.slug, asset]));

/** Aceita o formato do backend com hífen e o formato dos manifestos com `_`. */
export function normalizeSaintSlug(slug: string): string {
  return slug.trim().toLocaleLowerCase("pt-BR").replaceAll("_", "-");
}

/** Retorna imagem local somente para uma entrada real da categoria Santos. */
export function saintAssetFor(
  entry: Pick<Entry, "categoria" | "slug">,
): SaintAsset | null {
  if (entry.categoria !== "santos") return null;
  return ASSET_BY_SLUG.get(normalizeSaintSlug(entry.slug)) ?? null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Santo em destaque na home: revezamento diário entre os revisados.
 *
 * É "destaque" e não "santo do dia" de propósito: a escolha não segue o
 * calendário litúrgico, e chamá-la assim afirmaria uma festa que não é a de hoje.
 */
export function featuredSaint(now: Date): SaintAsset {
  const day = Math.floor(now.getTime() / DAY_MS);
  return SAINT_ASSETS[day % SAINT_ASSETS.length] as SaintAsset;
}
