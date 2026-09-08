import Image from "next/image";
import Link from "next/link";

import { CategoryCard } from "@/components/CategoryCard";
import { EntryList } from "@/components/EntryList";
import { SearchField } from "@/components/SearchField";
import { StatusMessage } from "@/components/Editorial";
import { ApiError, getApiBaseUrl, getErrorMessage } from "@/lib/api";
import { safeJsonLd } from "@/lib/jsonLd";
import { formatLiturgiaDate } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { CATEGORY_SLUGS, type CategoryInfo, type Entry } from "@/lib/schemas";
import { fetchCategories, fetchEntryPage } from "@/lib/services/acervoService";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import { SANTO_GUARDIAO_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import { VELA_TIPOS } from "@/lib/velas";

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

type HomeData = {
  categories: CategoryInfo[];
  sample: Entry[];
};

/**
 * Carrega o que a página inicial mostra: todas as categorias com seus totais
 * e uma amostra real de entradas.
 *
 * A amostra existe para a primeira tela provar o que o acervo contém, em vez de
 * ser uma casca com vários links e nenhum conteúdo.
 */
async function loadHome(): Promise<HomeData> {
  const [categories, ...pages] = await Promise.all([
    fetchCategories(),
    ...SAMPLE_CATEGORIES.map((slug) => fetchEntryPage(slug, { limit: 2 })),
  ]);

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
  const liturgia = await liturgiaPromise;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(WEBSITE_JSON_LD) }}
      />

      {/* Herói fora do `max-w-shell`: as fotos encostam nas bordas da tela
          (só em telas largas — em mobile viram só a moldura bordô de
          sempre) pra dar "cara de catálogo religioso", não de app genérico.
          Cada coluna lateral empilha duas imagens (foto no topo, a ilustração
          dos santos embaixo, contínuas — sem vão entre elas) e cobre a
          altura toda do bloco (herói + liturgia do dia + acender uma vela),
          não só o herói, pra moldura acompanhar a página descendo. Cada
          imagem esmaece em direção ao centro com um gradiente pro
          pergaminho, então a leitura continua isolada numa coluna clara no
          meio — a foto emoldura, não compete com o texto. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[20%] flex-col xl:flex"
        >
          <div className="relative flex-[3]">
            <Image
              src="/img-acervo/basilica-de-sao-pedro.jpg"
              alt=""
              fill
              sizes="20vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#4E1620]/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-parchment" />
          </div>
          <div className="relative flex-[2]">
            <Image
              src="/img-acervo/santos-margem-decorativa.jpg"
              alt=""
              fill
              sizes="20vw"
              className="scale-x-[-1] object-cover object-top"
            />
            {/* funde a costura com a foto de cima (que já leva o mesmo tom) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#4E1620]/45 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-parchment" />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] flex-col xl:flex"
        >
          <div className="relative flex-[3]">
            <Image
              src="/img-acervo/ig-monstrancia-sunburst.jpg"
              alt=""
              fill
              sizes="20vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#4E1620]/35" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-parchment" />
          </div>
          <div className="relative flex-[2]">
            <Image
              src="/img-acervo/santos-margem-decorativa.jpg"
              alt=""
              fill
              sizes="20vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#4E1620]/45 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-parchment" />
          </div>
        </div>

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
              <div className="flex shrink-0 -space-x-3">
                {VELA_TIPOS.slice(0, 3).map((item) => (
                  <Image
                    key={item.tipo}
                    src={item.imagem}
                    alt=""
                    aria-hidden="true"
                    width={56}
                    height={56}
                    className="h-12 w-12 rounded-edge border-2 border-parchment-raised object-cover"
                  />
                ))}
              </div>
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

      <div className="mx-auto max-w-shell px-4 sm:px-6">
        <section aria-labelledby="categorias" className="border-t border-rule-faint py-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="categorias" className="font-display text-title-md text-ink">
              Percorrer por categoria
            </h2>
            <p className="kicker">{totalEntries} entradas</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((info) => (
              <CategoryCard key={info.categoria} info={info} />
            ))}
          </div>
        </section>

        <section className="border-t border-rule-faint py-12">
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
          <EntryList entries={data.sample} showCategory />
        </section>
      </div>
    </>
  );
}
