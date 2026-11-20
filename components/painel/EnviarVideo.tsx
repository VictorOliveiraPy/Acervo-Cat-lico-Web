"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cadastrarReelAction } from "@/app/(pt)/painel/videos/actions";
import { slugDoTitulo } from "@/lib/painel";
import { REEL_TEMAS } from "@/lib/reels";

const CAMPO = "w-full rounded-edge border border-border-strong bg-raised px-3 py-2 text-body text-ink focus:border-accent focus:outline-none";

/** Largura e altura do vídeo e, se pedido, um quadro dele como capa (JPEG). */
async function lerVideo(arquivo: File, comCapa: boolean): Promise<{ largura: number; altura: number; capa: Blob | null }> {
  const url = URL.createObjectURL(arquivo);
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((pronto, falha) => {
      video.onloadedmetadata = () => pronto();
      video.onerror = () => falha(new Error("O navegador não conseguiu abrir o vídeo."));
    });
    const largura = video.videoWidth;
    const altura = video.videoHeight;
    if (!comCapa) return { largura, altura, capa: null };
    video.currentTime = Math.min(1, video.duration / 2);
    await new Promise<void>((pronto) => {
      video.onseeked = () => pronto();
    });
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    canvas.getContext("2d")?.drawImage(video, 0, 0, largura, altura);
    const capa = await new Promise<Blob | null>((pronto) => canvas.toBlob(pronto, "image/jpeg", 0.85));
    return { largura, altura, capa };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function enviar(slug: string, tipo: "video" | "capa", corpo: Blob): Promise<string> {
  const resposta = await fetch(`/painel/videos/enviar?slug=${slug}&tipo=${tipo}`, { method: "POST", body: corpo });
  const dados = (await resposta.json().catch(() => ({}))) as { public_url?: string; mensagem?: string };
  if (!resposta.ok || !dados.public_url) throw new Error(dados.mensagem ?? "O envio falhou.");
  return dados.public_url;
}

/** Envia um vídeo que já está pronto no computador (feito fora do gerador, por exemplo). */
export function EnviarVideo() {
  const router = useRouter();
  const [etapa, setEtapa] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(form: FormData) {
    const video = form.get("video");
    const capaEscolhida = form.get("capa");
    const titulo = String(form.get("titulo") ?? "").trim();
    if (!(video instanceof File) || video.size === 0 || !titulo) {
      setEtapa("Escolha o vídeo e escreva o título.");
      return;
    }
    const temCapa = capaEscolhida instanceof File && capaEscolhida.size > 0;
    const slug = slugDoTitulo(titulo);
    setEnviando(true);
    try {
      setEtapa("Lendo o vídeo…");
      const { largura, altura, capa } = await lerVideo(video, !temCapa);
      setEtapa("Enviando o vídeo…");
      const videoUrl = await enviar(slug, "video", video);
      setEtapa("Enviando a capa…");
      const capaUrl = await enviar(slug, "capa", temCapa ? (capaEscolhida as File) : capa!);
      setEtapa("Cadastrando…");
      const resultado = await cadastrarReelAction({
        slug,
        titulo,
        legenda: String(form.get("legenda") ?? ""),
        tema: String(form.get("tema") ?? "curiosidades"),
        largura,
        altura,
        video_url: videoUrl,
        capa_url: capaUrl,
        publicado: form.get("publicado") === "on",
      });
      setEtapa(resultado.ok ? `Pronto: /${slug}.` : resultado.mensagem);
      if (resultado.ok) router.refresh();
    } catch (erro: unknown) {
      setEtapa(erro instanceof Error ? erro.message : "O envio falhou.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <details className="rounded-panel border border-border bg-surface p-5">
      <summary className="cursor-pointer font-semibold text-ink">Enviar um vídeo pronto do computador</summary>
      <form className="mt-4 flex flex-col gap-3" action={(form) => void aoEnviar(form)}>
        <label className="flex flex-col gap-1 text-meta text-ink">
          Vídeo (MP4, vertical)
          <input name="video" type="file" accept="video/mp4" required className="text-meta" />
        </label>
        <label className="flex flex-col gap-1 text-meta text-ink">
          Capa (JPG, opcional: sem ela, uso um quadro do vídeo)
          <input name="capa" type="file" accept="image/jpeg" className="text-meta" />
        </label>
        <label className="flex flex-col gap-1 text-meta text-ink">
          Título
          <input name="titulo" required maxLength={140} className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1 text-meta text-ink">
          Legenda
          <textarea name="legenda" rows={3} maxLength={2200} className={CAMPO} />
        </label>
        <label className="flex flex-col gap-1 text-meta text-ink">
          Tema
          <select name="tema" defaultValue="curiosidades" className={CAMPO}>
            {Object.entries(REEL_TEMAS).map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-meta text-ink">
          <input name="publicado" type="checkbox" className="accent-accent" /> Já publicar em /reels
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={enviando} className="btn btn-primary disabled:opacity-60">
            {enviando ? "Enviando…" : "Enviar"}
          </button>
          <p role="status" aria-live="polite" className="text-meta text-ink-muted">
            {etapa}
          </p>
        </div>
      </form>
    </details>
  );
}
