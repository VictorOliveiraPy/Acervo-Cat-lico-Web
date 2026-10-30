import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  MetaList,
  PageToc,
  PrayerText,
  SourceList,
  TagList,
} from "@/components/Editorial";
import { EntryList } from "@/components/EntryList";
import { EntryActions } from "@/components/EntryActions";
import { EntryNeighbors } from "@/components/EntryNeighbors";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { ReadingSizeControl } from "@/components/ReadingSizeControl";
import { lessonForEntry } from "@/lib/academia";
import { ApiError } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath, entryPath } from "@/lib/categories";
import { entryMetaFields, entryOrdinal, paragraphs } from "@/lib/entryDisplay";
import { articleJsonLd, safeJsonLd } from "@/lib/jsonLd";
import { HREFLANG, formatEntryDate, languageAlternates } from "@/lib/i18n";
import { neighborsOf } from "@/lib/neighbors";
import { saintAssetFor } from "@/lib/saintAssets";
import { isCategorySlug, type CategorySlug, type Entry } from "@/lib/schemas";
import {
  fetchCategoryIndex,
  fetchEntry,
  fetchEntryPage,
  fetchTranslationLangs,
  searchAcervo,
  type CategoryIndexItem,
} from "@/lib/services/acervoService";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Quantas outras entradas da mesma categoria aparecem em "Mais de …". */
const RELATED_COUNT = 4;

/**
 * Outras entradas da mesma categoria, para continuar a leitura.
 *
 * Busca a primeira página da categoria e tira a própria entrada de lá — não
 * é "relacionado" por assunto (a API não tem esse relacionamento), é o
 * mesmo princípio do "mais episódios do programa" de um site de conteúdo:
 * a categoria inteira já é o "programa" de que a entrada faz parte. Falha
 * da API aqui não pode derrubar a página inteira — sem sugestões, a leitura
 * do que já carregou continua de pé.
 */
async function loadRelated(
  categoria: CategorySlug,
  currentSlug: string,
  tags: string[],
): Promise<Entry[]> {
  const terms = tags.map((tag) => tag.trim()).filter((tag) => tag.length >= 2).slice(0, 3);

  try {
    const taggedResults = await Promise.all(
      terms.map((term) =>
        searchAcervo({ q: term, limit: RELATED_COUNT + 2, revalidateSeconds: revalidate }),
      ),
    );
    const candidates = new Map<string, { categoria: CategorySlug; slug: string }>();
    for (const results of taggedResults) {
      for (const result of results) {
        if (result.slug !== currentSlug) {
          candidates.set(`${result.categoria}:${result.slug}`, result);
        }
      }
    }

    const related = await Promise.all(
      [...candidates.values()].slice(0, RELATED_COUNT).map(async (candidate) => {
        try {
          return await fetchEntry(candidate.categoria, candidate.slug);
        } catch (error: unknown) {
          if (error instanceof ApiError) return null;
          throw error;
        }
      }),
    );
    if (related.filter(Boolean).length > 0) {
      return related.filter((entry): entry is Entry => entry !== null);
    }

    const page = await fetchEntryPage(categoria, { limit: RELATED_COUNT + 1 });
    return page.itens.filter((entry) => entry.slug !== currentSlug).slice(0, RELATED_COUNT);
  } catch (error: unknown) {
    if (error instanceof ApiError) return [];
    throw error;
  }
}

/**
 * Entrada anterior e próxima na categoria. Falha da API aqui não derruba a
 * página: sem vizinhas, o resto da leitura continua de pé.
 */
async function loadNeighbors(categoria: CategorySlug, slug: string) {
  try {
    return neighborsOf<CategoryIndexItem>(await fetchCategoryIndex(categoria), slug);
  } catch (error: unknown) {
    if (error instanceof ApiError) return { previous: null, next: null };
    throw error;
  }
}

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

