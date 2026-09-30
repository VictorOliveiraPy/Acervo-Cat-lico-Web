"use client";

import { usePathname } from "next/navigation";

import { DEFAULT_LOCALE, langFromPathname } from "@/lib/i18n";

/** Renderiza os filhos só nas páginas em português (chatbot e afins ainda não têm tradução). */
export function PtOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return langFromPathname(pathname) === DEFAULT_LOCALE ? <>{children}</> : null;
}
