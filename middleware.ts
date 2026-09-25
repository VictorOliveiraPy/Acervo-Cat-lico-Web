import { NextResponse, type NextRequest } from "next/server";

import { classifyPath } from "@/lib/routing";

/**
 * Resolve, sem ir à API, o que só depende do caminho: 404 real para URL que não
 * existe e redirect permanente de maiúsculas para minúsculas. Ver `lib/routing.ts`.
 */
export function middleware(request: NextRequest) {
  const verdict = classifyPath(request.nextUrl.pathname);

  if (verdict.kind === "redirect") {
    const url = request.nextUrl.clone();
    url.pathname = verdict.to;
    return NextResponse.redirect(url, 308);
  }

  if (verdict.kind === "not-found") {
    // Reescreve para um caminho que nenhuma rota atende: o Next responde com o
    // `not-found.tsx` do site e HTTP 404 de verdade (3 segmentos: não casa com
    // `[categoria]/[slug]` nem com nenhuma rota fixa).
    return NextResponse.rewrite(new URL("/__404/a/b", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Fora: arquivos internos do Next, API e qualquer caminho com extensão
  // (robots.txt, sitemap.xml, manifest.webmanifest, imagens em /public).
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
