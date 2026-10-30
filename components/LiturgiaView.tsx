import Link from "next/link";

import { Breadcrumbs, PageHeader, PrayerText } from "@/components/Editorial";
import {
  formatLiturgiaDate,
  formatLongDate,
  liturgicalColorHex,
  neighborLiturgyDates,
} from "@/lib/liturgia";
import type { LeituraLiturgica, LiturgiaDiaria } from "@/lib/liturgiaSchemas";

/**
 * Número de versículo colado na palavra seguinte, do jeito que a fonte
 * entrega ("19E disse..."). Numa leitura longa isso vira parede de texto. O
 * corte do split é logo antes de cada número (lookahead, não consome a letra
 * seguinte), então o array alterna [texto, número, texto, número, ...].
 */
const VERSE_NUMBER_RE = /(\d+)(?=[A-ZÀÁÂÃÇÉÊÍÓÔÕÚ"'«a-záàâãçéêíóôõú])/g;

/** Texto de uma leitura bíblica, com os números de versículo em sobrescrito. */
function VerseText({ texto }: { texto: string }) {
  const partes = texto.split(VERSE_NUMBER_RE);
  return (
    <p className="max-w-measure font-display text-[1.25rem] leading-[2.05rem] text-ink">
      {partes.map((parte, index) =>
        index % 2 === 1 ? (
          <sup key={index} className="mr-0.5 font-display text-meta font-semibold text-accent">
            {parte}
          </sup>
        ) : (
          <span key={index}>{parte}</span>
        ),
      )}
    </p>
  );
}

function Leitura({
  rotulo,
  leitura,
  variant = "prosa",
}: {
  rotulo: string;
  leitura: LeituraLiturgica;
  variant?: "prosa" | "salmo";
}) {
  return (
    <section aria-labelledby={`leitura-${rotulo}`} className="border-t border-border pt-8">
      <h2 id={`leitura-${rotulo}`} className="eyebrow">
        {rotulo}
      </h2>
      <p className="mt-1 text-meta text-ink-muted">{leitura.referencia}</p>
      <div className="mt-4">
        {variant === "salmo" ? <PrayerText texto={leitura.texto} /> : <VerseText texto={leitura.texto} />}
      </div>
    </section>
  );
}

/** As leituras de um dia, igual em `/liturgia-diaria` e `/liturgia-diaria/[data]`. */
export function LiturgiaView({
  title,
  liturgia,
  today,
}: {
  title: string;
  liturgia: LiturgiaDiaria;
  today: string;
}) {
  const { previous, next } = neighborLiturgyDates(liturgia.data, today);

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: "Liturgia Diária" }]} />

      <PageHeader
        kicker="Liturgia"
        title={title}
        description={`${formatLiturgiaDate(liturgia.data)}${liturgia.celebracao ? ` · ${liturgia.celebracao}` : ""}`}
      />

      {liturgia.desatualizada ? (
        <p role="status" className="mt-4 text-meta text-warning">
          A liturgia de hoje ainda não está disponível. Mostrando a de {formatLongDate(liturgia.data)}.
        </p>
      ) : null}

      {liturgia.cor_liturgica ? (
        <p className="mt-4 flex items-center gap-2 text-meta text-ink-muted">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full border border-border"
            style={{ backgroundColor: liturgicalColorHex(liturgia.cor_liturgica) ?? "transparent" }}
          />
          Cor litúrgica: {liturgia.cor_liturgica}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-8">
        <Leitura rotulo="Primeira leitura" leitura={liturgia.primeira_leitura} />
        <Leitura rotulo="Salmo responsorial" leitura={liturgia.salmo} variant="salmo" />
        {liturgia.segunda_leitura ? (
          <Leitura rotulo="Segunda leitura" leitura={liturgia.segunda_leitura} />
        ) : null}
        <Leitura rotulo="Evangelho" leitura={liturgia.evangelho} />
      </div>

      <nav aria-label="Outros dias" className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {previous ? (
          <Link href={`/liturgia-diaria/${previous}`} rel="prev" className="btn btn-secondary">
            <span aria-hidden="true">←</span> Dia anterior
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/liturgia-diaria/${next}`} rel="next" className="btn btn-secondary">
            Próximo dia <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </nav>

      <p className="mt-10 border-t border-border pt-4 text-meta text-ink-muted">
        Fonte: {liturgia.fonte}. Para uso litúrgico oficial na Missa, consulte sempre o Lecionário
        aprovado pela Conferência Episcopal.
      </p>
    </div>
  );
}
