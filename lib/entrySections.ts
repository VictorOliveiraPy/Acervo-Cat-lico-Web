import type { Entry } from "@/lib/schemas";

export type EntrySectionFields = Pick<
  Entry,
  "biografia" | "oracao" | "frases" | "iconografia" | "curiosidades" | "faq"
>;

/** O sumário só compensa a partir de tantas seções. */
const TOC_MIN_SECTIONS = 3;

/** Âncoras das seções opcionais que têm conteúdo, na ordem em que aparecem. */
export function entrySectionLinks(entry: EntrySectionFields): { href: string; label: string }[] {
  return [
    ...entry.biografia.map(({ titulo }, index) => ({
      href: `#biografia-${index + 1}`,
      label: titulo,
    })),
    ...(entry.oracao ? [{ href: "#oracao", label: "Oração" }] : []),
    ...(entry.frases.length > 0 ? [{ href: "#frases", label: "Frases" }] : []),
    ...(entry.iconografia ? [{ href: "#iconografia", label: "Iconografia" }] : []),
    ...(entry.curiosidades.length > 0 ? [{ href: "#curiosidades", label: "Curiosidades" }] : []),
    ...(entry.faq.length > 0 ? [{ href: "#faq", label: "Perguntas frequentes" }] : []),
  ];
}

/** Links do sumário no corpo do artigo; vazio quando há poucas seções. */
export function entryTocLinks(entry: EntrySectionFields): { href: string; label: string }[] {
  const links = entrySectionLinks(entry);
  return links.length >= TOC_MIN_SECTIONS ? links : [];
}
