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
// que isto pra cobrir o que existe hoje. `img-src` libera a Wikimedia (fonte
// editorial original, ainda usada como fallback) e o bucket R2 que serve as
// cópias WebP pré-processadas (ver `docs/imagens/` no backend) — mesmos dois
// hosts de `images.remotePatterns` abaixo.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' https://upload.wikimedia.org https://pub-78c1274756844d269b56dd7c167c420d.r2.dev data:",
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
    // As imagens do acervo vêm do bucket R2 (cópia WebP pré-processada,
    // ver `docs/imagens/` no backend) quando o backend já sincronizou
    // aquela entrada, com fallback pro hotlink original da Wikimedia
    // (arquivos de domínio público / CC verificados manualmente, ver
    // app/data/*.json no backend) quando ainda não sincronizou.
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "pub-78c1274756844d269b56dd7c167c420d.r2.dev", pathname: "/**" },
    ],
    // O acervo já passa de mil imagens únicas (uma por verbete, cada uma
    // conta como "source image" separada pra cota de Otimização de Imagem
    // da Vercel) — estourou o limite do plano Hobby e todo <Image> do site
    // parou de carregar (erro 402 "OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED").
    // `unoptimized: true` serve o arquivo original direto, sem passar pela
    // pipeline de otimização/cota da Vercel — perde o resize/WebP automático,
    // mas volta a funcionar sem custo. Reverter se/quando o plano mudar.
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.compendio-catolico.com" }],
        destination: "https://compendio-catolico.com/:path*",
        permanent: true,
      },
      {
        // `/perguntar` era a página dedicada do chatbot, substituída pelo
        // widget flutuante (`ChatWidget`, disponível em toda página) —
        // redirect, não 404, pra quem já tinha o link salvo/indexado.
        source: "/perguntar",
        destination: "/",
        permanent: true,
      },
    ];
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
