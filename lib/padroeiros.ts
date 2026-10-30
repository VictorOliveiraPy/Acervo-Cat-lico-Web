/**
 * Santos que a pessoa pode escolher como padroeiro. Os `id` são os mesmos que a API
 * aceita em `padroeiro_id`: acrescentar um santo aqui exige acrescentar lá também.
 */
export type PatronAttribute = "cordao" | "estrelas" | "lirio" | "rosas";

export type Patron = {
  id: "francisco" | "maria" | "jose" | "teresinha";
  nome: string;
  /** Versão curta para os botões do seletor. */
  nomeCurto: string;
  festa: string;
  atributo: PatronAttribute;
  cores: { tunica: string; manto?: string; cabelo?: string; veu?: string };
  capuz?: boolean;
  barba?: boolean;
  /** Manto curto, na altura dos ombros, em vez de manto até os pés. */
  capa?: boolean;
};

export type PatronId = Patron["id"];

export const PATRONS: readonly Patron[] = [
  {
    id: "francisco",
    nome: "São Francisco de Assis",
    nomeCurto: "São Francisco de Assis",
    festa: "4 de outubro",
    atributo: "cordao",
    cores: { tunica: "#6E4E36", cabelo: "#3B2A1E" },
    capuz: true,
  },
  {
    id: "maria",
    nome: "Nossa Senhora da Conceição",
    nomeCurto: "N. Sra. da Conceição",
    festa: "8 de dezembro",
    atributo: "estrelas",
    cores: { tunica: "#EEEAE0", manto: "#3E5F95", veu: "#3E5F95" },
  },
  {
    id: "jose",
    nome: "São José",
    nomeCurto: "São José",
    festa: "19 de março",
    atributo: "lirio",
    cores: { tunica: "#6E5A7A", manto: "#B98A3E", cabelo: "#4A3423" },
    barba: true,
  },
  {
    id: "teresinha",
    nome: "Santa Teresinha",
    nomeCurto: "Santa Teresinha",
    festa: "1º de outubro",
    atributo: "rosas",
    cores: { tunica: "#6A4A33", manto: "#EFEBE2", veu: "#26262A" },
    capa: true,
  },
];

export const DEFAULT_PATRON: PatronId = "francisco";

/** Valor desconhecido vindo do banco cai no padrão, em vez de quebrar a página. */
export function patronById(id: string): Patron {
  return (PATRONS.find((patron) => patron.id === id) ?? PATRONS[0]) as Patron;
}

export function isPatronId(value: unknown): value is PatronId {
  return PATRONS.some((patron) => patron.id === value);
}
