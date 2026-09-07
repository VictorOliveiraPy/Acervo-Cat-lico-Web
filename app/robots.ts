import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Gera `/robots.txt` — libera tudo pra indexação e aponta pro sitemap.
 *
 * A única exceção é `/instagram/*`: gera as imagens dos cartões que o robô
 * de publicação envia pro Graph API (ver o plano do mural de Instagram),
 * não é conteúdo pensado pra navegação ou indexação humana.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/instagram/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
