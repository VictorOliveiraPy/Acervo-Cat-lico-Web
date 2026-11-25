"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { mudarPedidoAction, pedirSerieAction, pedirVideoAction } from "@/app/(pt)/painel/videos/actions";
import { GravarVoz } from "@/components/painel/GravarVoz";
import { DURACOES, STATUS_PEDIDO, aceitaVozPropria, notasComDuracao, pedidoEmAndamento } from "@/lib/painel";
import type { Pedido } from "@/lib/services/estudioService";

const NOME_DO_FORMATO: Record<string, string> = { cinema: "Cinema", catequese: "Catequese", objecao: "Objeção" };

const CAMPO = "w-full rounded-edge border border-border-strong bg-raised px-3 py-2 text-body text-ink focus:border-accent focus:outline-none";

function NovoPedido() {
  const router = useRouter();
  const [enviando, iniciar] = useTransition();
  const [mensagem, setMensagem] = useState("");
  const [formato, setFormato] = useState("cinema");
  const [minhaVoz, setMinhaVoz] = useState(true);
  const [duracao, setDuracao] = useState("auto");
  const podeVoz = aceitaVozPropria(formato);

  return (
    <form
      className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5"
      action={(form) =>
        iniciar(async () => {
          const resultado = await pedirVideoAction({
            tema: String(form.get("tema") ?? ""),
            pergunta: String(form.get("pergunta") ?? ""),
            notas: notasComDuracao(String(form.get("notas") ?? ""), duracao),
            formato,
            voz_propria: podeVoz && minhaVoz,
          });
          setMensagem(
            resultado.ok
              ? podeVoz && minhaVoz
                ? "Pedido na fila. Quando o roteiro ficar pronto, ele aparece aqui para você gravar."
                : "Pedido na fila. O gerador começa assim que estiver ligado."
              : resultado.mensagem,
          );
          if (resultado.ok) router.refresh();
        })
      }
    >
      <h2 className="font-semibold text-ink">Pedir um vídeo novo</h2>
      <label className="flex flex-col gap-1 text-meta text-ink">
        Tema (na Objeção, escreva a objeção: “Católico adora imagens?”)
        <input name="tema" required maxLength={200} placeholder="A confissão" className={CAMPO} />
      </label>
      <label className="flex flex-col gap-1 text-meta text-ink">
        Pergunta da abertura (opcional, termine com ?)
        <input name="pergunta" maxLength={200} placeholder="O padre pode contar o que você disse ali dentro?" className={CAMPO} />
      </label>
      <label className="flex flex-col gap-1 text-meta text-ink">
        Pedidos ao roteirista (opcional)
        <textarea name="notas" maxLength={2000} rows={3} className={CAMPO} />
      </label>
      <fieldset className="flex flex-wrap gap-x-4 gap-y-2 text-meta text-ink">
        <legend className="sr-only">Formato</legend>
        <label className="flex items-center gap-2">
          <input type="radio" name="formato" value="cinema" checked={formato === "cinema"} onChange={() => setFormato("cinema")} className="accent-accent" /> Cinema (pinturas em 3D, com mistério)
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="formato" value="catequese" checked={formato === "catequese"} onChange={() => setFormato("catequese")} className="accent-accent" /> Catequese (aula, formação)
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="formato" value="objecao" checked={formato === "objecao"} onChange={() => setFormato("objecao")} className="accent-accent" /> Objeção (resposta a uma acusação)
        </label>
      </fieldset>
      <label className="flex flex-col gap-1 text-meta text-ink">
        Duração
        <select value={duracao} onChange={(evento) => setDuracao(evento.target.value)} className={CAMPO}>
          {DURACOES.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.nome}
            </option>
          ))}
        </select>
      </label>
      <label className={`flex items-center gap-2 text-meta ${podeVoz ? "text-ink" : "text-ink-muted"}`}>
        <input
          type="checkbox"
          checked={podeVoz && minhaVoz}
          disabled={!podeVoz}
          onChange={(evento) => setMinhaVoz(evento.target.checked)}
          className="accent-accent"
        />
        Narrar com a minha voz (você grava o roteiro aqui no painel)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={enviando} className="btn btn-primary disabled:opacity-60">
          {enviando ? "Enviando…" : "Pedir vídeo"}
        </button>
        <p role="status" aria-live="polite" className="text-meta text-ink-muted">
          {mensagem}
        </p>
      </div>
      <p className="text-meta text-ink-muted">
        O roteiro fica pronto em 15 a 40 minutos; depois da sua gravação, o vídeo leva de 10 minutos (curto) a uma hora (10 minutos de vídeo). O roteiro traz afirmações de fé: revise antes de publicar.
      </p>
    </form>
  );
}

