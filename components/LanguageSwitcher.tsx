"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ENABLED_LOCALES,
  LANGUAGE_NAMES,
  dictionaryFor,
  langFromPathname,
  localePath,
  stripLocale,
  type SiteLang,
} from "@/lib/i18n";

/**
 * Seletor de idioma do cabeçalho.
 *
 * Do português para outro idioma vai sempre à home do idioma: só parte do
 * acervo está traduzida, e um link para "a mesma página" cairia em 404 quando
 * a entrada ainda não existe lá. Do idioma traduzido de volta ao português, o
 * caminho é o mesmo — todo conteúdo traduzido nasce de uma entrada em português.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const current = langFromPathname(pathname);
  const t = dictionaryFor(current);

  if (ENABLED_LOCALES.length === 0) return null;

  const targets: SiteLang[] = (["pt", ...ENABLED_LOCALES] as SiteLang[]).filter(
    (lang) => lang !== current,
  );

  function hrefFor(target: SiteLang): string {
    if (target === "pt") return stripLocale(pathname);
    return localePath(target, "/");
  }

  return (
    <nav aria-label={t.languageLabel} className="flex items-center gap-3 text-meta">
      {targets.map((lang) => (
        <Link
          key={lang}
          href={hrefFor(lang)}
          hrefLang={lang === "pt" ? "pt-BR" : lang}
          lang={lang === "pt" ? "pt-BR" : lang}
          className="text-ink-muted underline-offset-4 hover:text-accent hover:underline"
        >
          {LANGUAGE_NAMES[lang]}
        </Link>
      ))}
    </nav>
  );
}
