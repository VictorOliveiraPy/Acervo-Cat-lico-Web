"use server";

/**
 * Server Action do `ChatWidget` — chamada uma vez por mensagem enviada
 * (não `useFormState`, que é pra um estado único; o widget acumula
 * histórico no cliente). Única ponte com `perguntarAoChat`, desde que
 * `/perguntar` (página dedicada, `useFormState` de pergunta/resposta
 * única) foi removida em favor do widget flutuante global.
 */

import { CHAT_PERGUNTA_MAX, type FonteCitada } from "@/lib/chatSchemas";
import { ApiError, getErrorMessage } from "@/lib/api";
import { perguntarAoChat } from "@/lib/services/chatService";

export type PerguntarResult =
  | { status: "success"; resposta: string; fontes: FonteCitada[] }
  | { status: "error"; message: string };

export async function perguntarWidgetAction(pergunta: string): Promise<PerguntarResult> {
  const trimmed = pergunta.trim();

  if (!trimmed) {
    return { status: "error", message: "Digite uma pergunta." };
  }
  if (trimmed.length > CHAT_PERGUNTA_MAX) {
    return {
      status: "error",
      message: `A pergunta pode ter no máximo ${CHAT_PERGUNTA_MAX} caracteres.`,
    };
  }

  try {
    const resultado = await perguntarAoChat(trimmed);
    return { status: "success", resposta: resultado.resposta, fontes: resultado.fontes };
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 429) {
      return { status: "error", message: "Espere um instante antes de perguntar de novo." };
    }
    if (error instanceof ApiError && error.status === 503) {
      return {
        status: "error",
        message: "O chatbot está temporariamente indisponível. Tente novamente em instantes.",
      };
    }
    return { status: "error", message: getErrorMessage(error) };
  }
}
