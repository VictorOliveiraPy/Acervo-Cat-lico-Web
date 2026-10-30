import type { Metadata, Viewport } from "next";

import "@/app/globals.css";
import { display } from "@/app/fonts";
import { SiteShell } from "@/components/SiteShell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

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
  themeColor: "#8C313E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={display.variable}
      // O script `reading-size-init` adiciona `data-reading-size` antes da
      // hidratação — o servidor nunca sabe esse valor (só existe no
      // localStorage), então sem isso o React acusaria um mismatch.
      suppressHydrationWarning
    >
      <SiteShell skipLabel="Ir para o conteúdo">{children}</SiteShell>
    </html>
  );
}