function Pedidos({ pedidos }: { pedidos: Pedido[] }) {
  const router = useRouter();
  const [ocupado, iniciar] = useTransition();
  const andando = pedidos.some((pedido) => pedidoEmAndamento(pedido.status));

  // Enquanto algum vídeo anda, a lista se atualiza sozinha a cada 15 s.
  useEffect(() => {
    if (!andando) return;
    const intervalo = setInterval(() => router.refresh(), 15_000);
    return () => clearInterval(intervalo);
  }, [andando, router]);

  if (pedidos.length === 0) {
    return <p className="text-meta text-ink-muted">Nenhum pedido ainda.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {pedidos.map((pedido) => (
        <li key={pedido.id} className="rounded-panel border border-border bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold text-ink">
              {pedido.tema}{" "}
              <span className="text-meta font-normal text-ink-muted">
                · {NOME_DO_FORMATO[pedido.formato] ?? pedido.formato}
                {pedido.voz_propria ? " · com a sua voz" : ""}
              </span>
            </p>
            <span className="text-meta font-semibold text-accent">{STATUS_PEDIDO[pedido.status] ?? pedido.status}</span>
          </div>
          {pedido.pergunta ? <p className="text-meta text-ink-muted">{pedido.pergunta}</p> : null}
          {pedido.status === "gerando" ? (
            <div className="mt-2">
              <p className="text-meta text-ink">{pedido.etapa || "Começando"}</p>
              <div
                role="progressbar"
                aria-label={`Andamento de ${pedido.tema}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pedido.progresso}
                className="mt-1 h-1.5 overflow-hidden rounded bg-border"
              >
                <div className="h-full bg-accent transition-[width]" style={{ width: `${pedido.progresso}%` }} />
              </div>
            </div>
          ) : null}
          {pedido.status === "aguardando_voz" ? <GravarVoz pedido={pedido} /> : null}
          {pedido.status === "erro" ? <p className="mt-1 text-meta text-danger">{pedido.erro}</p> : null}
          {pedido.status === "pronto" && pedido.slug ? (
            <a href={`#reel-${pedido.slug}`} className="btn-tertiary mt-2">
              Ver o vídeo pronto <span aria-hidden="true">↓</span>
            </a>
          ) : null}
          {pedido.status === "erro" || pedido.status === "cancelado" || pedido.status === "na_fila" ? (
            <div className="mt-2 flex gap-3">
              {pedido.status !== "na_fila" ? (
                <button type="button" disabled={ocupado} className="btn-tertiary" onClick={() => iniciar(async () => { await mudarPedidoAction(pedido.id, "refazer"); router.refresh(); })}>
                  Tentar de novo
                </button>
              ) : null}
              {pedido.status === "na_fila" ? (
                <button type="button" disabled={ocupado} className="btn-tertiary" onClick={() => iniciar(async () => { await mudarPedidoAction(pedido.id, "cancelar"); router.refresh(); })}>
                  Cancelar
                </button>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Series() {
  const router = useRouter();
  const [ocupado, iniciar] = useTransition();
  const [mensagem, setMensagem] = useState("");
  const [minhaVoz, setMinhaVoz] = useState(true);

  function pedir(serie: "santo" | "evangelho") {
    iniciar(async () => {
      const resultado = await pedirSerieAction(serie, minhaVoz);
      setMensagem(resultado.ok ? `Na fila: ${resultado.tema}.` : resultado.mensagem);
      if (resultado.ok) router.refresh();
    });
  }

  return (
    <section aria-labelledby="series" className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-5">
      <h2 id="series" className="font-semibold text-ink">Séries do dia</h2>
      <p className="text-meta text-ink-muted">
        Um vídeo por dia, sempre no mesmo formato, que leva ao site. Peça à noite: fica pronto para postar de manhã.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={ocupado} onClick={() => pedir("santo")} className="btn btn-secondary">
          Santo de amanhã (Cinema)
        </button>
        <button type="button" disabled={ocupado} onClick={() => pedir("evangelho")} className="btn btn-secondary">
          Evangelho de amanhã (Catequese)
        </button>
      </div>
      <label className="flex items-center gap-2 text-meta text-ink">
        <input type="checkbox" checked={minhaVoz} onChange={(evento) => setMinhaVoz(evento.target.checked)} className="accent-accent" />
        Narrados com a minha voz
      </label>
      <p role="status" aria-live="polite" className="text-meta text-ink-muted">
        {mensagem}
      </p>
    </section>
  );
}

export function PedidosVideo({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col gap-4">
        <Series />
        <NovoPedido />
      </div>
      <section aria-labelledby="pedidos" className="flex flex-col gap-3">
        <h2 id="pedidos" className="font-semibold text-ink">Pedidos recentes</h2>
        <Pedidos pedidos={pedidos} />
      </section>
    </div>
  );
}
