/**
 * Formatação da liturgia diária — mesmo espírito de `lib/velas.ts`: o dado
 * cru vem da API, a apresentação mora aqui.
 */

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
