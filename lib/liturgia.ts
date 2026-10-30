/**
 * Formatação da liturgia diária — mesmo espírito de `lib/velas.ts`: o dado
 * cru vem da API, a apresentação mora aqui.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const BRAZIL_OFFSET_MS = 3 * 60 * 60 * 1000;
/** Janela publicada: a API tem os próximos 7 dias; o passado evita URLs sem fim. */
const DAYS_AHEAD = 7;
const DAYS_BEHIND = 61;

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

function toUtc(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number) as [number, number, number];
  return Date.UTC(year, month - 1, day);
}

function fromUtc(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

/** Hoje em Brasília (UTC-3, sem horário de verão desde 2019), como `AAAA-MM-DD`. */
export function todayInBrazil(now: Date = new Date()): string {
  return fromUtc(now.getTime() - BRAZIL_OFFSET_MS);
}

/** "30 de outubro de 2026". */
export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number) as [number, number, number];
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

/** Só data real dentro da janela vira página; o resto é 404. */
export function isServedLiturgyDate(iso: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const time = toUtc(iso);
  if (fromUtc(time) !== iso) return false;
  const distance = (time - toUtc(today)) / DAY_MS;
  return distance >= -DAYS_BEHIND && distance <= DAYS_AHEAD;
}

export function neighborLiturgyDates(
  iso: string,
  today: string,
): { previous: string | null; next: string | null } {
  const time = toUtc(iso);
  const previous = fromUtc(time - DAY_MS);
  const next = fromUtc(time + DAY_MS);
  return {
    previous: isServedLiturgyDate(previous, today) ? previous : null,
    next: isServedLiturgyDate(next, today) ? next : null,
  };
}

/** Data por extenso em português, ex.: "terça-feira, 8 de setembro de 2026". */
export function formatLiturgiaDate(isoDate: string): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
  // Intl devolve "terça-feira, 8 de setembro de 2026" com o dia da semana em
  // minúsculo — capitaliza só a primeira letra, sem mexer no resto.
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Hex aproximado de cada cor litúrgica, para um filete decorativo — não é
 * dado do backend (que só manda o nome em português), é leitura editorial
 * fixa das cores do rito romano.
 */
const LITURGICAL_COLOR_HEX: Record<string, string> = {
  branco: "#D9CBA3",
  dourado: "#B8912F",
  vermelho: "#6B1F2A",
  verde: "#4B6B45",
  roxo: "#4A2545",
  rosa: "#C98A9C",
  preto: "#241B22",
};

/** `null` quando a cor não é uma das do rito romano (dado inesperado da fonte). */
export function liturgicalColorHex(cor: string | null): string | null {
  if (!cor) return null;
  return LITURGICAL_COLOR_HEX[cor.trim().toLowerCase()] ?? null;
}

/** Só o que a celebração escreve; dia de festa própria não diz o tempo e fica sem. */
const LITURGICAL_SEASONS: ReadonlyArray<[RegExp, string]> = [
  [/tempo comum/i, "Tempo Comum"],
  [/advento/i, "Advento"],
  [/quaresma/i, "Quaresma"],
  [/semana santa/i, "Semana Santa"],
  [/p[áa]scoa|tempo pascal/i, "Tempo Pascal"],
  [/\bnatal\b/i, "Tempo do Natal"],
];

export function liturgicalSeason(celebracao: string | null): string | null {
  return LITURGICAL_SEASONS.find(([pattern]) => pattern.test(celebracao ?? ""))?.[1] ?? null;
}
