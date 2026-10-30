import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, StatusMessage } from "@/components/Editorial";
import { ApiError } from "@/lib/api";
import { fetchRanking, type RankingRow } from "@/lib/services/perfilService";

export const metadata: Metadata = {
  title: "Ranking da Academia",
  description: "Quem mais concluiu lições da Academia da Fé.",
  alternates: { canonical: "/ranking" },
  robots: { index: false, follow: true },
};

// Sem prerender: o build do site não pode depender dos perfis da API estarem no ar.
export const dynamic = "force-dynamic";

export default async function RankingPage() {
  let rows: RankingRow[] | null = null;
  try {
    rows = await fetchRanking();
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
  }

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader
        kicker="Academia da Fé"
        title="Ranking"
        description="Pontos por lições de estudo concluídas. Aparece aqui só quem escolheu aparecer."
      />

      <div className="mt-8 max-w-xl">
        {rows === null ? (
          <StatusMessage title="O ranking está indisponível agora">
            <p>Volte em instantes. As lições continuam abertas.</p>
          </StatusMessage>
        ) : rows.length > 0 ? (
          <ol className="flex flex-col">
            {rows.map((row, index) => (
              <li
                key={`${row.nome}-${index}`}
                className="flex items-baseline justify-between gap-4 border-b border-border py-3"
              >
                <span className="min-w-0 text-body text-ink">
                  <span className="mr-3 tabular-nums text-ink-muted">{index + 1}.</span>
                  {row.nome}
                </span>
                <span className="shrink-0 text-meta font-semibold tabular-nums text-ink">
                  {row.pontos} pontos
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <StatusMessage title="Ninguém no ranking ainda">
            <p>
              <Link href="/academia" className="text-accent underline underline-offset-4">
                Faça uma lição
              </Link>{" "}
              e escolha aparecer aqui no seu perfil.
            </p>
          </StatusMessage>
        )}
      </div>

      <p className="mt-8 max-w-measure text-meta text-ink-muted">
        A pontuação mede só o estudo dos exercícios. Oração, velas e vida espiritual não contam pontos.
      </p>
    </div>
  );
}
