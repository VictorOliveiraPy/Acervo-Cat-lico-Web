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

export const SITE_DESCRIPTION =
  "Catálogo de consulta sobre o mundo católico: santos, papas, Catecismo, Crisma, sacramentos, orações, pecados, milagres eucarísticos, história da Igreja, Doutores, concílios e mais.";

/**
 * Plataforma irmã: gamificação para viver a fé na prática (escolher um santo
 * de devoção e cumprir desafios e missões), complementar a este acervo de
 * consulta. Linkada no rodapé e na página inicial.
 */
export const SANTO_GUARDIAO_URL = "https://www.santo-guardiao.com.br/";
