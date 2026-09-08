import type { Metadata } from "next";

import { Breadcrumbs, PageHeader, PrayerText, StatusMessage } from "@/components/Editorial";
import { ApiError, getErrorMessage } from "@/lib/api";
import { formatLiturgiaDate, liturgicalColorHex } from "@/lib/liturgia";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import type { LeituraLiturgica, LiturgiaDiaria } from "@/lib/liturgiaSchemas";

const TITLE = "Liturgia Diária";
const DESCRIPTION =
  "As leituras da Missa de hoje: primeira leitura, salmo responsorial, segunda leitura (aos domingos) e o evangelho do dia — atualizadas todo dia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/liturgia-diaria" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/liturgia-diaria" },
  // Conteúdo do dia, sem valor de arquivo depois que passa — não faz
  // sentido indexar uma versão velha desta página nos resultados de busca.
  robots: { index: false, follow: true },
};

/**
 * Número de versículo colado na palavra seguinte, do jeito que a fonte
 * manda ("2Abraão gerou Isaac"): em textos curtos (uma oração, um salmo)
 * isso nem se nota, mas numa leitura longa — a genealogia de Mateus 1 tem
 * 16 versículos seguidos — vira parede de texto ilegível. O corte do split
 * é logo antes de cada número (lookahead, não consome a letra seguinte),
 * então o array alterna [texto, número, texto, número, ...].
 */
const VERSE_NUMBER_RE = /(\d+)(?=[A-ZÀÁÂÃÇÉÊÍÓÔÕÚ"'«])/g;

/** Texto de uma leitura bíblica, com os números de versículo destacados
 * como índice sobrescrito — mesma convenção de qualquer Bíblia impressa. */
function VerseText({ texto }: { texto: string }) {
  const partes = texto.split(VERSE_NUMBER_RE);
  return (
    <p className="max-w-measure text-body leading-loose text-ink">
      {partes.map((parte, index) =>
        index % 2 === 1 ? (
          <sup key={index} className="mr-0.5 font-display text-meta font-semibold text-bordeaux">
            {parte}
          </sup>
        ) : (
          <span key={index}>{parte}</span>
        ),
      )}
    </p>
  );
}

/**
 * Uma seção de leitura: referência (livro/capítulo) e o texto. O salmo usa
 * `PrayerText` (já quebra linha por verso, curto o bastante pra itálico não
 * atrapalhar); as leituras em prosa — mais longas, às vezes uma genealogia
 * inteira — usam `VerseText`, sem itálico e com os versículos numerados.
 */
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
    <section aria-labelledby={`leitura-${rotulo}`} className="border-t border-rule-faint pt-8">
      <p id={`leitura-${rotulo}`} className="kicker text-bordeaux">
        {rotulo}
      </p>
      <p className="mt-1 text-meta text-ink-muted">{leitura.referencia}</p>
      <div className="mt-4">
        {variant === "salmo" ? <PrayerText texto={leitura.texto} /> : <VerseText texto={leitura.texto} />}
      </div>
    </section>
  );
}

export default async function LiturgiaDiariaPage() {
  let liturgia: LiturgiaDiaria | null = null;
  let loadError: ApiError | null = null;
  try {
    liturgia = await fetchLiturgiaDiaria();
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    loadError = error;
  }

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: TITLE }]} />

      {liturgia ? (
        <>
          <PageHeader
            kicker={formatLiturgiaDate(liturgia.data)}
            title={liturgia.celebracao || "Liturgia do dia"}
          />

          {liturgia.cor_liturgica ? (
            <p className="mt-4 flex items-center gap-2 text-meta text-ink-muted">
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-full border border-rule-faint"
                style={{
                  backgroundColor: liturgicalColorHex(liturgia.cor_liturgica) ?? "transparent",
                }}
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

          <p className="mt-10 border-t border-rule-faint pt-4 text-meta text-ink-muted">
            Fonte: {liturgia.fonte}. Para uso litúrgico oficial na Missa, consulte
            sempre o Lecionário aprovado pela Conferência Episcopal.
          </p>
        </>
      ) : (
        <>
          <PageHeader kicker="Todo dia, um evangelho novo" title={TITLE} description={DESCRIPTION} />
          <div className="mt-10">
            <StatusMessage title="A liturgia de hoje não respondeu" tone="error">
              <p>{loadError ? getErrorMessage(loadError) : "Erro inesperado."}</p>
              <p className="mt-3">Recarregue a página em instantes.</p>
            </StatusMessage>
          </div>
        </>
      )}
    </div>
  );
}
