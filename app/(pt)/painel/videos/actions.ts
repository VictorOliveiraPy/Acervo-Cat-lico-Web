"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api";
import { isAdmin } from "@/lib/auth";
import { todayInBrazil } from "@/lib/liturgia";
import { saintOfDay, type Santo } from "@/lib/santoDoDia";
import { amanha, jaPedido, pedidoEvangelho, pedidoSantoDoDia } from "@/lib/series";
import { fetchAllEntries } from "@/lib/services/acervoService";
import { fetchLiturgiaDiaria } from "@/lib/services/liturgiaService";
import {
  EstudioError,
  apagarReel,
  criarPedido,
  criarReel,
  editarReel,
  listarPedidos,
  mudarPedido,
} from "@/lib/services/estudioService";

export type Resultado = { ok: true } | { ok: false; mensagem: string };

/** Toda ação do painel passa por aqui: só quem administra, e erro vira mensagem na tela. */
async function comoAdmin(acao: () => Promise<unknown>): Promise<Resultado> {
  if (!(await isAdmin())) return { ok: false, mensagem: "Acesso só para quem administra o site." };
  try {
    await acao();
  } catch (error: unknown) {
    if (error instanceof EstudioError) return { ok: false, mensagem: error.message };
    throw error;
  }
  revalidatePath("/painel/videos");
  revalidatePath("/reels");
  return { ok: true };
}

export async function pedirVideoAction(dados: {
  tema: string;
  pergunta: string;
  notas: string;
  formato: string;
}): Promise<Resultado> {
  return comoAdmin(() => criarPedido(dados));
}

export async function mudarPedidoAction(id: number, acao: "refazer" | "cancelar"): Promise<Resultado> {
  return comoAdmin(() => mudarPedido(id, acao));
}

export async function editarReelAction(
  slug: string,
  dados: { titulo?: string; legenda?: string; tema?: string; publicado?: boolean },
): Promise<Resultado> {
  return comoAdmin(() => editarReel(slug, dados));
}

export async function apagarReelAction(slug: string): Promise<Resultado> {
  return comoAdmin(() => apagarReel(slug));
}

/** Cadastra o reel depois que o vídeo e a capa já subiram para o R2. */
export async function cadastrarReelAction(dados: {
  slug: string;
  titulo: string;
  legenda: string;
  tema: string;
  largura: number;
  altura: number;
  video_url: string;
  capa_url: string;
  publicado: boolean;
}): Promise<Resultado> {
  return comoAdmin(() => criarReel(dados));
}

/**
 * Séries: o santo e o Evangelho de amanhã viram pedidos prontos, com o link do site.
 * Não pede de novo o que já está na fila, sendo feito ou pronto.
 */
export async function pedirSerieAction(serie: "santo" | "evangelho"): Promise<Resultado & { tema?: string }> {
  if (!(await isAdmin())) return { ok: false, mensagem: "Acesso só para quem administra o site." };
  const data = amanha(todayInBrazil());
  let pedido;
  try {
    if (serie === "santo") {
      const santo = saintOfDay((await fetchAllEntries("santos")) as Santo[], data);
      if (!santo) return { ok: false, mensagem: "Não achei santo com festa nos próximos dias." };
      pedido = pedidoSantoDoDia(santo.saint, santo.date);
    } else {
      pedido = pedidoEvangelho(await fetchLiturgiaDiaria(data));
    }
  } catch (error: unknown) {
    if (error instanceof ApiError) return { ok: false, mensagem: "A liturgia ou o acervo não responderam agora." };
    throw error;
  }
  if (jaPedido(await listarPedidos(), pedido.tema)) {
    return { ok: false, mensagem: `"${pedido.tema}" já foi pedido.` };
  }
  const resultado = await comoAdmin(() => criarPedido(pedido));
  return resultado.ok ? { ok: true, tema: pedido.tema } : resultado;
}
