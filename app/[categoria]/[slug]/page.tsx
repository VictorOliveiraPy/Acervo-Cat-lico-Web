import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  MetaList,
  PrayerText,
  SourceList,
  StatusMessage,
  TagList,
} from "@/components/Editorial";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { ApiError, getErrorMessage } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath, entryPath } from "@/lib/categories";
import { entryMetaFields, entryOrdinal, paragraphs } from "@/lib/entryDisplay";
import { safeJsonLd } from "@/lib/jsonLd";
import { isCategorySlug, type CategorySlug, type Entry } from "@/lib/schemas";
import { fetchEntry } from "@/lib/services/acervoService";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { categoria: string; slug: string };

/**
 * Carrega a entrada, transformando "não existe" em 404 do Next.
 *
 * Só o 404 da API vira `notFound()`; qualquer outra falha continua sendo erro,
 * porque uma instabilidade momentânea não pode ser apresentada como "esta
 * entrada não existe".
 */
async function loadEntry(categoria: CategorySlug, slug: string): Promise<Entry> {
  try {
    return await fetchEntry(categoria, slug);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  if (!isCategorySlug(params.categoria)) return { title: "Entrada" };

  try {
    const entry = await fetchEntry(params.categoria, params.slug);
    const path = entryPath(params.categoria, params.slug);
    return {
      title: entry.titulo,
      description: entry.resumo,
      alternates: { canonical: path },
      openGraph: {
        title: entry.titulo,
        description: entry.resumo,
        url: path,
        images: entry.imagem ? [{ url: entry.imagem }] : undefined,
      },
    };
  } catch (error: unknown) {
    // Metadados não valem uma página quebrada: sem o dado, cai no genérico.
    if (error instanceof ApiError) {
      return { title: CATEGORY_LABELS[params.categoria].heading };
    }
    throw error;
  }
}

export default async function EntryPage({ params }: { params: Params }) {
  if (!isCategorySlug(params.categoria)) notFound();

  const categoria: CategorySlug = params.categoria;
  const label = CATEGORY_LABELS[categoria];

  let entry: Entry;
  try {
    entry = await loadEntry(categoria, params.slug);
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    return (
      <div className="mx-auto max-w-shell px-4 py-12 sm:px-6">
        <StatusMessage title="Não foi possível abrir esta entrada" tone="error">
          <p>{getErrorMessage(error)}</p>
          <p className="mt-3">
            Volte para{" "}
            <Link
              href={categoryPath(categoria)}
              className="text-bordeaux underline underline-offset-4"
            >
              {label.nav}
            </Link>{" "}
            e tente novamente.
          </p>
        </StatusMessage>
      </div>
    );
  }

  const ordinal = entryOrdinal(entry);
  const fields = entryMetaFields(entry);
  const blocks = paragraphs(entry.corpo);
  const path = entryPath(categoria, params.slug);

  // Dados estruturados: CreativeWork identifica a entrada em si (título,
  // resumo, imagem), BreadcrumbList espelha a navegação visível logo abaixo
  // — os dois juntos são o que habilita o Google a mostrar a migalha de
  // caminho no resultado de busca em vez de só a URL crua.
  const entryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.titulo,
    description: entry.resumo,
    url: `${SITE_URL}${path}`,
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ...(entry.imagem ? { image: entry.imagem } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acervo", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: label.nav,
        item: `${SITE_URL}${categoryPath(categoria)}`,
      },
      { "@type": "ListItem", position: 3, name: entry.titulo, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <article className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(entryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Breadcrumbs
        trail={[
          { label: "Acervo", href: "/" },
          { label: label.nav, href: categoryPath(categoria) },
          { label: entry.titulo },
        ]}
      />

      <header className="border-b border-rule-faint pb-8">
        <p className="kicker">{[label.nav, ordinal].filter(Boolean).join(" · ")}</p>
        <h1 className="mt-2 max-w-measure font-display text-title-lg text-ink md:text-title-xl">
          {entry.titulo}
        </h1>
        <p className="mt-4 max-w-measure text-lead text-ink-muted">{entry.resumo}</p>
      </header>

      {entry.categoria === "oracoes" ? (
        <div className="mt-8">
          <PrayerText texto={entry.texto} />
        </div>
      ) : null}

      {entry.imagem ? (
        <figure className="mt-8">
          {/* Altura fixa + `fill`: as imagens vêm da Wikimedia Commons com
              proporções bem diferentes entre si (ícone quadrado, retrato,
              afresco panorâmico) — uma faixa de altura constante evita
              layout shift e mantém o ritmo editorial da página, ao custo de
              recortar (`object-cover`) o excesso lateral ou vertical. */}
          <div className="relative h-72 w-full max-w-measure overflow-hidden border border-rule-faint sm:h-96">
            <Image
              src={entry.imagem}
              alt={entry.titulo}
              fill
              sizes="(min-width: 1024px) 68ch, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {entry.imagem_credito ? (
            <figcaption className="mt-2 max-w-measure text-meta text-ink-muted">
              {entry.imagem_credito}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {fields.length > 0 ? (
        <section aria-label="Dados da entrada" className="mt-8">
          <MetaList fields={fields} />
        </section>
      ) : null}

      <div className="reading-column mt-12">
        {entry.categoria === "oracoes" ? (
          <h2 className="kicker mb-4">Sobre esta oração</h2>
        ) : null}
        {blocks.map((block, index) => (
          // Capitular no primeiro parágrafo do corpo, só ele — efeito de
          // breviário antigo (`first-letter` é suporte nativo do CSS, sem
          // precisar quebrar o texto em spans).
          <p
            key={index}
            className={
              index === 0
                ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.4em] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-bordeaux"
                : undefined
            }
          >
            {block}
          </p>
        ))}
      </div>

      <OrnamentalDivider />

      <footer className="mt-section grid gap-10 pt-2 md:grid-cols-2">
        <section aria-labelledby="temas">
          <h2 id="temas" className="kicker">
            Temas relacionados
          </h2>
          <p className="mt-2 max-w-measure text-meta text-ink-muted">
            Cada tema abre a busca por ele em todas as categorias do acervo.
          </p>
          <div className="mt-3">
            <TagList tags={entry.tags} />
          </div>
        </section>

        <SourceList sources={entry.fontes} />
      </footer>

      <p className="mt-10">
        <Link
          href={categoryPath(categoria)}
          className="text-meta text-bordeaux underline underline-offset-4 hover:text-bordeaux-soft"
        >
          ← Todas as entradas de {label.nav}
        </Link>
      </p>
    </article>
  );
}
