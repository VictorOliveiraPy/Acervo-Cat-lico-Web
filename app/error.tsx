"use client";

import { useEffect } from "react";

/**
 * Fronteira de erro das rotas do acervo.
 *
 * Mostra o que falhou em linguagem de leitor e um caminho de volta (tentar de
 * novo, sem perder a página). O erro em si vai para o console de erro do
 * navegador — não é `console.log` de depuração: é o canal de relato de falha
 * que a fronteira do Next espera, e é o que permite correlacionar com o log do
 * servidor depois.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Falha ao renderizar página do acervo", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-shell px-4 py-16 sm:px-6">
      <div className="max-w-measure rounded-edge border border-state-error bg-parchment-raised px-6 py-8">
        <p className="kicker text-state-error">Erro</p>
        <h1 className="mt-2 font-display text-title-md text-ink">
          Não conseguimos montar esta página
        </h1>
        <p className="mt-4 text-body text-ink-muted">
          A falha foi registrada. Tentar de novo costuma resolver quando o
          problema é momentâneo na conexão com o acervo.
        </p>
        {error.digest ? (
          <p className="mt-3 text-meta text-ink-muted">
            Código para relato: <span className="text-ink">{error.digest}</span>
          </p>
        ) : null}

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-edge border border-bordeaux bg-bordeaux px-5 py-2.5 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  );
}
