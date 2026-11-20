"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/auth";
import {
  EstudioError,
  apagarReel,
  criarPedido,
  criarReel,
  editarReel,
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
