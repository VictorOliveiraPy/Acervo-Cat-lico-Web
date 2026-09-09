/**
 * Contrato do chatbot do acervo, espelhando `backend/app/rag/models.py`.
 *
 * `categoria` fica como `string` solto (não `CategorySlug`) de propósito:
 * é o mesmo dado cru que a API do acervo devolve em outros lugares — quem
 * consome decide como validar (ver `isCategorySlug` em `ChatPanel`).
 */

import { z } from "zod";

export const CHAT_PERGUNTA_MAX = 500;

export const fonteCitadaSchema = z.object({
  titulo: z.string(),
  categoria: z.string(),
  slug: z.string(),
});

export const chatResponseSchema = z.object({
  resposta: z.string(),
  fontes: z.array(fonteCitadaSchema),
});

export type FonteCitada = z.infer<typeof fonteCitadaSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
