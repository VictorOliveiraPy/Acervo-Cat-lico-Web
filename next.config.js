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

// CSP com 'unsafe-inline' em script/style: os blocos JSON-LD (dado
// estruturado) e a hidratação do Next/React são scripts inline legítimos, e
// não há nenhum script de terceiro no site — não precisa ser mais restrito
// que isto pra cobrir o que existe hoje. `img-src` só libera o próprio site
// e a Wikimedia (único host de imagem, ver `images.remotePatterns` abaixo).
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' https://upload.wikimedia.org data:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // O único Server Action do site (acender uma vela) só precisa de
      // nome/intenção/cidade/estado/e-mail — poucas centenas de bytes.
      // 64kb é generoso pra isso e bem abaixo do 1MB padrão, mitigando o
      // CVE de payload sem limite em Server Actions (GHSA-4c39-4ccg-62r3)
      // enquanto a atualização maior pro Next 15 não é feita.
      bodySizeLimit: "64kb",
    },
  },
  images: {
    // Todas as imagens do acervo são hotlinks para arquivos de domínio
    // público / CC verificados manualmente na Wikimedia Commons (ver
    // app/data/*.json no backend) — único host liberado de propósito.
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
    ],
  },
  async headers() {
    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ];
    // CSP só em produção: o HMR do `next dev` usa eval e um websocket que
    // uma CSP estrita bloquearia — os outros headers acima não têm esse
    // conflito e valem em qualquer ambiente.
    const headers =
      process.env.NODE_ENV === "production"
        ? [...baseHeaders, { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }]
        : baseHeaders;
    return [{ source: "/:path*", headers }];
  },
};

module.exports = nextConfig;
