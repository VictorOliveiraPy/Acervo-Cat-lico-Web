/**
 * Decide, só pelo caminho, se uma URL é válida ANTES de a página renderizar.
 *
 * Por quê existe: uma URL inexistente sob `/papas/qualquer-coisa` chegava a
 * renderizar e a resposta saía com HTTP 200 (a página só descobria o 404 depois
 * de o Next já ter começado a enviar a resposta), e o Google indexava/agrupava
 * esses "soft 404" como cópias. Rotas que dependem só do caminho (categoria
 * desconhecida, primeiro segmento inexistente, profundidade errada, letra
 * maiúscula) são resolvidas aqui, sem ir à API, e viram 404 ou redirect de verdade.
 *
 * O `slug` de uma entrada exige a API; esse caso é tratado na própria página,
 * sem `loading.tsx` acima (ver `app/[categoria]/[slug]/page.tsx`).
 */

import { CATEGORY_SLUGS } from "@/lib/schemas";

export type PathVerdict =
  | { kind: "ok" }
  | { kind: "redirect"; to: string }
  | { kind: "not-found" };

const CATEGORIES = new Set<string>(CATEGORY_SLUGS);

/** Rotas de um único segmento (`/busca`, `/velas`...) e os arquivos gerados pelo Next. */
const SINGLE_SEGMENT_ROUTES = new Set([
  "busca",
  "liturgia-diaria",
  "velas",
  "icon",
  "apple-icon",
  "opengraph-image",
  "icon-192",
  "icon-512",
  "icon-512-maskable",
]);

/** `/instagram/[categoria]/[slug]` é a rota mais funda do site. */
const MAX_INSTAGRAM_SEGMENTS = 3;
const MAX_CATEGORY_SEGMENTS = 2;

const NOT_FOUND: PathVerdict = { kind: "not-found" };
const OK: PathVerdict = { kind: "ok" };

/** Letra maiúscula FORA de sequências `%XX` (que são hexadecimal, não caixa de texto). */
function hasUppercaseLetter(pathname: string): boolean {
  return /[A-Z]/.test(pathname.replace(/%[0-9A-Fa-f]{2}/g, ""));
}

/** Minúsculas sem tocar em `%C3%A3`: mexer nisso gera redirect em loop. */
function lowercaseOutsideEscapes(pathname: string): string {
  return pathname.replace(/%[0-9A-Fa-f]{2}|[A-Z]/g, (m) => (m.startsWith("%") ? m : m.toLowerCase()));
}

export function classifyPath(pathname: string): PathVerdict {
  if (pathname === "/" || pathname === "") return OK;

  if (hasUppercaseLetter(pathname)) {
    return { kind: "redirect", to: lowercaseOutsideEscapes(pathname) };
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first === undefined) return OK;

  if (CATEGORIES.has(first)) return segments.length <= MAX_CATEGORY_SEGMENTS ? OK : NOT_FOUND;
  if (first === "instagram") return segments.length <= MAX_INSTAGRAM_SEGMENTS ? OK : NOT_FOUND;
  if (SINGLE_SEGMENT_ROUTES.has(first)) return segments.length === 1 ? OK : NOT_FOUND;
  return NOT_FOUND;
}
