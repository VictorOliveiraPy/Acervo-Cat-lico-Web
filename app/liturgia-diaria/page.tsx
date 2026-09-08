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
 * Uma seção de leitura: referência (livro/capítulo) e o texto, no mesmo
 * estilo de citação usado pelas orações do acervo (`PrayerText`).
 */
function Leitura({
  rotulo,
  leitura,
}: {
  rotulo: string;
  leitura: LeituraLiturgica;
}) {
  return (
    <section aria-labelledby={`leitura-${rotulo}`} className="border-t border-rule-faint pt-8">
      <p id={`leitura-${rotulo}`} className="kicker text-bordeaux">
        {rotulo}
      </p>
      <p className="mt-1 text-meta text-ink-muted">{leitura.referencia}</p>
      <div className="mt-4">
        <PrayerText texto={leitura.texto} />
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
            <Leitura rotulo="Salmo responsorial" leitura={liturgia.salmo} />
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
