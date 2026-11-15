"use client";

import { useState } from "react";

import { completeActivityAction } from "@/app/(pt)/perfil/actions";
import type { Activity } from "@/lib/perfil";

/** Práticas do dia: cada uma vale pontos uma vez por dia, no horário de Brasília. */
export function ActivitiesPanel({
  atividades,
  onDone,
}: {
  atividades: readonly Activity[];
  onDone: (result: { pontos: number; atividades: Activity[] }) => void;
}) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const done = atividades.filter((atividade) => atividade.feita_hoje).length;

  async function complete(id: string) {
    setPending(id);
    setError("");
    const result = await completeActivityAction(id);
    setPending(null);
    if (result.status === "saved") onDone(result);
    else setError("Não foi possível marcar agora. Tente de novo em instantes.");
  }

  return (
    <section aria-labelledby="praticas-de-hoje" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="praticas-de-hoje" className="font-display text-title-md text-ink">
          Práticas de hoje
        </h2>
        <p className="text-meta text-ink-muted [font-variant-numeric:tabular-nums]">
          {done} de {atividades.length} feitas
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {atividades.map((atividade) => (
          <li
            key={atividade.id}
            className="flex items-center justify-between gap-3 rounded-[12px] border border-border bg-surface p-3"
          >
            <div className="min-w-0">
              <p className="font-semibold text-ink">{atividade.nome}</p>
              <p className="text-meta text-ink-muted">
                {atividade.descricao} · +{atividade.pontos} pontos
              </p>
            </div>
            {atividade.feita_hoje ? (
              <span className="shrink-0 text-meta font-semibold text-accent">Feita hoje ✓</span>
            ) : (
              <button
                type="button"
                className="btn btn-secondary shrink-0"
                disabled={pending !== null}
                onClick={() => void complete(atividade.id)}
              >
                {pending === atividade.id ? "Marcando…" : "Marcar"}
              </button>
            )}
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" className="text-meta text-danger">
        {error}
      </p>
    </section>
  );
}
