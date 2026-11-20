"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { apagarReelAction, editarReelAction } from "@/app/(pt)/painel/videos/actions";
import { REEL_TEMAS, type Reel } from "@/lib/reels";

const CAMPO = "w-full rounded-edge border border-border-strong bg-raised px-3 py-2 text-body text-ink focus:border-accent focus:outline-none";

function CartaoReel({ reel }: { reel: Reel }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [ocupado, iniciar] = useTransition();
  const [mensagem, setMensagem] = useState("");

  function executar(acao: () => Promise<{ ok: boolean; mensagem?: string }>, sucesso: string) {
    iniciar(async () => {
      const resultado = await acao();
      setMensagem(resultado.ok ? sucesso : (resultado.mensagem ?? "Não deu certo."));
      if (resultado.ok) router.refresh();
    });
  }

  async function copiarLegenda() {
    try {
      await navigator.clipboard.writeText(reel.legenda);
      setMensagem("Legenda copiada.");
    } catch {
      setMensagem("O navegador não deixou copiar.");
    }
  }

  return (
    <li id={`reel-${reel.slug}`} className="flex gap-4 rounded-panel border border-border bg-surface p-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- capa pequena, de domínios variados */}
      <img src={reel.capa_url} alt="" className="h-36 w-20 shrink-0 rounded-edge bg-canvas object-cover" loading="lazy" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold text-ink">{reel.titulo}</p>
          <span className={`text-meta font-semibold ${reel.publicado ? "text-accent" : "text-ink-muted"}`}>
            {reel.publicado ? "No site" : "Rascunho"}
          </span>
        </div>
        <p className="text-meta text-ink-muted">
          {REEL_TEMAS[reel.tema] ?? reel.tema} · /{reel.slug}
        </p>

        {editando ? (
          <form
            className="mt-3 flex flex-col gap-2"
            action={(form) =>
              executar(
                () =>
                  editarReelAction(reel.slug, {
                    titulo: String(form.get("titulo") ?? ""),
                    legenda: String(form.get("legenda") ?? ""),
                    tema: String(form.get("tema") ?? ""),
                  }).then((r) => (r.ok && setEditando(false), r)),
                "Salvo.",
              )
            }
          >
            <input name="titulo" defaultValue={reel.titulo} required maxLength={140} aria-label="Título" className={CAMPO} />
            <textarea name="legenda" defaultValue={reel.legenda} rows={4} maxLength={2200} aria-label="Legenda" className={CAMPO} />
            <select name="tema" defaultValue={reel.tema} aria-label="Tema" className={CAMPO}>
              {Object.entries(REEL_TEMAS).map(([id, nome]) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" disabled={ocupado} className="btn btn-primary">
                Salvar
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditando(false)}>
                Desistir
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="mt-2 line-clamp-2 text-meta text-ink">{reel.legenda || "Sem legenda."}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <button
                type="button"
                disabled={ocupado}
                className="btn-tertiary"
                onClick={() =>
                  executar(
                    () => editarReelAction(reel.slug, { publicado: !reel.publicado }),
                    reel.publicado ? "Saiu do site." : "Publicado em /reels.",
                  )
                }
              >
                {reel.publicado ? "Tirar do site" : "Publicar no site"}
              </button>
              <a href={`/painel/videos/baixar/${reel.slug}`} className="btn-tertiary">
                Baixar para o Instagram
              </a>
              <button type="button" className="btn-tertiary" onClick={() => void copiarLegenda()}>
                Copiar legenda
              </button>
              <a href={reel.video_url} target="_blank" rel="noopener noreferrer" className="btn-tertiary">
                Assistir
              </a>
              <button type="button" className="btn-tertiary" onClick={() => setEditando(true)}>
                Editar
              </button>
              <button
                type="button"
                disabled={ocupado}
                className="btn-tertiary text-danger"
                onClick={() => {
                  if (window.confirm(`Apagar "${reel.titulo}" do site e os arquivos dele? Não dá para desfazer.`)) {
                    executar(() => apagarReelAction(reel.slug), "Apagado.");
                  }
                }}
              >
                Apagar
              </button>
            </div>
          </>
        )}
        <p role="status" aria-live="polite" className="mt-1 text-meta text-ink-muted">
          {mensagem}
        </p>
      </div>
    </li>
  );
}

export function ReelsAdmin({ reels }: { reels: Reel[] }) {
  const [filtro, setFiltro] = useState<"todos" | "rascunhos" | "publicados">("todos");
  const visiveis = reels.filter(
    (reel) => filtro === "todos" || (filtro === "rascunhos" ? !reel.publicado : reel.publicado),
  );
  const rascunhos = reels.filter((reel) => !reel.publicado).length;

  return (
    <section aria-labelledby="reels" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="reels" className="font-semibold text-ink">
          Vídeos ({reels.length}, {rascunhos} {rascunhos === 1 ? "rascunho" : "rascunhos"})
        </h2>
        <div className="flex gap-2 text-meta" role="group" aria-label="Filtrar vídeos">
          {(["todos", "rascunhos", "publicados"] as const).map((opcao) => (
            <button
              key={opcao}
              type="button"
              aria-pressed={filtro === opcao}
              onClick={() => setFiltro(opcao)}
              className={`rounded-edge border px-3 py-1 ${filtro === opcao ? "border-accent bg-accent text-surface" : "border-border text-ink-muted"}`}
            >
              {opcao[0]!.toUpperCase() + opcao.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {visiveis.map((reel) => (
          <CartaoReel key={reel.slug} reel={reel} />
        ))}
      </ul>
    </section>
  );
}
