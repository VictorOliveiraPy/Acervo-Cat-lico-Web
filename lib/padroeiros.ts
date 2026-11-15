/**
 * Santos que a pessoa pode escolher como padroeiro. Os `id` são os mesmos que a API
 * aceita em `padroeiro_id`: acrescentar um santo aqui exige acrescentar lá também.
 */
export type PatronAttribute = "cordao" | "estrelas" | "lirio";

type PatronBase = {
  id:
    | "francisco"
    | "maria"
    | "jose"
    | "teresinha"
    | "antonio"
    | "pedro"
    | "bento"
    | "miguel"
    | "carlo"
    | "cecilia";
  nome: string;
  /** Versão curta para os botões do seletor. */
  nomeCurto: string;
  festa: string;
  /** `tunica` e `manto` também pintam a bolinha do seletor. */
  cores: { tunica: string; manto?: string; cabelo?: string; veu?: string };
};

/** Ou o santo tem modelo `.glb` próprio, ou é montado com primitivas: nunca os dois. */
export type Patron = PatronBase &
  (
    | { modelo: string }
    | { modelo?: undefined; atributo: PatronAttribute; capuz?: boolean; barba?: boolean }
  );

/** Modelos vindos do Santo Guardião, com a malha comprimida em Draco. */
function modelo(id: PatronBase["id"]): string {
  return `/modelos/${id}.glb`;
}

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
    nome: "Santa Teresinha do Menino Jesus",
    nomeCurto: "Santa Teresinha",
    festa: "1º de outubro",
    cores: { tunica: "#6A4A33", manto: "#EFEBE2" },
    modelo: modelo("teresinha"),
  },
  {
    id: "antonio",
    nome: "Santo Antônio de Pádua",
    nomeCurto: "Santo Antônio",
    festa: "13 de junho",
    cores: { tunica: "#8B4513" },
    modelo: modelo("antonio"),
  },
  {
    id: "pedro",
    nome: "São Pedro Apóstolo",
    nomeCurto: "São Pedro",
    festa: "29 de junho",
    cores: { tunica: "#1E40AF", manto: "#C9A227" },
    modelo: modelo("pedro"),
  },
  {
    id: "bento",
    nome: "São Bento de Núrsia",
    nomeCurto: "São Bento",
    festa: "11 de julho",
    cores: { tunica: "#1F2937" },
    modelo: modelo("bento"),
  },
  {
    id: "miguel",
    nome: "São Miguel Arcanjo",
    nomeCurto: "São Miguel",
    festa: "29 de setembro",
    cores: { tunica: "#7C3AED", manto: "#60A5FA" },
    modelo: modelo("miguel"),
  },
  {
    id: "carlo",
    nome: "São Carlo Acutis",
    nomeCurto: "São Carlo Acutis",
    festa: "12 de outubro",
    cores: { tunica: "#3B82F6", manto: "#F59E0B" },
    modelo: modelo("carlo"),
  },
  {
    id: "cecilia",
    nome: "Santa Cecília",
    nomeCurto: "Santa Cecília",
    festa: "22 de novembro",
    cores: { tunica: "#A855F7", manto: "#E879F9" },
    modelo: modelo("cecilia"),
  },
];


/** Valor desconhecido vindo do banco cai no padrão, em vez de quebrar a página. */
export function patronById(id: string): Patron {
  return (PATRONS.find((patron) => patron.id === id) ?? PATRONS[0]) as Patron;
}

export function isPatronId(value: unknown): value is PatronId {
  return PATRONS.some((patron) => patron.id === value);
}
