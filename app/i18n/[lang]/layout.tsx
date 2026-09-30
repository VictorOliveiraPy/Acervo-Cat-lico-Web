import { notFound } from "next/navigation";

import { HtmlLang } from "@/components/HtmlLang";
import { HREFLANG, LOCALES, isLocale } from "@/lib/i18n";

/** `/es` e `/en` são conhecidos em build; qualquer outro código nunca chega às páginas. */
export function generateStaticParams(): { lang: string }[] {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  return (
    <>
      <HtmlLang lang={HREFLANG[params.lang]} />
      {children}
    </>
  );
}
