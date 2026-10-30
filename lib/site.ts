/**
 * Constantes do site publicado.
 *
 * Um único lugar para a URL de produção e o texto institucional que
 * `layout.tsx`, `robots.ts`, `sitemap.ts`, as imagens de OG/favicon e o
 * JSON-LD das páginas precisam repetir — evita que uma delas fique
 * apontando pro domínio antigo (`.vercel.app`) enquanto as outras já
 * migraram para `compendio-catolico.com`.
 */

export const SITE_URL = "https://compendio-catolico.com";

export const SITE_NAME = "Compêndio Católico";

// Cortada pra caber no snippet do Google sem truncar no meio da frase (o
// limite prático fica perto de 155-160 caracteres) — versão anterior tinha
// 180 e listava só 10 das 43 categorias, uma escolha meio arbitrária.
export const SITE_DESCRIPTION =
  "Consulta rápida sobre o mundo católico: santos, papas, Catecismo, sacramentos, milagres, história da Igreja, orações e mais de 40 temas.";

/** Perfil oficial no Instagram, linkado no rodapé. */
export const INSTAGRAM_URL = "https://www.instagram.com/compendiocatolico/";
