/**
 * Serviço de domínio do chatbot — mesma forma de `velasService.ts`, contra
 * `/api/chat`, a segunda (e única outra) rota de escrita do site.
 */

import { apiPost } from "@/lib/api";
import { chatResponseSchema, type ChatResponse } from "@/lib/chatSchemas";

/** Pergunta o chatbot — nunca cacheada, é uma conversa, não conteúdo do acervo. */
export function perguntarAoChat(pergunta: string): Promise<ChatResponse> {
  return apiPost("/chat", { pergunta: pergunta.trim() }, chatResponseSchema);
}
