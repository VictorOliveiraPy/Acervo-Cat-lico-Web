/**
 * Nome da fonte usado por todos os cartões de Instagram — só a constante
 * mora aqui. O *carregamento* dos bytes da fonte (`fetch(new URL(...))`)
 * tem que ficar escrito direto em cada `route.tsx`, não aqui: o rastreador
 * de build da Vercel só empacota o arquivo referenciado quando o padrão
 * `new URL("./algo", import.meta.url)` aparece literalmente no arquivo da
 * própria rota — através de um módulo importado, ele não encontra o
 * arquivo e o fetch falha silenciosamente em produção (funcionava local,
 * porque `next start` local ainda enxerga o disco; o edge de verdade da
 * Vercel não tem acesso a nada que não foi empacotado).
 */
export const EB_GARAMOND_FONT_FAMILY = "EB Garamond";
