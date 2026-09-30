/**
 * Idiomas do site e textos fixos da interface traduzida.
 *
 * O português é o idioma canônico e vive na raiz (`/santos`), sem prefixo —
 * as URLs já indexadas não mudam. `es` e `en` vivem sob `/es/...` e `/en/...`
 * e leem o conteúdo de `/api/i18n/{lang}/...` (só o que já foi traduzido).
 *
 * Sem biblioteca externa: são poucas dezenas de textos fixos, e um
 * dicionário tipado dá erro de compilação se um idioma esquecer uma chave.
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = "pt" as const;
export type SiteLang = Locale | typeof DEFAULT_LOCALE;

/**
 * Idiomas que já têm conteúdo na API (`SUPPORTED_LANGUAGES` do backend) e por
 * isso aparecem no seletor. `en` já roteia mas só entra aqui quando a API o
 * aceitar — senão o seletor levaria a uma página 404.
 */
export const ENABLED_LOCALES: readonly Locale[] = ["es"];

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

/** Idioma de uma URL do navegador (`/es/oracoes` → `es`, `/santos` → `pt`). */
export function langFromPathname(pathname: string): SiteLang {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Prefixa o caminho com o idioma; português não leva prefixo. */
export function localePath(lang: SiteLang, path: string): string {
  if (lang === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Tira o prefixo de idioma de um caminho (`/es/oracoes` → `/oracoes`). */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  return `/${segments.join("/")}`;
}

/** Código BCP 47 para `<html lang>`, `hreflang` e `inLanguage`. */
export const HREFLANG: Record<SiteLang, string> = {
  pt: "pt-BR",
  es: "es",
  en: "en",
};

/** `og:locale` de cada idioma. */
export const OG_LOCALE: Record<SiteLang, string> = {
  pt: "pt_BR",
  es: "es_ES",
  en: "en_US",
};

export const LANGUAGE_NAMES: Record<SiteLang, string> = {
  pt: "Português",
  es: "Español",
  en: "English",
};

export type Dictionary = {
  siteTagline: string;
  siteDescription: string;
  home: string;
  skipToContent: string;
  languageLabel: string;
  breadcrumbHome: string;
  homeHeading: string;
  homeLead: string;
  categoriesHeading: string;
  entryCount: (total: number) => string;
  emptyPage: string;
  loadError: string;
  reloadHint: string;
  aboutPrayer: string;
  textSize: string;
  relatedTopics: string;
  sources: string;
  previous: string;
  next: string;
  neighborsLabel: string;
  keepReading: string;
  allEntriesOf: (category: string) => string;
  translationNote: string;
  originalInPortuguese: string;
};

export const DICTIONARY: Record<SiteLang, Dictionary> = {
  pt: {
    siteTagline: "Catálogo de consulta · fé, doutrina e vida católica",
    siteDescription:
      "Consulta rápida sobre o mundo católico: santos, papas, Catecismo, sacramentos, milagres, história da Igreja, orações e mais de 40 temas.",
    home: "Início",
    skipToContent: "Ir para o conteúdo",
    languageLabel: "Idioma",
    breadcrumbHome: "Acervo",
    homeHeading: "Compêndio Católico",
    homeLead: "Consulta rápida sobre o mundo católico.",
    categoriesHeading: "Categorias",
    entryCount: (n) => `${n} ${n === 1 ? "entrada" : "entradas"}`,
    emptyPage: "Nenhuma entrada nesta página.",
    loadError: "Não foi possível carregar o conteúdo.",
    reloadHint: "Recarregue a página em alguns instantes.",
    aboutPrayer: "Sobre esta oração",
    textSize: "Tamanho do texto",
    relatedTopics: "Temas relacionados",
    sources: "Fontes",
    previous: "← Anterior",
    next: "Próxima →",
    neighborsLabel: "Entradas vizinhas",
    keepReading: "Continue sua leitura",
    allEntriesOf: (c) => `← Todas as entradas de ${c}`,
    translationNote: "",
    originalInPortuguese: "Ler no original em português",
  },
  es: {
    siteTagline: "Catálogo de consulta · fe, doctrina y vida católica",
    siteDescription:
      "Consulta rápida sobre el mundo católico: santos, papas, Catecismo, sacramentos, milagros, historia de la Iglesia, oraciones y más de 40 temas.",
    home: "Inicio",
    skipToContent: "Ir al contenido",
    languageLabel: "Idioma",
    breadcrumbHome: "Archivo",
    homeHeading: "Compendio Católico",
    homeLead:
      "Consulta rápida sobre el mundo católico. El contenido se está traduciendo por etapas.",
    categoriesHeading: "Categorías",
    entryCount: (n) => `${n} ${n === 1 ? "entrada" : "entradas"}`,
    emptyPage: "No hay entradas en esta página.",
    loadError: "No se pudo cargar el contenido.",
    reloadHint: "Vuelve a cargar la página en unos instantes.",
    aboutPrayer: "Sobre esta oración",
    textSize: "Tamaño del texto",
    relatedTopics: "Temas relacionados",
    sources: "Fuentes",
    previous: "← Anterior",
    next: "Siguiente →",
    neighborsLabel: "Entradas vecinas",
    keepReading: "Sigue leyendo",
    allEntriesOf: (c) => `← Todas las entradas de ${c}`,
    translationNote: "Traducción del original en portugués.",
    originalInPortuguese: "Leer el original en portugués",
  },
  en: {
    siteTagline: "Reference catalogue · Catholic faith, doctrine and life",
    siteDescription:
      "Quick reference on the Catholic world: saints, popes, the Catechism, sacraments, miracles, Church history, prayers and more than 40 topics.",
    home: "Home",
    skipToContent: "Skip to content",
    languageLabel: "Language",
    breadcrumbHome: "Archive",
    homeHeading: "Catholic Compendium",
    homeLead:
      "Quick reference on the Catholic world. Content is being translated in stages.",
    categoriesHeading: "Categories",
    entryCount: (n) => `${n} ${n === 1 ? "entry" : "entries"}`,
    emptyPage: "No entries on this page.",
    loadError: "Could not load the content.",
    reloadHint: "Please reload the page in a moment.",
    aboutPrayer: "About this prayer",
    textSize: "Text size",
    relatedTopics: "Related topics",
    sources: "Sources",
    previous: "← Previous",
    next: "Next →",
    neighborsLabel: "Neighbouring entries",
    keepReading: "Keep reading",
    allEntriesOf: (c) => `← All entries in ${c}`,
    translationNote: "Translation of the original Portuguese text.",
    originalInPortuguese: "Read the original in Portuguese",
  },
};

export function dictionaryFor(lang: SiteLang): Dictionary {
  return DICTIONARY[lang];
}
