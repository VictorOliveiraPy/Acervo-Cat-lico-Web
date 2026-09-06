/**
 * Agrupamento editorial das 45 categorias, para a navegação não virar uma
 * lista só de 45 itens (ver discussão com o usuário sobre usabilidade do
 * header/footer).
 *
 * É uma escolha de assunto, não a ordem de `CATEGORY_SLUGS` (que é a ordem
 * de curadoria/aparição no site) — um grupo pode misturar categoria antiga
 * e nova livremente. Cada slug aparece em exatamente um grupo; o teste
 * `categoryGroups.test.ts`-equivalente disso é a soma bater com
 * `CATEGORY_SLUGS.length` (checado também em tempo de execução abaixo).
 */

import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/schemas";

export type CategoryGroup = {
  title: string;
  slugs: readonly CategorySlug[];
};

export const CATEGORY_GROUPS: readonly CategoryGroup[] = [
  {
    title: "Jesus, Maria e a Bíblia",
    slugs: [
      "jesus-cristo",
      "nossa-senhora",
      "biblia",
      "personagens-biblicos",
      "parabolas",
      "milagres-de-jesus",
      "terra-santa",
      "milagres-eucaristicos",
    ],
  },
  {
    title: "Santos e Santidade",
    slugs: [
      "santos",
      "papas",
      "doutores-igreja",
      "padres-da-igreja",
      "beatos-canonizacao",
      "ordens-religiosas",
    ],
  },
  {
    title: "Doutrina e Moral",
    slugs: [
      "catecismo",
      "sacramentos",
      "mandamentos",
      "virtudes",
      "pecados",
      "doutrina-social",
      "direito-canonico",
      "apologetica",
      "estrutura-igreja",
    ],
  },
  {
    title: "Liturgia e Oração",
    slugs: [
      "liturgia",
      "liturgia-das-horas",
      "calendario-liturgico",
      "oracoes",
      "devocoes",
      "sacramentais",
      "musica-sacra",
      "arte-sacra-simbolos",
      "ritos-orientais",
    ],
  },
  {
    title: "História da Igreja",
    slugs: ["historia", "concilios", "documentos-magisterio", "igreja-brasil", "heresias-cismas"],
  },
  {
    title: "Vocação e Vida Cristã",
    slugs: [
      "crisma",
      "primeira-comunhao",
      "vocacoes-estados-de-vida",
      "anjos-demonios",
      "novissimos",
      "santuarios",
    ],
  },
  {
    title: "Referência",
    slugs: ["glossario", "livros"],
  },
] as const;

/**
 * Categorias de acesso direto no header — as mais buscadas/clássicas do
 * acervo. As demais ficam a um clique, no painel "Todas as categorias".
 */
export const PRIMARY_CATEGORY_SLUGS: readonly CategorySlug[] = [
  "santos",
  "papas",
  "biblia",
  "catecismo",
  "jesus-cristo",
  "oracoes",
  "nossa-senhora",
];

if (process.env.NODE_ENV !== "production") {
  const grouped = CATEGORY_GROUPS.flatMap((group) => group.slugs);
  const missing = CATEGORY_SLUGS.filter((slug) => !grouped.includes(slug));
  const duplicated = grouped.filter((slug, index) => grouped.indexOf(slug) !== index);
  if (missing.length > 0) {
    throw new Error(`CATEGORY_GROUPS não cobre: ${missing.join(", ")}`);
  }
  if (duplicated.length > 0) {
    throw new Error(`CATEGORY_GROUPS repete: ${duplicated.join(", ")}`);
  }
}
