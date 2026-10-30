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
  slug: string;
  name: string;
  avatar: string;
  card: string;
  portrait: string;
  alt: string;
  credit: string;
};

const REVIEWED_SAINTS = [
  ["santa-cecilia", "Santa Cecília", "santa_cecilia"],
  ["sao-joao-maria-vianney", "São João Maria Vianney", "sao_joao_maria_vianney"],
  ["santa-rosa-de-lima", "Santa Rosa de Lima", "santa_rosa_de_lima"],
  ["sao-sebastiao", "São Sebastião", "sao_sebastiao"],
  ["santa-helena", "Santa Helena", "santa_helena"],
  ["sao-luis-gonzaga", "São Luís Gonzaga", "sao_luis_gonzaga"],
  ["sao-patricio", "São Patrício", "sao_patricio"],
] as const;

export const SAINT_ASSETS: readonly SaintAsset[] = REVIEWED_SAINTS.map(
  ([slug, name, file]) => ({
    slug,
    name,
    avatar: `/santos/avatars/${file}.png`,
    card: `/santos/cards/${file}.webp`,
    portrait: `/santos/retratos/${file}.png`,
    alt: `Ilustração editorial de ${name}`,
    credit: "Ilustração devocional do acervo · iconografia revisada visualmente",
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
