import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Gera `/robots.txt` — libera tudo pra indexação e aponta pro sitemap.
 *
 * Não há área privada ou de rascunho no acervo (é só leitura pública),
 * então não existe rota a bloquear.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
