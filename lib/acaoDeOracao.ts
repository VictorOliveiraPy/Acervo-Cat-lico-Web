import type { VelaTipo } from "@/lib/velasSchemas";

/**
 * O fim de cada verbete leva da leitura à oração: o santo, à intercessão (com a vela
 * dele no mural, quando há); o resto, ao Evangelho do dia.
 */

/** Santos que têm vela própria no mural (`VELA_TIPOS`), pelo slug do verbete. */
const VELA_POR_SANTO: Readonly<Record<string, VelaTipo>> = {
  "sao-jose": "sao_jose",
  "judas-tadeu": "sao_judas_tadeu",
  "carlo-acutis": "carlo_acutis",
  "agostinho-de-hipona": "santo_agostinho",
  "bento-de-nursia": "sao_bento",
  "teresa-de-lisieux": "santa_terezinha",
  "antonio-de-padua": "santo_antonio",
  "joao-batista": "sao_joao_batista",
};

export function velaDoSanto(slug: string): VelaTipo | null {
  return VELA_POR_SANTO[slug] ?? null;
}

export type AcaoDeOracao = {
  /** "São José, rogai por nós." — só para santos. */
  invocacao: string | null;
  texto: string;
  href: string;
  rotulo: string;
};

export function acaoDeOracao(entry: { categoria: string; slug: string; titulo: string }): AcaoDeOracao {
  if (entry.categoria !== "santos") {
    return {
      invocacao: null,
      texto: "Leve o que leu para a oração: o Evangelho de hoje está a um clique.",
      href: "/liturgia-diaria",
      rotulo: "Rezar com o Evangelho de hoje",
    };
  }
  const nome = entry.titulo.replace(/\s*\(.*\)\s*$/, "");
  const vela = velaDoSanto(entry.slug);
  return {
    invocacao: `${nome}, rogai por nós.`,
    texto: `Acenda uma vela pedindo a intercessão de ${nome} e deixe sua intenção no mural.`,
    href: vela ? `/velas?tipo=${vela}#acender` : "/velas#acender",
    rotulo: "Acender uma vela",
  };
}
