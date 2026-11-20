import { z } from "zod";

import { ApiError, getApiBaseUrl } from "@/lib/api";
import { reelPageSchema, reelSchema, type Reel } from "@/lib/reels";

/**
 * Chamadas do painel à API do estúdio. Só no servidor: levam o segredo interno, que
 * a API exige em `/api/admin/...`.
 */

export const pedidoSchema = z.object({
  id: z.number(),
  tema: z.string(),
  pergunta: z.string(),
  notas: z.string(),
  formato: z.string(),
  status: z.enum(["na_fila", "gerando", "pronto", "erro", "cancelado"]),
  etapa: z.string(),
  progresso: z.number(),
  erro: z.string(),
  slug: z.string().nullable(),
  criado_em: z.string().nullable(),
  atualizado_em: z.string().nullable(),
});

export type Pedido = z.output<typeof pedidoSchema>;

const uploadSchema = z.object({ upload_url: z.string(), public_url: z.string(), content_type: z.string() });

/** A mensagem que a API mandou (ex.: "Já existe um vídeo com esse endereço."). */
export class EstudioError extends ApiError {}

async function admin(method: string, path: string, body?: unknown): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new EstudioError("Não foi possível falar com a API.", 503, "NETWORK_ERROR");
  }
  if (!response.ok) {
    const detalhe = (await response.json().catch(() => null)) as { message?: string } | null;
    const mensagem = detalhe?.message ?? "A API recusou o pedido.";
    throw new EstudioError(mensagem, response.status, "ESTUDIO_ERRO");
  }
  return response;
}

export async function listarReelsAdmin(): Promise<Reel[]> {
  return reelPageSchema.parse(await (await admin("GET", "/admin/reels")).json()).itens;
}

export async function criarReel(dados: Record<string, unknown>): Promise<Reel> {
  return reelSchema.parse(await (await admin("POST", "/admin/reels", dados)).json());
}

export async function editarReel(slug: string, dados: Record<string, unknown>): Promise<Reel> {
  return reelSchema.parse(await (await admin("PATCH", `/admin/reels/${encodeURIComponent(slug)}`, dados)).json());
}

export async function apagarReel(slug: string): Promise<void> {
  await admin("DELETE", `/admin/reels/${encodeURIComponent(slug)}`);
}

export async function linkDeEnvio(slug: string, tipo: "video" | "capa") {
  return uploadSchema.parse(await (await admin("POST", "/admin/uploads", { slug, tipo })).json());
}

export async function listarPedidos(): Promise<Pedido[]> {
  return z.array(pedidoSchema).parse(await (await admin("GET", "/admin/pedidos")).json());
}

export async function criarPedido(dados: Record<string, unknown>): Promise<Pedido> {
  return pedidoSchema.parse(await (await admin("POST", "/admin/pedidos", dados)).json());
}

export async function mudarPedido(id: number, acao: "refazer" | "cancelar"): Promise<Pedido> {
  return pedidoSchema.parse(await (await admin("POST", `/admin/pedidos/${id}/${acao}`)).json());
}
