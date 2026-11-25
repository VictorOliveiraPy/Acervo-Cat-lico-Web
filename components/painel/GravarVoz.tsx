"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { enviarVozAction } from "@/app/(pt)/painel/videos/actions";
import type { Pedido } from "@/lib/services/estudioService";

/**
 * O roteiro de um pedido com voz própria: o texto para ler e a gravação, feita aqui
 * mesmo pelo microfone ou enviada do celular. Ao enviar, o pedido volta à fila e o
 * gerador monta o vídeo sincronizado com a sua fala.
 */
export function GravarVoz({ pedido }: { pedido: Pedido }) {
  const router = useRouter();
  const [gravacao, setGravacao] = useState<Blob | null>(null);
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [estado, setEstado] = useState("");
  const [enviando, setEnviando] = useState(false);
  const gravador = useRef<MediaRecorder | null>(null);
  const urlDaPrevia = useRef<string | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);

  useEffect(() => {
    if (!gravando) return;
    const relogio = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(relogio);
  }, [gravando]);

  function guardar(audio: Blob) {
    if (urlDaPrevia.current) URL.revokeObjectURL(urlDaPrevia.current);
    urlDaPrevia.current = URL.createObjectURL(audio);
    setPrevia(urlDaPrevia.current);
    setGravacao(audio);
  }

  async function comecar() {
    try {
      const microfone = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      const pedacos: Blob[] = [];
      const novo = new MediaRecorder(microfone);
      novo.ondataavailable = (evento) => pedacos.push(evento.data);
      novo.onstop = () => {
        microfone.getTracks().forEach((faixa) => faixa.stop());
        guardar(new Blob(pedacos, { type: novo.mimeType }));
      };
      gravador.current = novo;
      setSegundos(0);
      setEstado("");
      novo.start();
      setGravando(true);
    } catch {
      setEstado("O navegador não liberou o microfone. Grave no celular e envie o arquivo.");
    }
  }

  function parar() {
    gravador.current?.stop();
    setGravando(false);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pedido.roteiro);
      setEstado("Texto copiado.");
    } catch {
      setEstado("O navegador não deixou copiar.");
    }
  }

  async function enviar() {
    if (!gravacao) return;
    setEnviando(true);
    try {
      setEstado("Enviando a gravação…");
      const resposta = await fetch(`/painel/videos/enviar?slug=pedido-${pedido.id}&tipo=voz`, {
        method: "POST",
        body: gravacao,
      });
      const dados = (await resposta.json().catch(() => ({}))) as { public_url?: string; mensagem?: string };
      if (!resposta.ok || !dados.public_url) throw new Error(dados.mensagem ?? "O envio falhou.");
      const resultado = await enviarVozAction(pedido.id, dados.public_url);
      setEstado(resultado.ok ? "Recebido. O gerador monta o vídeo com a sua voz." : resultado.mensagem);
      if (resultado.ok) router.refresh();
    } catch (erro: unknown) {
      setEstado(erro instanceof Error ? erro.message : "O envio falhou.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-edge border border-accent/40 bg-accent-soft/40 p-3">
      <p className="text-meta text-ink">
        Leia em voz alta, devagar e na ordem. Pode reler um trecho errado: o gerador sincroniza pela fala.
      </p>
      <div className="max-h-64 overflow-y-auto whitespace-pre-line rounded-edge bg-surface p-3 font-display text-body leading-relaxed text-ink">
        {pedido.roteiro}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-tertiary" onClick={() => void copiar()}>
          Copiar texto
        </button>
        {gravando ? (
          <button type="button" className="btn btn-primary" onClick={parar}>
            Parar ({Math.floor(segundos / 60)}:{String(segundos % 60).padStart(2, "0")})
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => void comecar()}>
            {gravacao ? "Gravar de novo" : "Gravar agora"}
          </button>
        )}
        <label className="btn-tertiary cursor-pointer">
          Enviar arquivo do celular
          <input
            type="file"
            accept="audio/*"
            className="sr-only"
            onChange={(evento) => {
              const arquivo = evento.target.files?.[0];
              if (arquivo) guardar(arquivo);
            }}
          />
        </label>
      </div>
      {previa ? (
        <div className="flex flex-wrap items-center gap-3">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- é a própria narração, para ouvir antes de enviar */}
          <audio src={previa} controls className="max-w-full" />
          <button type="button" disabled={enviando} className="btn btn-primary disabled:opacity-60" onClick={() => void enviar()}>
            {enviando ? "Enviando…" : "Enviar e montar o vídeo"}
          </button>
        </div>
      ) : null}
      <p role="status" aria-live="polite" className="text-meta text-ink-muted">
        {estado}
      </p>
    </div>
  );
}
