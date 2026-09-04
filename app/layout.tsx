import type { Metadata } from "next";
import { EB_Garamond, Karla } from "next/font/google";

import "@/app/globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

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

export const metadata: Metadata = {
  title: {
    default: "Compêndio Católico",
    template: "%s · Compêndio Católico",
  },
  description:
    "Catálogo de consulta sobre santos, papas, milagres eucarísticos, Catecismo, Crisma, história da Igreja, Doutores e concílios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-edge focus:bg-bordeaux focus:px-4 focus:py-2 focus:text-meta focus:text-parchment-raised"
        >
          Ir para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
