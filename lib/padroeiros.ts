/**
 * Santos que a pessoa pode escolher como padroeiro. Os `id` são os mesmos que a API
 * aceita em `padroeiro_id`: acrescentar um santo aqui exige acrescentar lá também.
 */
export type Patron = {
  id:
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
  /** Pintam a bolinha do seletor. */
  cores: { tunica: string; manto?: string };
  /** Modelo `.glb` em `public/modelos`: só entram na lista santos com modelo 3D. */
  modelo: string;
};

/** Modelos vindos do Santo Guardião, com a malha comprimida em Draco. */
function modelo(id: Patron["id"]): string {
  return `/modelos/${id}.glb`;
}

export type PatronId = Patron["id"];

export const PATRONS: readonly Patron[] = [
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
