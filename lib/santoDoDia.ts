import type { Entry } from "@/lib/schemas";

export type Santo = Extract<Entry, { categoria: "santos" }>;

/**
 * Critério de destaque quando vários santos têm festa no mesmo dia. Quem está
 * nesta lista vem primeiro, na ordem dela; os demais seguem pelo tamanho do verbete.
 * Para fixar um santo, acrescente aqui o slug dele na API.
 */
const SANTOS_PRIORITARIOS: readonly string[] = [];

/** Mesmo que não haja festa no dia, um ano inteiro de busca sempre passa por todas. */
const DAYS_IN_LEAP_YEAR = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const FEAST_DATE = new RegExp(`(\\d{1,2})º? de (${MONTHS.join("|")})`, "g");

/**
 * Datas `MM-DD` do campo `festa`. Vale toda data escrita ali, inclusive a segunda:
 * em "23 de agosto (30 de agosto na América Latina)", a do Brasil é a segunda.
 */
export function feastDates(festa: string | null): string[] {
  return [...(festa ?? "").matchAll(FEAST_DATE)].map(([, day, month]) => {
    const monthNumber = MONTHS.indexOf(month as string) + 1;
    return `${String(monthNumber).padStart(2, "0")}-${(day as string).padStart(2, "0")}`;
  });
}

function addDays(iso: string, days: number): string {
  return new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

function priorityOf(slug: string): number {
  const index = SANTOS_PRIORITARIOS.indexOf(slug);
  return index === -1 ? SANTOS_PRIORITARIOS.length : index;
}

/** Santos com festa na data `AAAA-MM-DD`, do mais ao menos destacado. */
export function saintsOn(saints: readonly Santo[], iso: string): Santo[] {
  const key = iso.slice(5);
  return saints
    .filter((saint) => feastDates(saint.festa).includes(key))
    .sort(
      (a, b) =>
        priorityOf(a.slug) - priorityOf(b.slug) ||
        b.corpo.length - a.corpo.length ||
        a.slug.localeCompare(b.slug),
    );
}

export type SaintOfDay = {
  saint: Santo;
  /** Data da festa: hoje, ou a próxima que houver. */
  date: string;
  isToday: boolean;
  /** Outros santos com festa na mesma data. */
  others: Santo[];
};

/** O santo de hoje ou, sem festa hoje, o da próxima data com festa. */
export function saintOfDay(saints: readonly Santo[], today: string): SaintOfDay | null {
  for (let offset = 0; offset <= DAYS_IN_LEAP_YEAR; offset++) {
    const date = addDays(today, offset);
    const [saint, ...others] = saintsOn(saints, date);
    if (saint) return { saint, date, isToday: offset === 0, others };
  }
  return null;
}

/** Festas dos próximos dias, sem contar hoje; dia sem festa fica de fora. */
export function upcomingFeasts(
  saints: readonly Santo[],
  today: string,
  days = 7,
): { date: string; saints: Santo[] }[] {
  return Array.from({ length: days }, (_, index) => addDays(today, index + 1))
    .map((date) => ({ date, saints: saintsOn(saints, date) }))
    .filter((day) => day.saints.length > 0);
}

/** "4 de outubro". */
export function formatDayMonth(iso: string): string {
  const [, month, day] = iso.split("-").map(Number) as [number, number, number];
  return `${day} de ${MONTHS[month - 1]}`;
}
