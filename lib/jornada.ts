/**
 * O que a página /jornada promete a quem ainda não tem conta. Os números espelham
 * `app/domain/profiles/progression.py` da API (títulos, estágios de luz do santo e
 * multiplicadores da sequência): o teste ao lado trava os dois juntos.
 */

/** Nível a partir do qual vale cada título. */
const TITULOS: ReadonlyArray<readonly [number, string]> = [
  [1, "Peregrino Iniciante"],
  [5, "Devoto Fiel"],
  [10, "Servo Dedicado"],
  [15, "Discípulo da Luz"],
  [20, "Guardião da Fé"],
  [25, "Portador da Esperança"],
  [30, "Mensageiro Celestial"],
  [35, "Arauto da Paz"],
  [40, "Cavaleiro da Virtude"],
  [45, "Paladino Sagrado"],
  [50, "Mestre Espiritual"],
  [60, "Profeta da Luz"],
  [70, "Serafim Terreno"],
  [80, "Querubim Iluminado"],
  [90, "Arcanjo Guardião"],
  [100, "Santo Glorificado"],
];

export const TODOS_OS_TITULOS = TITULOS.map(([nivel, titulo]) => ({ nivel, titulo }));

export function tituloDoNivel(nivel: number): string {
  return [...TITULOS].reverse().find(([inicio]) => nivel >= inicio)?.[1] ?? "Peregrino Iniciante";
}

/** Estágio de luz do santo: 1 até o nível 10, 2 até 25, 3 até 50, 4 depois. */
export function estagioDoNivel(nivel: number): number {
  if (nivel >= 51) return 4;
  if (nivel >= 26) return 3;
  if (nivel >= 11) return 2;
  return 1;
}

/** Um nível de cada estágio, para a demonstração do santo acendendo. */
export const DEGRAUS = [1, 11, 26, 51].map((nivel) => ({
  nivel,
  titulo: tituloDoNivel(nivel),
  estagio: estagioDoNivel(nivel),
}));

export const MULTIPLICADORES = [
  { dias: 7, vezes: "×1,5" },
  { dias: 30, vezes: "×2" },
  { dias: 100, vezes: "×3" },
] as const;
