"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { advancePathAction, completeActivityAction } from "@/app/(pt)/perfil/actions";
import { TrilhaDesenho } from "@/components/caminho/TrilhaDesenho";
import { SaintStage } from "@/components/perfil/SaintStage";
import { situacaoDaCasa, type Caminho, type ProgressoNoCaminho } from "@/lib/caminho";
import { patronById, type PatronId } from "@/lib/padroeiros";

/**
 * O Caminho da Santidade de quem entrou: a trilha, o padroeiro em 3D na casa atual e
 * o que fazer agora. Marcar a prática e avançar a casa acontecem num clique só.
 */
export function MeuCaminho({
  caminho,
  progresso: progressoInicial,
  feitasHoje: feitasHojeIniciais,
  licoes,
  padroeiroId,
  estagio,
}: {
  caminho: Caminho;
  progresso: ProgressoNoCaminho;
  feitasHoje: readonly string[];
  licoes: number;
  padroeiroId: PatronId;
  estagio: number;
}) {
  const [progresso, setProgresso] = useState(progressoInicial);
  const [feitasHoje, setFeitasHoje] = useState<readonly string[]>(feitasHojeIniciais);
  const [mensagem, setMensagem] = useState("");
  const [festa, setFesta] = useState(false);
  const [ocupado, iniciar] = useTransition();
  const santo = patronById(padroeiroId);
  const total = caminho.casas.length;
  const atual = caminho.casas.find((casa) => casa.numero === progresso.concluidas + 1);

  // Abre já na casa atual: com 36 casas, a pessoa não precisa rolar procurando.
  useEffect(() => {
    document.getElementById(`casa-${progressoInicial.concluidas + 1}`)?.scrollIntoView({ block: "center" });
  }, [progressoInicial.concluidas]);

  function avancar(numero: number, marcarAntes?: string) {
    iniciar(async () => {
      setMensagem("");
      if (marcarAntes) {
        const marcada = await completeActivityAction(marcarAntes);
        if (marcada.status !== "saved") {
          setMensagem("Não foi possível marcar a prática. Tente de novo.");
          return;
        }
        setFeitasHoje(marcada.atividades.filter((a) => a.feita_hoje).map((a) => a.id));
      }
      const resultado = await advancePathAction(numero);
      if (resultado.status === "blocked") {
        setMensagem(resultado.mensagem);
        return;
      }
      if (resultado.status !== "saved") {
        setMensagem("Não foi possível avançar agora. Tente de novo.");
        return;
      }
      setProgresso(resultado.caminho);
      setFeitasHoje(resultado.atividades.filter((a) => a.feita_hoje).map((a) => a.id));
      setFesta(true);
      setMensagem(
        resultado.caminho.concluidas >= total
          ? "Você chegou ao fim do Caminho da Santidade!"
          : `Casa ${numero} concluída! +1 passo rumo à santidade.`,
      );
      window.setTimeout(() => {
        setFesta(false);
        document.getElementById(`casa-${numero + 1}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 900);
    });
  }

  const situacao = atual
    ? situacaoDaCasa(caminho, atual.numero, { feitasHoje, licoes, casasHoje: progresso.hoje })
    : null;

  const cartao = atual ? (
    <div className="rounded-panel border border-border bg-surface p-4 text-center shadow-lg">
      <p className="text-label font-semibold uppercase text-accent">Casa {atual.numero} de {total}</p>
      <p className="mt-1 font-display text-title-sm text-ink">{atual.titulo}</p>
      <p className="mt-1 text-meta text-ink-muted">{atual.texto}</p>
      <div className="mt-3">
        {situacao === "marcar" ? (
          <button type="button" disabled={ocupado} onClick={() => avancar(atual.numero, atual.tarefa)} className="btn btn-primary w-full disabled:opacity-60">
            {ocupado ? "Avançando…" : `Fiz: ${atual.tarefa_nome}`}
          </button>
        ) : situacao === "avancar" ? (
          <button type="button" disabled={ocupado} onClick={() => avancar(atual.numero)} className="btn btn-primary w-full disabled:opacity-60">
            {ocupado ? "Avançando…" : "Avançar para a próxima casa"}
          </button>
        ) : situacao === "licao" ? (
          <Link href="/academia" className="btn btn-primary w-full">
            Fazer uma lição na Academia
          </Link>
        ) : (
          <p className="text-meta text-ink">Esta prática já moveu uma casa hoje. Volte amanhã para seguir!</p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div>
      <div className="mx-auto mb-6 max-w-[420px] rounded-full border border-border bg-surface px-4 py-2">
        <div className="flex items-center justify-between text-meta">
          <span className="font-semibold text-ink">Caminho da Santidade</span>
          <span className="text-ink-muted [font-variant-numeric:tabular-nums]">
            {progresso.concluidas}/{total} casas
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Casas concluídas no Caminho da Santidade"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={progresso.concluidas}
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-border"
        >
          <div className="h-full rounded-full bg-gold transition-[width] duration-700" style={{ width: `${(progresso.concluidas / total) * 100}%` }} />
        </div>
      </div>

      <p role="status" aria-live="polite" className="mb-2 min-h-6 text-center text-meta font-semibold text-accent">
        {mensagem}
      </p>

      <TrilhaDesenho
        caminho={caminho}
        concluidas={progresso.concluidas}
        aoLado={
          <div className={festa ? "trilha-festa" : ""}>
            <SaintStage saintId={santo.id} saintName={santo.nome} estagio={estagio} compacto />
          </div>
        }
        abaixo={cartao}
      />
    </div>
  );
}
