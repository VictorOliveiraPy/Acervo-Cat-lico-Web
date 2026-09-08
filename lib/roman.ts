/**
 * Numeral romano — usado no índice de categorias da home (ver `app/page.tsx`),
 * no lugar do emoji que estava lá antes: emoji colorido de app não combina
 * com a identidade litúrgica do site (bordô/dourado/serifa/latim). Numeral
 * romano por seção também resolve a colisão que uma letra inicial teria
 * (várias seções começam com a mesma letra).
 *
 * Só precisa cobrir até umas dezenas (número de grupos de categoria), não
 * datas de milhares — por isso a tabela para em "M".
 */
const ROMAN_NUMERALS: readonly [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(num: number): string {
  let result = "";
  let remaining = Math.trunc(num);
  for (const [value, numeral] of ROMAN_NUMERALS) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}
