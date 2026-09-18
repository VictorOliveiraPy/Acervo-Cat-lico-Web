import type { Metadata, Viewport } from "next";
import { EB_Garamond, Karla } from "next/font/google";
import Script from "next/script";

import "@/app/globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/*
 * As duas fontes do projeto, expostas como as variáveis CSS que o
 * `tailwind.config.ts` já espera (`--font-display`, `--font-body`):
 * Garamond para títulos e corpo de leitura (tradição impressa do conteúdo),
 * Karla para rótulos, metadados e controles (papel utilitário).
 */
const display = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// metadataBase resolve as URLs relativas de OG/Twitter/canonical pro domínio
// de produção — sem isso, renderizado fora de produção (preview, local), o
// Next cairia no host do próprio deploy em vez de compendio-catolico.com.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // `manifest.ts` já injeta o <link rel="manifest">; isto aqui é o que faz o
  // Safari/iOS tratar o site como app (barra de status, sem chrome do
  // navegador) quando adicionado à Tela de Início — o Android usa o
  // manifest para a mesma coisa (`display: "standalone"`).
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Compêndio",
  },
};

// Precisa ser export separado de `metadata` desde o Next 14 (o campo
// `themeColor` dentro de `metadata` foi descontinuado em favor deste).
export const viewport: Viewport = {
  themeColor: "#6B1F2A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable}`}
      // O script `reading-size-init` abaixo adiciona `data-reading-size`
      // antes da hidratação (evita o flash de tamanho normal pra quem já
      // escolheu A+/A++) — o servidor nunca sabe esse valor (só existe no
      // localStorage do navegador), então sem isso o React acusaria um
      // mismatch de hidratação só por causa desse atributo.
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        {/* Aplica o modo leitura salvo (lib/readingSize.ts) antes da
            primeira pintura — sem isso, quem escolheu "A++" veria o texto
            no tamanho normal por um instante a cada carregamento novo
            (`beforeInteractive` roda antes da hidratação, não depois). */}
        <Script id="reading-size-init" strategy="beforeInteractive">
          {`try{var s=localStorage.getItem("compendio:reading-size");if(s==="larger"||s==="largest"){document.documentElement.dataset.readingSize=s;}}catch(e){}`}
        </Script>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-edge focus:bg-bordeaux focus:px-4 focus:py-2 focus:text-meta focus:text-parchment-raised"
        >
          Ir para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <PwaRegister />
        {/* Himetrica é um tracker client-side (a chave é feita pra rodar no
            navegador — não é segredo, é padrão deles mesmos, igual site ID
            do Plausible/PostHog). Mesmo setup do melhorperfil-web:
            strategy="afterInteractive" e só carrega se a env var estiver
            configurada (Vercel → NEXT_PUBLIC_HIMETRICA_API_KEY) — sem ela,
            undefined viraria a string "undefined" no atributo. */}
        {process.env.NEXT_PUBLIC_HIMETRICA_API_KEY && (
          <Script
            src="https://cdn.himetrica.com/tracker.js"
            strategy="afterInteractive"
            data-api-key={process.env.NEXT_PUBLIC_HIMETRICA_API_KEY}
          />
        )}
      </body>
    </html>
  );
}
