import Link from "next/link";

import { acaoDeOracao } from "@/lib/acaoDeOracao";

/**
 * Fim do verbete: da leitura à oração. No santo, a invocação e a vela pedindo a
 * intercessão dele; nos outros, o Evangelho do dia. Dá à pessoa o que fazer depois
 * de ler, em vez de a página só acabar.
 */
export function OracaoFinal({ entry }: { entry: { categoria: string; slug: string; titulo: string } }) {
  const acao = acaoDeOracao(entry);
  return (
    <aside
      aria-label="Leve para a oração"
      className="mt-10 rounded-panel border border-border bg-surface p-6"
    >
      <p className="eyebrow">Leve para a oração</p>
      {acao.invocacao ? (
        <p className="mt-3 font-display text-title-sm italic text-ink">{acao.invocacao}</p>
      ) : null}
      <p className="mt-2 max-w-measure text-meta text-ink-muted">{acao.texto}</p>
      <Link href={acao.href} data-evento="prayer_action" className="btn btn-primary mt-4">
        {acao.rotulo}
      </Link>
    </aside>
  );
}
