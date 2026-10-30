import Image from "next/image";
import Link from "next/link";

import { entryPath } from "@/lib/categories";
import { imagePosition } from "@/lib/entryDisplay";
import { liturgicalColorHex, liturgicalSeason } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { saintAssetFor } from "@/lib/saintAssets";
import { formatDayMonth, type SaintOfDay } from "@/lib/santoDoDia";

function HojeCard({
  label,
  title,
  children,
  media,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  media?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-panel border border-border bg-surface p-5">
      {media}
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <h3 className="mt-2 font-display text-title-sm text-ink">{title}</h3>
        <div className="mt-1 text-meta text-ink-muted">{children}</div>
      </div>
    </div>
  );
}

/**
 * O que a Igreja celebra hoje, logo abaixo da busca. Liturgia velha não aparece:
 * este bloco afirma que é a de hoje, e uma leitura de outro dia seria um erro.
 */
export function HojeBlock({
  dateLabel,
  liturgia,
  saint,
}: {
  dateLabel: string;
  liturgia: LiturgiaDiaria | null;
  saint: SaintOfDay | null;
}) {
  if (!liturgia && !saint) return null;

  const season = liturgia ? liturgicalSeason(liturgia.celebracao) : null;
  const color = liturgia ? liturgicalColorHex(liturgia.cor_liturgica) : null;
  const saintAsset = saint ? saintAssetFor(saint.saint) : null;
  const saintImage = saintAsset?.avatar ?? saint?.saint.imagem;

  return (
    <section aria-labelledby="hoje" className="border-t border-border py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id="hoje" className="font-display text-title-md text-ink">
          Hoje
        </h2>
        <p className="kicker">{dateLabel}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {liturgia ? (
          <HojeCard label="Liturgia de hoje" title={`Evangelho: ${liturgia.evangelho.referencia}`}>
            {liturgia.celebracao ? <p>{liturgia.celebracao}</p> : null}
            <Link href="/liturgia-diaria" className="btn-tertiary mt-2">
              Ler as leituras <span aria-hidden="true">→</span>
            </Link>
          </HojeCard>
        ) : null}

        {saint ? (
          <HojeCard
            label={saint.isToday ? "Santo do dia" : `Próxima festa: ${formatDayMonth(saint.date)}`}
            title={saint.saint.titulo}
            media={
              saintImage ? (
                <Image
                  src={saintImage}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                  style={{ objectPosition: saintAsset ? "top" : imagePosition(saint.saint) }}
                />
              ) : undefined
            }
          >
            <div className="flex flex-wrap gap-x-4">
              <Link href={entryPath("santos", saint.saint.slug)} className="btn-tertiary mt-2">
                Conhecer sua história <span aria-hidden="true">→</span>
              </Link>
              <Link href="/santo-do-dia" className="btn-tertiary mt-2">
                Festas da semana <span aria-hidden="true">→</span>
              </Link>
            </div>
          </HojeCard>
        ) : null}

        {liturgia && (season || liturgia.cor_liturgica) ? (
          <HojeCard label="Tempo litúrgico" title={season ?? liturgia.celebracao ?? "Hoje"}>
            {liturgia.cor_liturgica ? (
              <p className="flex items-center gap-2">
                {color ? (
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ) : null}
                Cor litúrgica: {liturgia.cor_liturgica.toLowerCase()}
              </p>
            ) : null}
          </HojeCard>
        ) : null}
      </div>
    </section>
  );
}
