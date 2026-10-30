import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EntryGrid } from "@/components/EntryGrid";
import { EditorialStrip, GothicWindow } from "@/components/HomeArt";
import { LessonProgressLink } from "@/components/LessonProgressLink";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { SearchField } from "@/components/SearchField";
import { LESSONS } from "@/lib/academia";
import { ApiError } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath, entryPath } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categoryGroups";
import { formatEntryCount } from "@/lib/entryDisplay";
import { languageAlternates } from "@/lib/i18n";
import { safeJsonLd } from "@/lib/jsonLd";
import { formatLiturgiaDate } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { featuredSaint, type SaintAsset } from "@/lib/saintAssets";
import { CATEGORY_SLUGS, type CategoryInfo, type Entry } from "@/lib/schemas";
import { fetchCategories, fetchEntry, fetchEntryPage } from "@/lib/services/acervoService";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import { INSTAGRAM_URL, SITE_NAME, SITE_URL } from "@/lib/site";

// Regenera a home (com um sorteio novo pra "Do acervo") a cada 5 minutos —
// o mesmo intervalo padrão de cache das leituras da API (`DEFAULT_REVALIDATE_
// SECONDS` em `lib/api.ts`), pra não ficar pedindo dado novo mais rápido do
// que o resto do site já considera "atual".
export const revalidate = 300;

// Só a home é canônica de "/". No layout, esse valor era herdado por toda página
// sem canonical própria, inclusive as 404, dizendo ao Google que eram cópias da home.
export const metadata: Metadata = {
  title: { absolute: "Compêndio Católico — Santos, Orações, Catecismo e Liturgia Diária" },
  alternates: { canonical: "/", languages: languageAlternates("/") },
};

// WebSite + SearchAction: dado estruturado que habilita a caixa de busca do
// Google embaixo do resultado do site (sitelinks search box). Só faz sentido
// na home, que é a página que o Google trata como identidade do site.
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/busca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// Declara a marca como entidade própria (nome, logo, perfil social) — ajuda
// buscadores de IA (Perplexity, ChatGPT Search, Gemini) a reconhecer e citar
// o "Compêndio Católico" como uma fonte específica, não um site anônimo.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512`,
  sameAs: [INSTAGRAM_URL],
};

/** Termos que provam, em um clique, que a busca atravessa as categorias. */
const SUGGESTED_TERMS = [
  "eucaristia",
  "Espírito Santo",
  "Trento",
  "oração",
  "pecados capitais",
];

/** Categorias de onde vêm as entradas da amostra da página inicial. */
const SAMPLE_CATEGORIES = ["santos", "milagres-eucaristicos", "concilios"] as const;

/** Itens por categoria na amostra — 3 categorias × 4 preenchem a grade de 4
 * colunas em 3 linhas cheias. */
const SAMPLE_PER_CATEGORY = 4;

type HomeData = {
  categories: CategoryInfo[];
  sample: Entry[];
};

/** Janela de troca da amostra — 5 minutos, o mesmo intervalo padrão de cache
 * das leituras da API (`DEFAULT_REVALIDATE_SECONDS` em `lib/api.ts`). */
const SAMPLE_ROTATION_MS = 5 * 60 * 1000;

/**
 * Escolhe, dentro do total de uma categoria, um deslocamento (`offset`) que
 * ainda deixa `SAMPLE_PER_CATEGORY` itens inteiros a partir dele — e o mesmo
 * deslocamento para todo mundo durante a mesma janela de 5 minutos.
 *
 * De propósito NÃO é `Math.random()`: o offset vira parte da URL buscada
 * (`fetchEntryPage(slug, { offset })`), e um valor diferente a cada
 * requisição furaria o cache de 5 minutos da API — cada visita bateria na
 * origem de novo, e o objetivo era exatamente o oposto (variar devagar, sem
 * pesar a API). Em vez disso, deriva de `Date.now()` truncado na janela: o
 * mesmo instante sempre bate no mesmo offset (cache normal), e ele só muda
 * quando a janela vira — dando o efeito de "troca a cada 5 minutos" pra
 * todo mundo ao mesmo tempo, não um sorteio por visita.
 */
function windowOffset(total: number, slug: string): number {
  const maxOffset = Math.max(0, total - SAMPLE_PER_CATEGORY);
  if (maxOffset === 0) return 0;

  const window = Math.floor(Date.now() / SAMPLE_ROTATION_MS);
  let hash = window;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash % (maxOffset + 1);
}

