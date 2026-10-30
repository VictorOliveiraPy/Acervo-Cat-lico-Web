import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { display } from "@/app/fonts";
import { SiteShell } from "@/components/SiteShell";
import { HREFLANG, LOCALES, OG_LOCALE, dictionaryFor, isLocale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

type Params = { lang: string };

/** `/es` e `/en` são conhecidos em build; qualquer outro código nunca chega às páginas. */
export function generateStaticParams(): Params[] {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#8C313E",
};

export function generateMetadata({ params }: { params: Params }): Metadata {
  if (!isLocale(params.lang)) return {};
  const t = dictionaryFor(params.lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.homeHeading, template: `%s · ${t.homeHeading}` },
    description: t.siteDescription,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[params.lang],
      siteName: t.homeHeading,
      title: t.homeHeading,
      description: t.siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: t.homeHeading,
      description: t.siteDescription,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Layout raiz próprio do idioma: é o que faz `<html lang>` sair certo já no HTML do
 * servidor. Ler o idioma de um header no layout único tiraria o site inteiro do cache.
 */
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  if (!isLocale(params.lang)) notFound();
  return (
    <html lang={HREFLANG[params.lang]} className={display.variable} suppressHydrationWarning>
      <SiteShell skipLabel={dictionaryFor(params.lang).skipToContent}>{children}</SiteShell>
    </html>
  );
}