/**
 * Verbete pré-renderizado sob demanda e guardado em cache. Sem isto a rota é
 * dinâmica: cada visita do Googlebot refaz a página e as chamadas à API (~0,65 s),
 * e resposta lenta reduz quanto o Google se dispõe a rastrear.
 */
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return [];
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
    const translations = await fetchTranslationLangs(params.categoria, params.slug);
    return {
      title: entry.titulo,
      description: entry.resumo,
      alternates: {
        canonical: path,
        // hreflang recíproco: só declara idiomas em que a tradução existe.
        languages: translations.length > 0 ? languageAlternates(path) : undefined,
      },
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

  // Falha da API sobe para `error.tsx` e responde 500, em vez de um 200 com
  // mensagem de erro: o Google tenta de novo, e o cache mantém a última versão boa.
  const entry = await loadEntry(categoria, params.slug);

  const ordinal = entryOrdinal(entry);
  const saintAsset = saintAssetFor(entry);
  const fields = entryMetaFields(entry);
  const blocks = paragraphs(entry.corpo);
  const path = entryPath(categoria, params.slug);
  const lesson = lessonForEntry(categoria, params.slug);
  const tocItems = [
    ...(fields.length > 0 ? [{ href: "#dados", label: "Dados" }] : []),
    { href: "#leitura", label: "Leitura" },
    ...(entry.fontes.length > 0 ? [{ href: "#fontes", label: "Fontes" }] : []),
    ...(entry.tags.length > 0 ? [{ href: "#temas", label: "Temas relacionados" }] : []),
    ...(lesson ? [{ href: "#estudar", label: "Estudar este tema" }] : []),
  ];
  const [related, neighbors] = await Promise.all([
    loadRelated(categoria, params.slug, entry.tags),
    loadNeighbors(categoria, params.slug),
  ]);

  // Dados estruturados: o Article identifica o verbete, e o BreadcrumbList espelha a
  // navegação visível logo abaixo, o que habilita a migalha no resultado de busca.
  const entryJsonLd = articleJsonLd({
    url: `${SITE_URL}${path}`,
    titulo: entry.titulo,
    resumo: entry.resumo,
    imagem: entry.imagem,
    inLanguage: "pt-BR",
    publicado_em: entry.publicado_em,
    atualizado_em: entry.atualizado_em,
    nascimento: "nascimento" in entry ? entry.nascimento : null,
    morte: "morte" in entry ? entry.morte : null,
  });

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

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_11rem] lg:gap-16">
        <div className="min-w-0">
          <header className="border-b border-border pb-8">
            <p className="eyebrow">{[label.nav, ordinal].filter(Boolean).join(" · ")}</p>
            <h1 className="mt-2 max-w-measure font-display text-title-lg text-ink md:text-title-xl">
              {entry.titulo}
            </h1>
            <p className="mt-4 max-w-measure text-lead text-ink-muted">{entry.resumo}</p>
            {entry.atualizado_em ? (
              <p className="mt-3 text-meta text-ink-muted">
                Atualizado em{" "}
                <time dateTime={entry.atualizado_em}>
                  {formatEntryDate("pt", entry.atualizado_em)}
                </time>
              </p>
            ) : null}
            <EntryActions categoria={categoria} slug={entry.slug} titulo={entry.titulo} />
          </header>

          {entry.categoria === "oracoes" ? (
            <div className="mt-8">
              <PrayerText texto={entry.texto} />
            </div>
          ) : null}

          {saintAsset ? (
            <figure className="mt-8">
              {/* Com arte revisada, a ilustração substitui a imagem antiga nesta página.
                  `og:image` e JSON-LD seguem com a do acervo, a que buscadores já conhecem. */}
              <div className="relative aspect-[2/3] w-full max-w-[16rem] overflow-hidden rounded-panel border border-border bg-surface">
                <Image
                  src={saintAsset.portrait}
                  alt={saintAsset.alt}
                  fill
                  sizes="16rem"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <figcaption className="mt-2 max-w-measure text-meta text-ink-muted">
                {saintAsset.credit}
              </figcaption>
            </figure>
          ) : entry.imagem ? (
            <figure className="mt-8">
              {/* Altura fixa + `fill`: as imagens vêm da Wikimedia Commons com
                  proporções bem diferentes entre si, e a faixa constante evita
                  layout shift. */}
              <div className="relative h-72 w-full max-w-measure overflow-hidden border border-border sm:h-96">
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
            <section id="dados" aria-label="Dados da entrada" className="mt-8">
              <MetaList fields={fields} />
            </section>
          ) : null}

          <div id="leitura" className="mt-12 flex items-center justify-end gap-3">
            <p className="kicker">Tamanho do texto</p>
            <ReadingSizeControl />
          </div>

          <div className="reading-column mt-6">
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
                    ? "first-letter:float-left first-letter:mt-1 first-letter:font-display first-letter:text-[3.4em] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-accent"
                    : undefined
                }
              >
                {block}
              </p>
            ))}
          </div>

          <OrnamentalDivider />

          <div className="mt-8">
            <SourceList sources={entry.fontes} />
          </div>

          {lesson ? (
            <aside
              id="estudar"
              aria-labelledby="estudar-titulo"
              className="mt-8 flex flex-col gap-5 rounded-panel bg-mineral p-6 text-white sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-sans text-label font-bold uppercase tracking-[0.16em] text-white/80">
                  Aprender com a Academia
                </p>
                <h2 id="estudar-titulo" className="mt-2 font-display text-title-md text-white">
                  Entender é só o começo.
                </h2>
                <p className="mt-1 text-meta text-white/85">
                  Uma explicação guiada e um exercício, sem cadastro. Este artigo continua aberto, com ou
                  sem a lição.
                </p>
              </div>
              <Link href={`/academia/${lesson.slug}`} className="btn btn-on-mineral shrink-0">
                Iniciar lição <span aria-hidden="true">→</span>
              </Link>
            </aside>
          ) : null}

          {entry.tags.length > 0 ? (
            <section id="temas" aria-labelledby="temas-titulo" className="mt-8">
              <h2 id="temas-titulo" className="kicker">
                Temas relacionados
              </h2>
              <p className="mt-2 max-w-measure text-meta text-ink-muted">
                Cada tema reúne as entradas sobre ele em todas as categorias do acervo.
              </p>
              <div className="mt-3">
                <TagList themes={entry.temas} />
              </div>
            </section>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <PageToc label="Nesta página" items={tocItems} />
        </aside>
      </div>

      <EntryNeighbors categoria={categoria} neighbors={neighbors} />

      {related.length > 0 ? (
        <section aria-labelledby="mais-da-categoria" className="mt-section">
          <div className="border-b border-border pb-2">
            <h2 id="mais-da-categoria" className="font-display text-title-md text-ink">
              Continue sua leitura
            </h2>
          </div>
          <EntryList entries={related} showCategory />
        </section>
      ) : null}

      <p className="mt-10">
        <Link
          href={categoryPath(categoria)}
          className="text-meta text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          ← Todas as entradas de {label.nav}
        </Link>
      </p>
    </article>
  );
}