/**
 * Carrega o que a página inicial mostra: todas as categorias com seus totais
 * e uma amostra real de entradas.
 *
 * A amostra existe para a primeira tela provar o que o acervo contém, em vez
 * de ser uma casca com vários links e nenhum conteúdo — e troca de recorte a
 * cada 5 minutos (`windowOffset`), para não travar sempre nos mesmos 12
 * verbetes. Precisa do total de cada categoria pra calcular o deslocamento,
 * por isso busca `categories` antes de `sample`, em vez de paralelo.
 */
async function loadHome(): Promise<HomeData> {
  const categories = await fetchCategories();
  const totalBySlug = new Map(categories.map((info) => [info.categoria, info.total]));

  const pages = await Promise.all(
    SAMPLE_CATEGORIES.map((slug) =>
      fetchEntryPage(slug, {
        limit: SAMPLE_PER_CATEGORY,
        offset: windowOffset(totalBySlug.get(slug) ?? 0, slug),
      }),
    ),
  );

  return { categories, sample: pages.flatMap((page) => page.itens) };
}

/**
 * A liturgia de hoje é conteúdo complementar da home, não o essencial dela
 * (isso são as categorias) — por isso busca à parte de `loadHome`, com sua
 * própria falha engolida: o banner some, mas a home inteira não quebra se
 * só a liturgia estiver indisponível (ver `LITURGIA_INDISPONIVEL` na API).
 */
