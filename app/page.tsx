import Image from "next/image";
import Link from "next/link";

import { EntryGrid } from "@/components/EntryGrid";
import { OrnamentalDivider } from "@/components/OrnamentalDivider";
import { SearchField } from "@/components/SearchField";
import { StatusMessage } from "@/components/Editorial";
import { ApiError, getApiBaseUrl, getErrorMessage } from "@/lib/api";
import { CATEGORY_LABELS, categoryPath } from "@/lib/categories";
import { PRIMARY_CATEGORY_SLUGS } from "@/lib/categoryGroups";
import { formatEntryCount } from "@/lib/entryDisplay";
import { safeJsonLd } from "@/lib/jsonLd";
import { formatLiturgiaDate } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { CATEGORY_SLUGS, type CategoryInfo, type Entry } from "@/lib/schemas";
import { fetchCategories, fetchEntryPage } from "@/lib/services/acervoService";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import { SANTO_GUARDIAO_URL, SITE_NAME, SITE_URL } from "@/lib/site";
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

      {/* As duas colunas cobrem a altura da página inteira (herói até o
          fim de "Do acervo", logo antes do rodapé), não só o herói — por
          isso vivem aqui fora, num wrapper que envolve tudo, com
          `inset-y-0` de propósito: a altura desse wrapper é "auto" (dada
          pelo conteúdo normal em fluxo), e a foto absoluta acompanha esse
          tanto, seja qual for. Mesma foto nos dois lados (espelhada à
          esquerda) porque é arquitetura repetitiva (nave de igreja, banco
          após banco) — corta bem em qualquer altura de recorte, ao
          contrário de um objeto único (um ostensório, um rosto) que fica
          estranho cortado no meio. Esmaece em gradiente pro pergaminho
          antes de chegar na coluna de leitura central. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[20%] xl:block"
      >
        <Image
          src="/img-acervo/ig-nave-basilica.jpg"
          alt=""
          fill
          sizes="20vw"
          className="scale-x-[-1] object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#4E1620]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-0% to-parchment to-60%" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] xl:block"
      >
        <Image
          src="/img-acervo/ig-nave-basilica.jpg"
          alt=""
          fill
          sizes="20vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#4E1620]/40" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent from-0% to-parchment to-60%" />
      </div>

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
            <div className="mt-10 flex flex-col items-start gap-6 rounded-edge border border-gold bg-parchment-raised p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-measure">
                <p className="kicker text-bordeaux">{formatLiturgiaDate(liturgia.data)}</p>
                <h2 className="mt-2 font-display text-title-sm text-ink">
                  {liturgia.celebracao || "Liturgia do dia"}
                </h2>
                <p className="mt-2 text-meta text-ink-muted">
                  Evangelho: {liturgia.evangelho.referencia}
                </p>
              </div>
              <Link
                href="/liturgia-diaria"
                className="shrink-0 rounded-edge border border-bordeaux bg-bordeaux px-5 py-2.5 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft"
              >
                📖 Ler a liturgia de hoje →
              </Link>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col items-start gap-6 rounded-edge border border-bordeaux bg-parchment-raised p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={VELA_IMAGEM}
                alt=""
                aria-hidden="true"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-edge border-2 border-parchment-raised object-cover"
              />
              <div className="max-w-measure">
                <p className="kicker text-bordeaux">Oração</p>
                <h2 className="mt-2 font-display text-title-sm text-ink">
                  Acenda uma vela por quem você ama
                </h2>
                <p className="mt-2 text-meta text-ink-muted">
                  Escolha entre Jesus, Nossa Senhora e outras devoções, escreva
                  seu nome e uma intenção — ela entra para o mural de quem já
                  passou por aqui rezando.
                </p>
              </div>
            </div>
            <Link
              href="/velas"
              className="shrink-0 rounded-edge border border-bordeaux bg-bordeaux px-5 py-2.5 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft"
            >
              🕯️ Acender uma vela →
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
              Comece por aqui
            </h2>
            <p className="kicker">{totalEntries} entradas</p>
          </div>

          {/* Vitrine, não índice: as 49 categorias já moram inteiras e
              agrupadas por assunto no rodapé de toda página — repeti-las
              aqui era o mesmo conteúdo duas vezes na mesma tela de rolagem.
              Aqui ficam só as mais buscadas (mesmo recorte do menu do
              cabeçalho), como ponto de partida, com um link só para quem
              quer a lista inteira. */}
          <ul className="mt-6 flex flex-wrap gap-3">
            {PRIMARY_CATEGORY_SLUGS.map((slug) => {
              const info = categoryBySlug.get(slug);
              return (
                <li key={slug}>
                  <Link
                    href={categoryPath(slug)}
                    className="group flex items-center gap-2 rounded-edge border border-rule-faint bg-parchment-raised px-4 py-2.5 transition-colors hover:border-bordeaux"
                  >
                    <span className="font-display text-body text-ink group-hover:text-bordeaux">
                      {CATEGORY_LABELS[slug].nav}
                    </span>
                    {info ? (
                      <span className="text-meta text-ink-muted">
                        {formatEntryCount(info.total)}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

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
          <div className="flex flex-col items-start gap-6 rounded-edge border border-gold bg-parchment-raised p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-measure">
              <p className="kicker text-bordeaux">Plataforma irmã</p>
              <h2 className="mt-2 font-display text-title-sm text-ink">
                Quer viver a fé na prática, não só consultar?
              </h2>
              <p className="mt-2 text-meta text-ink-muted">
                No Santo Guardião você escolhe um santo de devoção e cumpre
                desafios e missões — orações, estudo e caridade — para crescer
                na fé em forma de jogo.
              </p>
            </div>
            <a
              href={SANTO_GUARDIAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-edge border border-bordeaux bg-bordeaux px-5 py-2.5 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft"
            >
              Conhecer o Santo Guardião →
            </a>
          </div>
        </section>

        <section aria-labelledby="amostra" className="pb-16">
          <div className="border-b-2 border-gold pb-2">
            <h2 id="amostra" className="font-display text-title-md text-ink">
              Do acervo
            </h2>
          </div>
          <EntryGrid entries={data.sample} />
        </section>
      </div>
    </div>
  );
}
