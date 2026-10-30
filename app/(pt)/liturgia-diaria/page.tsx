import type { Metadata } from "next";

import { Breadcrumbs, PageHeader, StatusMessage } from "@/components/Editorial";
import { LiturgiaView } from "@/components/LiturgiaView";
import { ApiError } from "@/lib/api";
import { formatLongDate, todayInBrazil } from "@/lib/liturgia";
import type { LiturgiaDiaria } from "@/lib/liturgiaSchemas";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";

// O dia muda à meia-noite: a página revalida a cada 5 minutos, e cada um dos dias
// vem pronto do banco da API, sem depender da fonte externa nesta hora.
export const revalidate = 300;

const FALLBACK_DESCRIPTION =
  "As leituras da Missa de hoje: primeira leitura, salmo responsorial, segunda leitura (aos domingos) e o evangelho do dia.";

async function loadToday(): Promise<LiturgiaDiaria | null> {
  try {
    return await fetchLiturgiaDiaria();
  } catch (error: unknown) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const liturgia = await loadToday();
  const isCurrent = liturgia !== null && !liturgia.desatualizada;
  const title = isCurrent
    ? `Liturgia Diária de hoje, ${formatLongDate(liturgia.data)} — Evangelho e Leituras`
    : "Liturgia Diária — Evangelho e Leituras";
  const description = liturgia
    ? `Evangelho do dia: ${liturgia.evangelho.referencia}. Leia a primeira leitura (${liturgia.primeira_leitura.referencia}), o salmo e o Evangelho da Missa${isCurrent ? " de hoje" : ""}.`
    : FALLBACK_DESCRIPTION;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/liturgia-diaria" },
    openGraph: { title, description, url: "/liturgia-diaria", images: ["/opengraph-image"] },
    // Só sem nenhuma liturgia salva: uma página sem leituras não deve ser indexada.
    robots: { index: liturgia !== null, follow: true },
  };
}

export default async function LiturgiaDiariaPage() {
  const liturgia = await loadToday();

  if (!liturgia) {
    return (
      <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
        <Breadcrumbs trail={[{ label: "Acervo", href: "/" }, { label: "Liturgia Diária" }]} />
        <PageHeader kicker="Liturgia" title="Liturgia Diária" description={FALLBACK_DESCRIPTION} />
        <div className="mt-10">
          <StatusMessage title="A liturgia não respondeu">
            <p>Recarregue a página em instantes. O restante do acervo continua aberto.</p>
          </StatusMessage>
        </div>
      </div>
    );
  }

  return <LiturgiaView title="Liturgia Diária" liturgia={liturgia} today={todayInBrazil()} />;
}