async function loadLiturgia(): Promise<LiturgiaDiaria | null> {
  try {
    return await fetchLiturgiaDiaria();
  } catch (error: unknown) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

/**
 * O destaque só aparece com o verbete confirmado pela API: um link quebrado na
 * home é pior que uma faixa a menos. Como a liturgia, a falha aqui não derruba
 * a página.
 */
async function loadFeaturedSaint(): Promise<{ saint: SaintAsset; resumo: string } | null> {
  const saint = featuredSaint(new Date());
  try {
    const entry = await fetchEntry("santos", saint.slug);
    return { saint, resumo: entry.resumo };
  } catch (error: unknown) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

function sortByNavOrder(categories: CategoryInfo[]): CategoryInfo[] {
  const order = new Map(CATEGORY_SLUGS.map((slug, index) => [slug, index]));
  return [...categories].sort(
    (a, b) => (order.get(a.categoria) ?? 0) - (order.get(b.categoria) ?? 0),
  );
}

export default async function HomePage() {
  const liturgiaPromise = loadLiturgia();
  const featuredPromise = loadFeaturedSaint();
  // Falha da API sobe para `error.tsx`: com cache, a última home boa continua no
  // ar, em vez de uma mensagem de erro guardada e servida como 200.
  const data = await loadHome();

  const categories = sortByNavOrder(data.categories);
  const totalEntries = categories.reduce((sum, info) => sum + info.total, 0);
  const categoryBySlug = new Map(categories.map((info) => [info.categoria, info]));
  const [liturgia, featured] = await Promise.all([liturgiaPromise, featuredPromise]);
  const [nextLesson] = LESSONS;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(WEBSITE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(ORGANIZATION_JSON_LD) }}
      />

      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <section className="grid items-center gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div className="min-w-0">
            <p className="eyebrow">Consulta em {categories.length} categorias</p>
            <h1 className="mt-3 font-display text-title-lg text-ink md:text-title-xl">
              Uma busca só para todo o mundo católico.
            </h1>
            <p className="mt-5 max-w-xl text-lead text-ink-muted">
              Digite um nome, um tema ou um lugar: a busca cobre {totalEntries}{" "}
              entradas em {categories.length} categorias, com santos, orações, Catecismo,
              liturgia diária, papas, sacramentos e a Missa.
            </p>

            <div className="mt-7 max-w-xl">
              <SearchField variant="prominent" label="Buscar em todo o acervo" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="kicker">Experimente</span>
              {SUGGESTED_TERMS.map((term) => (
                <Link
                  key={term}
                  href={`/busca?q=${encodeURIComponent(term)}`}
                  className="rounded-edge border border-border bg-surface px-2.5 py-1 text-meta text-ink-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <GothicWindow className="mx-auto hidden w-full max-w-sm md:block" />
        </section>

        <section aria-labelledby="caminhos" className="border-t border-border py-10">
          <p className="eyebrow">Por onde começar</p>
          <h2 id="caminhos" className="mt-2 font-display text-title-lg text-ink">
            Dois caminhos, um só acervo.
          </h2>

          <div className="mt-6 grid overflow-hidden rounded-panel border border-border bg-surface md:grid-cols-2">
            <a
              href="#categorias"
              className="group flex flex-col gap-3 p-6 transition-colors hover:bg-canvas"
            >
              <span className="eyebrow">01 / Explorar</span>
              <span className="font-display text-title-md text-ink">Consultar a biblioteca</span>
              <span className="text-meta text-ink-muted">
                Leia explicações claras, com contexto e referências para aprofundar.
              </span>
              <span className="btn-tertiary mt-auto">
                Ver as categorias <span aria-hidden="true">→</span>
              </span>
            </a>
            <Link
              href="/academia"
              className="group flex flex-col gap-3 border-t border-border p-6 transition-colors hover:bg-canvas md:border-l md:border-t-0"
            >
              <span className="eyebrow">02 / Aprender</span>
              <span className="font-display text-title-md text-ink">Estudar com orientação</span>
              <span className="text-meta text-ink-muted">
                Aprenda em etapas, pratique e acompanhe o que compreendeu.
              </span>
              <span className="btn-tertiary mt-auto">
                Abrir a Academia da Fé <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {featured ? (
              <EditorialStrip
                eyebrow="Santo em destaque"
                title={featured.saint.name}
                description={featured.resumo}
                media={
                  <Image
                    src={featured.saint.avatar}
                    alt=""
                    width={96}
                    height={96}
                    className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
                  />
                }
              >
                <Link href={entryPath("santos", featured.saint.slug)} className="btn-tertiary">
                  Conhecer sua história <span aria-hidden="true">→</span>
                </Link>
              </EditorialStrip>
            ) : null}

            {nextLesson ? (
              <EditorialStrip
                eyebrow={`Academia da Fé · ${nextLesson.module}`}
                title={nextLesson.title}
                description={nextLesson.subtitle}
              >
                <LessonProgressLink slug={nextLesson.slug} />
              </EditorialStrip>
            ) : null}

            {liturgia ? (
              <EditorialStrip
                eyebrow={formatLiturgiaDate(liturgia.data)}
                title={liturgia.celebracao || "Liturgia do dia"}
                description={`${liturgia.cor_liturgica ? `${liturgia.cor_liturgica} · ` : ""}Evangelho: ${liturgia.evangelho.referencia} · 1ª leitura: ${liturgia.primeira_leitura.referencia}`}
              >
                <Link href="/liturgia-diaria" className="btn-tertiary">
                  Ler a liturgia de hoje <span aria-hidden="true">→</span>
                </Link>
              </EditorialStrip>
            ) : null}

            <EditorialStrip
              eyebrow="Oração"
              title="Acenda uma vela por quem você ama"
              description="Escolha entre Jesus, Nossa Senhora e outras devoções, escreva seu nome e uma intenção — ela entra para o mural de quem já passou por aqui rezando."
            >
              <Link href="/velas" className="btn-tertiary">
                Acender uma vela <span aria-hidden="true">→</span>
              </Link>
            </EditorialStrip>
          </div>
        </section>

        <OrnamentalDivider />

        <section aria-labelledby="categorias" className="scroll-mt-32 pb-6 pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="categorias" className="font-display text-title-md text-ink">
              Explore a fé
            </h2>
            <p className="kicker">{totalEntries} entradas</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CATEGORY_GROUPS.map((group) => {
              const total = group.slugs.reduce(
                (sum, slug) => sum + (categoryBySlug.get(slug)?.total ?? 0),
                0,
              );
              return (
                <section
                  key={group.title}
                  className="rounded-panel border border-border bg-surface p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-title-sm text-ink">{group.title}</h3>
                    <span className="kicker">{formatEntryCount(total)}</span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {group.slugs.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={categoryPath(slug)}
                          className="text-meta text-accent underline-offset-4 hover:underline"
                        >
                          {CATEGORY_LABELS[slug].nav}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <p className="mt-6">
            <a
              href="#todas-categorias"
              className="text-meta text-accent underline-offset-4 hover:underline"
            >
              Ver todas as {categories.length} categorias ↓
            </a>
          </p>
        </section>

        <OrnamentalDivider />

        <section aria-labelledby="amostra" className="pb-16">
          <h2 id="amostra" className="font-display text-title-md text-ink">
            Descubra algo novo
          </h2>
          <p className="mt-2 max-w-measure text-meta text-ink-muted">
            Uma seleção real do acervo para continuar sua leitura.
          </p>
          <EntryGrid entries={data.sample} />
        </section>

      </div>
    </div>
  );
}
