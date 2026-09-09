"use server";

/**
 * Server Action do formulário de perguntar ao chatbot — mesmo padrão de
 * `app/velas/actions.ts`: arquivo à parte (exigência do Next para Server
 * Actions), única ponte entre o formulário no cliente e `perguntarAoChat`.
 */

import { CHAT_PERGUNTA_MAX, type FonteCitada } from "@/lib/chatSchemas";
import { ApiError, getErrorMessage } from "@/lib/api";
import { perguntarAoChat } from "@/lib/services/chatService";

export type PerguntarState = {
  status: "idle" | "success" | "error";
  message?: string;
  pergunta?: string;
  resposta?: string;
  fontes?: FonteCitada[];
};

export async function perguntarAction(
  _prevState: PerguntarState,
  formData: FormData,
): Promise<PerguntarState> {
  const pergunta = String(formData.get("pergunta") ?? "").trim();

  if (!pergunta) {
    return { status: "error", message: "Digite uma pergunta." };
  }
  if (pergunta.length > CHAT_PERGUNTA_MAX) {
    return {
      status: "error",
      message: `A pergunta pode ter no máximo ${CHAT_PERGUNTA_MAX} caracteres.`,
    };
  }

  try {
    const resultado = await perguntarAoChat(pergunta);
    return {
      status: "success",
      pergunta,
      resposta: resultado.resposta,
      fontes: resultado.fontes,
    };
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
