"use client";

import { useEffect, useState } from "react";

import { THEMES, applyTheme, readStoredTheme, type Theme } from "@/lib/theme";

const LABEL: Record<Theme, string> = {
  system: "Auto",
  light: "☀",
  dark: "☾",
};

const DESCRIPTION: Record<Theme, string> = {
  system: "tema automático (segue o sistema)",
  light: "tema claro",
  dark: "tema escuro",
};

/**
 * Alterna o tema da interface entre claro, escuro e automático (SO).
 * O estado persiste em localStorage e é aplicado via `data-theme` na <html>.
 *
 * Colocado junto ao ReadingSizeControl nos verbetes, disponível também no
 * SiteHeader para acesso em qualquer página.
 */
export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Tema da interface">
      {THEMES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => choose(option)}
          aria-pressed={theme === option}
          aria-label={`Tema: ${DESCRIPTION[option]}`}
          className={`rounded-edge border px-2.5 py-1.5 text-label transition-colors ${
            theme === option
              ? "border-accent bg-accent text-surface"
              : "border-border text-ink-muted hover:border-accent hover:text-accent"
          }`}
        >
          {LABEL[option]}
        </button>
      ))}
    </div>
  );
}
