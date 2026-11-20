import Image from "next/image";
import Link from "next/link";

import { AssinarCalendario } from "@/components/AssinarCalendario";
import { SearchField } from "@/components/SearchField";
import { entryPath } from "@/lib/categories";
import { imagePosition } from "@/lib/entryDisplay";
import { liturgicalColorHex, trechoDoEvangelho } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { saintAssetFor } from "@/lib/saintAssets";
import { formatDayMonth, type SaintOfDay } from "@/lib/santoDoDia";
import { tempoLiturgicoRotulo } from "@/lib/tempoLiturgico";

/** Tamanho do trecho do Evangelho no topo: umas três linhas, o bastante para fisgar. */
const TRECHO = 230;

function SantoDestaque({ saint }: { saint: SaintOfDay }) {
  const asset = saintAssetFor(saint.saint);
  const imagem = asset?.portrait ?? saint.saint.imagem;
  const href = entryPath("santos", saint.saint.slug);

  return (
    <article className="overflow-hidden rounded-panel border border-border bg-surface">
      {imagem ? (
        <Link href={href} className="relative block aspect-[4/3] bg-canvas sm:aspect-[5/4]" tabIndex={-1} aria-hidden="true">
          <Image
            src={imagem}
            alt=""
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover"
            style={{ objectPosition: asset ? "top" : imagePosition(saint.saint) }}
            priority
          />
        </Link>
      ) : null}
      <div className="p-5">
        <p className="eyebrow">
          {saint.isToday ? "Santo do dia" : `Próxima festa · ${formatDayMonth(saint.date)}`}
        </p>
        <h2 className="mt-2 font-display text-title-md text-ink">
          <Link href={href} className="hover:text-accent">
            {saint.saint.titulo}
          </Link>
        </h2>
        <p className="mt-2 text-meta text-ink-muted">{saint.saint.resumo}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <Link href={href} className="btn-tertiary">
            Conhecer sua história <span aria-hidden="true">→</span>
          </Link>
          <Link href="/santo-do-dia" className="btn-tertiary">
            Festas da semana <span aria-hidden="true">→</span>
          </Link>
          <AssinarCalendario compacto />
        </div>
      </div>
    </article>
  );
}

/**
 * Topo da home: o que a Igreja vive hoje (o tempo litúrgico, o Evangelho e o santo),
 * com a busca logo abaixo. Muda todo dia, para quem volta amanhã encontrar algo novo.
 * Sem liturgia nem santo (API fora), sobra a busca, que é o que o acervo precisa.
 */
export function HomeHero({
  dateLabel,
  today,
  liturgia,
  saint,
  totalEntries,
  totalCategories,
  suggestedTerms,
}: {
  dateLabel: string;
  today: string;
  liturgia: LiturgiaDiaria | null;
  saint: SaintOfDay | null;
  totalEntries: number;
  totalCategories: number;
  suggestedTerms: readonly string[];
}) {
  const cor = liturgia?.cor_liturgica ?? null;
  const corHex = liturgicalColorHex(cor);

  return (
    <section
      className={`grid gap-8 py-10 md:py-16 ${saint ? "md:grid-cols-[1.15fr_0.85fr] md:items-start" : ""}`}
    >
      <div className="min-w-0">
        <p className="eyebrow flex flex-wrap items-center gap-x-2">
          <span>{dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{tempoLiturgicoRotulo(today)}</span>
          {corHex ? (
            <span
              title={`Cor litúrgica: ${cor?.toLowerCase()}`}
              className="inline-block h-2.5 w-2.5 rounded-full border border-border"
              style={{ backgroundColor: corHex }}
            />
          ) : null}
        </p>

        {liturgia ? (
          <>
            <h1 className="mt-3 font-display text-title-lg text-ink md:text-title-xl">
              O Evangelho de hoje
            </h1>
            <blockquote className="mt-5 max-w-xl border-l-2 border-gold pl-5">
              <p className="font-display text-title-sm leading-relaxed text-ink">
                {trechoDoEvangelho(liturgia.evangelho.texto, TRECHO)}
              </p>
              <footer className="mt-2 text-meta text-ink-muted">{liturgia.evangelho.referencia}</footer>
            </blockquote>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/liturgia-diaria" data-evento="liturgy_opened" className="btn btn-primary">
                Rezar com o Evangelho de hoje
              </Link>
              {liturgia.celebracao ? (
                <span className="text-meta text-ink-muted">{liturgia.celebracao}</span>
              ) : null}
            </div>
          </>
        ) : (
          <h1 className="mt-3 font-display text-title-lg text-ink md:text-title-xl">
            Uma busca só para todo o mundo católico.
          </h1>
        )}

        <div className="mt-9 max-w-xl">
          <p className="kicker">
            Busque em {totalEntries} entradas de {totalCategories} categorias
          </p>
          <div className="mt-2">
            <SearchField variant="prominent" label="Buscar em todo o acervo" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="kicker">Experimente</span>
            {suggestedTerms.map((term) => (
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
      </div>

      {saint ? <SantoDestaque saint={saint} /> : null}
    </section>
  );
}
