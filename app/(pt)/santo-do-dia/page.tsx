import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Editorial";
import { entryPath } from "@/lib/categories";
import { imagePosition } from "@/lib/entryDisplay";
import { safeJsonLd } from "@/lib/jsonLd";
import { todayInBrazil } from "@/lib/liturgia";
import { saintAssetFor } from "@/lib/saintAssets";
import {
  formatDayMonth,
  saintOfDay,
  upcomingFeasts,
  type Santo,
} from "@/lib/santoDoDia";
import { fetchAllEntries } from "@/lib/services/acervoService";
import { SITE_URL } from "@/lib/site";

// A troca de dia à meia-noite de Brasília aparece em até 15 minutos.
export const revalidate = 900;

const MAX_DESCRIPTION = 160;

function shorten(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  return `${text.slice(0, MAX_DESCRIPTION - 1).replace(/\s+\S*$/, "")}…`;
}

async function loadSaints(): Promise<Santo[]> {
  return (await fetchAllEntries("santos")) as Santo[];
}

export async function generateMetadata(): Promise<Metadata> {
  const current = saintOfDay(await loadSaints(), todayInBrazil());
  const title = current
    ? `Santo do dia — ${current.saint.titulo}, ${formatDayMonth(current.date)}`
    : "Santo do dia";
  const description = current
    ? shorten(`${current.saint.titulo}: ${current.saint.resumo}`)
    : "O santo celebrado hoje e as festas dos próximos dias.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/santo-do-dia" },
    openGraph: {
      title,
      description,
      url: "/santo-do-dia",
      images: current?.saint.imagem ? [{ url: current.saint.imagem }] : ["/opengraph-image"],
    },
  };
}

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Acervo", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Santo do dia", item: `${SITE_URL}/santo-do-dia` },
  ],
};

export default async function SantoDoDiaPage() {
  const saints = await loadSaints();
  const today = todayInBrazil();
  const current = saintOfDay(saints, today);
  const upcoming = upcomingFeasts(saints, today);
  const asset = current ? saintAssetFor(current.saint) : null;
  const image = asset?.portrait ?? current?.saint.imagem;

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(BREADCRUMB_JSON_LD) }}
      />
      <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: "Santo do dia" }]} />

      {current ? (
        <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start">
          {image ? (
            <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-panel border border-border bg-surface">
              <Image
                src={image}
                alt={asset?.alt ?? current.saint.titulo}
                fill
                sizes="10rem"
                className="object-cover"
                style={{ objectPosition: asset ? "top" : imagePosition(current.saint) }}
                priority
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <p className="eyebrow">
              {current.isToday ? "Santo do dia" : "Próxima festa"} ·{" "}
              <time dateTime={current.date}>{formatDayMonth(current.date)}</time>
            </p>
            <h1 className="mt-2 font-display text-title-lg text-ink md:text-title-xl">
              {current.saint.titulo}
            </h1>
            <p className="mt-4 max-w-measure text-lead text-ink-muted">{current.saint.resumo}</p>
            <p className="mt-4">
              <Link href={entryPath("santos", current.saint.slug)} className="btn-tertiary">
                Ler a entrada completa <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </header>
      ) : (
        <h1 className="font-display text-title-lg text-ink md:text-title-xl">Santo do dia</h1>
      )}

      {current && current.others.length > 0 ? (
        <section aria-labelledby="mesma-data" className="mt-10">
          <h2 id="mesma-data" className="font-display text-title-md text-ink">
            Também nesta data
          </h2>
          <SaintLinks saints={current.others} />
        </section>
      ) : null}

      <section aria-labelledby="proximos" className="mt-10">
        <h2 id="proximos" className="font-display text-title-md text-ink">
          Próximos 7 dias
        </h2>
        {upcoming.length > 0 ? (
          <ul className="mt-4 flex flex-col">
            {upcoming.map((day) => (
              <li key={day.date} className="border-t border-border py-4">
                <p className="kicker">
                  <time dateTime={day.date}>{formatDayMonth(day.date)}</time>
                </p>
                <SaintLinks saints={day.saints} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-body text-ink-muted">Nenhuma festa no acervo nestes dias.</p>
        )}
      </section>
    </div>
  );
}

function SaintLinks({ saints }: { saints: Santo[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
      {saints.map((saint) => (
        <li key={saint.slug}>
          <Link
            href={entryPath("santos", saint.slug)}
            className="text-body text-accent underline-offset-4 hover:underline"
          >
            {saint.titulo}
          </Link>
        </li>
      ))}
    </ul>
  );
}
