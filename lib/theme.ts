/**
 * Controle do tema claro/escuro.
 *
 * Segue o mesmo padrão do `readingSize.ts`: `data-theme` na <html> persiste
 * entre páginas no App Router, e um script `beforeInteractive` aplica o valor
 * salvo antes da hidratação para evitar flash de tema errado.
 *
 * Três estados:
 *   "system" — segue o prefers-color-scheme do SO (padrão)
 *   "dark"   — escuro independente do SO
 *   "light"  — claro independente do SO
 */

export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "compendio:theme";

export function applyTheme(theme: Theme): void {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme;
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Modo privado ou cota cheia — a escolha só não persiste entre visitas.
  }
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (THEMES as readonly string[]).includes(stored ?? "")
      ? (stored as Theme)
      : "system";
  } catch {
    return "system";
  }
}
