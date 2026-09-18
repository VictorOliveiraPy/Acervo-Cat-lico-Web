export const READING_SIZES = ["normal", "larger", "largest"] as const;
export type ReadingSize = (typeof READING_SIZES)[number];

const STORAGE_KEY = "compendio:reading-size";

/**
 * Aplica o tamanho de leitura ao documento inteiro (`data-reading-size` na
 * `<html>`, ver `.reading-column` em globals.css) e lembra a escolha — vale
 * pra qualquer verbete que a pessoa abrir depois, não só o atual.
 */
export function applyReadingSize(size: ReadingSize): void {
  if (size === "normal") {
    document.documentElement.removeAttribute("data-reading-size");
  } else {
    document.documentElement.dataset.readingSize = size;
  }
  try {
    localStorage.setItem(STORAGE_KEY, size);
  } catch {
    // Modo privado ou cota cheia — a escolha só não persiste entre visitas.
  }
}

export function readStoredReadingSize(): ReadingSize {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (READING_SIZES as readonly string[]).includes(stored ?? "")
      ? (stored as ReadingSize)
      : "normal";
  } catch {
    return "normal";
  }
}
