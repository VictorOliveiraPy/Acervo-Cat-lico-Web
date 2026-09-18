import Link from "next/link";

import { EntryGrid } from "@/components/EntryGrid";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { PhotoBanner } from "@/components/PhotoBanner";
import { SearchField } from "@/components/SearchField";
import { StatusMessage } from "@/components/Editorial";
import { ApiError, getApiBaseUrl, getErrorMessage } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { CATEGORY_GROUPS } from "@/lib/categoryGroups";
import { formatEntryCount } from "@/lib/entryDisplay";
import { safeJsonLd } from "@/lib/jsonLd";
import { formatLiturgiaDate } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { CATEGORY_SLUGS, type CategoryInfo, type Entry } from "@/lib/schemas";
import { fetchCategories, fetchEntryPage } from "@/lib/services/acervoService";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import { INSTAGRAM_URL, SANTO_GUARDIAO_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import { VELA_IMAGEM } from "@/lib/velas";

// Regenera a home (com um sorteio novo pra "Do acervo") a cada 5 minutos —
// o mesmo intervalo padrão de cache das leituras da API (`DEFAULT_REVALIDATE_
// SECONDS` em `lib/api.ts`), pra não ficar pedindo dado novo mais rápido do
// que o resto do site já considera "atual".
export const revalidate = 300;

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
 * colunas em 3 linhas cheias, no estilo mosaico da referência. */
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

function sortByNavOrder(categories: CategoryInfo[]): CategoryInfo[] {
  const order = new Map(CATEGORY_SLUGS.map((slug, index) => [slug, index]));
  return [...categories].sort(
    (a, b) => (order.get(a.categoria) ?? 0) - (order.get(b.categoria) ?? 0),
  );
}

export default async function HomePage() {
  let data: HomeData;
  const liturgiaPromise = loadLiturgia();
  try {
    data = await loadHome();
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    return (
      <div className="mx-auto max-w-shell px-4 py-12 sm:px-6">
        <StatusMessage title="O acervo não respondeu" tone="error">
          <p>{getErrorMessage(error)}</p>
          <p className="mt-3">
            Confira se a API está no ar em{" "}
            <code className="text-ink">{getApiBaseUrl()}</code> e
            recarregue a página.
          </p>
        </StatusMessage>
      </div>
    );
  }

  const categories = sortByNavOrder(data.categories);
  const totalEntries = categories.reduce((sum, info) => sum + info.total, 0);
  const categoryBySlug = new Map(categories.map((info) => [info.categoria, info]));
  const liturgia = await liturgiaPromise;

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(WEBSITE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(ORGANIZATION_JSON_LD) }}
      />

      <section>
        <div className="relative mx-auto max-w-shell px-4 py-12 sm:px-6 md:py-16">
          <p className="kicker">Consulta em {categories.length} categorias</p>
          <h1 className="mt-3 max-w-measure font-display text-title-lg text-ink md:text-title-xl">
            Uma busca só para todo o mundo católico.
          </h1>
          <p className="mt-5 max-w-measure text-lead text-ink-muted">
            Digite um nome, um tema ou um lugar: a busca cobre {totalEntries}{" "}
            entradas em {categories.length} categorias — de santos e papas a
            pecados, orações e a Missa.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchField variant="prominent" label="Buscar em todo o acervo" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="kicker">Experimente</span>
            {SUGGESTED_TERMS.map((term) => (
              <Link
                key={term}
                href={`/busca?q=${encodeURIComponent(term)}`}
                className="rounded-edge border border-rule-faint bg-parchment-raised px-2.5 py-1 text-meta text-ink-muted transition-colors hover:border-bordeaux hover:text-bordeaux"
              >
                {term}
              </Link>
            ))}
          </div>

          {liturgia ? (
            <div className="mt-10">
              <PhotoBanner
                image="/img-acervo/ig-missal-velas.jpg"
                kicker={formatLiturgiaDate(liturgia.data)}
                title={liturgia.celebracao || "Liturgia do dia"}
                description={`${liturgia.cor_liturgica ? `${liturgia.cor_liturgica} · ` : ""}Evangelho: ${liturgia.evangelho.referencia} · 1ª leitura: ${liturgia.primeira_leitura.referencia}`}
              >
                <Link
                  href="/liturgia-diaria"
                  className="shrink-0 rounded-edge border border-parchment-raised bg-parchment px-5 py-2.5 text-label uppercase tracking-[0.09em] text-ink transition-colors hover:bg-parchment-raised"
                >
                  📖 Ler a liturgia de hoje →
                </Link>
              </PhotoBanner>
            </div>
          ) : null}

          <div className="mt-6">
            <PhotoBanner
              image={VELA_IMAGEM}
              kicker="Oração"
              title="Acenda uma vela por quem você ama"
              description="Escolha entre Jesus, Nossa Senhora e outras devoções, escreva seu nome e uma intenção — ela entra para o mural de quem já passou por aqui rezando."
            >
              <Link
                href="/velas"
                className="shrink-0 rounded-edge border border-parchment-raised bg-parchment px-5 py-2.5 text-label uppercase tracking-[0.09em] text-ink transition-colors hover:bg-parchment-raised"
              >
                🕯️ Acender uma vela →
              </Link>
            </PhotoBanner>
          </div>

          <div className="mt-6 flex flex-col gap-3 border border-rule-faint bg-parchment-raised p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="kicker text-bordeaux">Pergunte ao acervo</p>
              <p className="mt-1 max-w-measure text-meta text-ink-muted">
                Não sabe por onde começar? Faça uma pergunta e receba uma resposta com fontes do acervo.
              </p>
            </div>
            <Link
              href="/perguntar"
              className="shrink-0 text-label uppercase tracking-[0.09em] text-bordeaux underline-offset-4 hover:underline"
            >
              Fazer uma pergunta →
            </Link>
          </div>
        </div>
      </section>

      <OrnamentalDivider />

      {/* `relative`: sem isso, essa div (estática) pinta ATRÁS das duas
          colunas de foto (`position: absolute`) na zona onde se sobrepõem
          em telas entre ~1280px e ~2000px de largura — a regra do CSS é que
          elemento posicionado sempre pinta por cima de estático, não importa
          a ordem no DOM. O bloco do herói já funcionava por acaso (a div
          dele também é `relative`); esse aqui não era, e a foto cobria o
          início do índice de categorias. */}
      <div className="relative mx-auto max-w-shell px-4 sm:px-6">
        {/* `pb-6`, não `pb-12` como as demais seções: o conteúdo aqui é só
            uma vitrine curta (7 chips + 1 link) desde que o índice completo
            foi pro rodapé — com o mesmo respiro pesado de uma seção cheia,
            sobrava um vão vazio grande antes do próximo divisor. */}
        <section aria-labelledby="categorias" className="pt-12 pb-6">
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
                  className="border border-rule-faint bg-parchment-raised p-5"
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
                          className="text-meta text-bordeaux underline-offset-4 hover:underline"
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
              className="text-meta text-bordeaux underline-offset-4 hover:underline"
            >
              Ver todas as {categories.length} categorias ↓
            </a>
          </p>
        </section>

        <OrnamentalDivider />

        <section className="py-12">
          <PhotoBanner
            image="/img-acervo/ig-terezinha-estatua.jpg"
            imagePosition="top"
            kicker="Plataforma irmã"
            title="Quer viver a fé na prática, não só consultar?"
            description="No Santo Guardião você escolhe um santo de devoção e cumpre desafios e missões — orações, estudo e caridade — para crescer na fé em forma de jogo."
          >
            <a
              href={SANTO_GUARDIAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-edge border border-gold bg-parchment px-5 py-2.5 text-label uppercase tracking-[0.09em] text-ink transition-colors hover:bg-parchment-raised"
            >
              Conhecer o Santo Guardião →
            </a>
          </PhotoBanner>
        </section>

        <section aria-labelledby="amostra" className="pb-16">
          <div className="border-b-2 border-gold pb-2">
            <h2 id="amostra" className="font-display text-title-md text-ink">
              Descubra algo novo
            </h2>
            <p className="mt-2 max-w-measure text-meta text-ink-muted">
              Uma seleção real do acervo para continuar sua leitura.
            </p>
          </div>
          <EntryGrid entries={data.sample} />
        </section>
      </div>
    </div>
  );
}
