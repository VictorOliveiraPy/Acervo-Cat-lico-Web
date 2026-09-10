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
