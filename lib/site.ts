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

/** Perfil oficial no Instagram, linkado no rodapé. */
export const INSTAGRAM_URL = "https://www.instagram.com/compendiocatolico/";

/**
 * Outro projeto do mesmo autor: ranking público de perfis do Instagram.
 * Sem relação temática com o acervo — link de divulgação simples no
 * rodapé, não uma "plataforma irmã" (esse rótulo fica só pro Santo
 * Guardião, que de fato complementa o conteúdo católico).
 */
export const MELHORPERFIL_URL = "https://www.melhorperfil.com.br/";
