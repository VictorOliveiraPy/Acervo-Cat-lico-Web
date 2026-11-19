"use client";

import { useEffect, useState } from "react";

import { applyTheme, nextTheme, readStoredTheme, themeButtonLabel, type Theme } from "@/lib/theme";

/** Meio círculo (segue o sistema), sol (claro) e lua (escuro). */
const ICON: Record<Theme, React.ReactNode> = {
  system: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
};

/**
 * Tema da interface num botão só, que alterna automático → claro → escuro. Cabe no
 * cabeçalho sem espremer a busca. O estado persiste em localStorage e é aplicado via
 * `data-theme` na <html> (ver lib/theme.ts).
 */
export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function cycle() {
    const next = nextTheme(theme);
    setTheme(next);
    applyTheme(next);
  }

  const label = themeButtonLabel(theme);
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICON[theme]}
      </svg>
    </button>
  );
}
