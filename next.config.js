/**
 * Configuração do Next.
 *
 * Não há proxy `/api/:path*` aqui de propósito: o acervo é uma API pública,
 * somente-leitura, sem cookie de sessão nem segredo de borda — e todo fetch
 * acontece em Server Component, então a URL da API nunca é chamada pelo
 * navegador. No dia em que existir autenticação (cookie first-party) ou um
 * header secreto, a chamada passa a ir por um proxy same-origin, nunca por
 * `fetch` em client component.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Todas as imagens do acervo são hotlinks para arquivos de domínio
    // público / CC verificados manualmente na Wikimedia Commons (ver
    // app/data/*.json no backend) — único host liberado de propósito.
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
