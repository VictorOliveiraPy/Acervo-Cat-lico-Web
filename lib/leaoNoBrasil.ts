/**
 * Leão XIV no Brasil (leaonobrasil.com.br): o site irmão que conta quem vai à possível
 * visita do Papa a Goiânia, de 3 a 7 de setembro de 2027. O compêndio convida a
 * confirmar presença lá.
 */

export const SITE_LEAO = "https://leaonobrasil.com.br/";
export const META = 2027;
const CHEGADA = "2027-09-03";
const DIA = 24 * 60 * 60 * 1000;

export function diasAteAVisita(hoje: string): number {
  const dias = (Date.parse(`${CHEGADA}T00:00:00Z`) - Date.parse(`${hoje}T00:00:00Z`)) / DIA;
  return Math.max(0, Math.round(dias));
}

export function somaConfirmacoes(linhas: ReadonlyArray<{ total: number }>): number {
  return linhas.reduce((soma, linha) => soma + linha.total, 0);
}

export function fraseDasConfirmacoes(total: number): string {
  const numero = total.toLocaleString("pt-BR");
  return total === 1 ? `${numero} peregrino já confirmou` : `${numero} peregrinos já confirmaram`;
}

/** Link com a origem marcada, para o site do Leão saber que a visita veio do compêndio. */
export function linkConfirmar(onde: string): string {
  return `${SITE_LEAO}?utm_source=compendio&utm_medium=bloco&utm_campaign=${encodeURIComponent(onde)}`;
}
