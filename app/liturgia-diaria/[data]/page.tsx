import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LiturgiaView } from "@/components/LiturgiaView";
import { ApiError } from "@/lib/api";
import { formatLongDate, isServedLiturgyDate, todayInBrazil } from "@/lib/liturgia";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";

type Params = { data: string };

// Geradas sob demanda e guardadas em cache: as leituras de um dia não mudam.
export const revalidate = 86400;

export function generateStaticParams(): Params[] {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!isServedLiturgyDate(params.data, todayInBrazil())) return { title: "Liturgia Diária" };

  const path = `/liturgia-diaria/${params.data}`;
  const title = `Liturgia Diária de ${formatLongDate(params.data)} — Evangelho e Leituras`;
  let description = `Leituras da Missa de ${formatLongDate(params.data)}.`;
  try {
    const liturgia = await fetchLiturgiaDiaria(params.data);
    description = `Evangelho do dia: ${liturgia.evangelho.referencia}. Leia a primeira leitura (${liturgia.primeira_leitura.referencia}), o salmo e o Evangelho da Missa de ${formatLongDate(params.data)}.`;
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
  }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: ["/opengraph-image"] },
  };
}

export default async function LiturgiaDoDiaPage({ params }: { params: Params }) {
  const today = todayInBrazil();
  if (!isServedLiturgyDate(params.data, today)) notFound();

  // Falha da API sobe para `error.tsx` e responde 500: o Google tenta de novo, em
  // vez de indexar uma página de data sem as leituras.
  const liturgia = await fetchLiturgiaDiaria(params.data);

  return (
    <LiturgiaView
      title={`Liturgia de ${formatLongDate(params.data)}`}
      liturgia={liturgia}
      today={today}
    />
  );
}
