"use server";

/**
 * Server Actions do chatbot — duas pontas de entrada pro mesmo
 * `_perguntar`: `perguntarAction` (formulário de `/perguntar`, via
 * `useFormState`, uma pergunta/resposta por vez) e `perguntarWidgetAction`
 * (widget flutuante global, chamada direta por mensagem — precisa acumular
 * um histórico no cliente, então não cabe no modelo de estado único do
 * `useFormState`). Mesma validação e mapeamento de erro pros dois, um lugar
 * só — arquivo à parte (exigência do Next para Server Actions).
 */

import { CHAT_PERGUNTA_MAX, type FonteCitada } from "@/lib/chatSchemas";
import { ApiError, getErrorMessage } from "@/lib/api";
import { perguntarAoChat } from "@/lib/services/chatService";

type PerguntarResult =
  | { status: "success"; resposta: string; fontes: FonteCitada[] }
  | { status: "error"; message: string };

async function _perguntar(pergunta: string): Promise<PerguntarResult> {
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
  const pergunta = String(formData.get("pergunta") ?? "");
  const resultado = await _perguntar(pergunta);
  if (resultado.status === "error") return resultado;
  return { ...resultado, pergunta: pergunta.trim() };
}

/** Usada pelo `ChatWidget` — uma chamada por mensagem enviada. */
export async function perguntarWidgetAction(pergunta: string): Promise<PerguntarResult> {
  return _perguntar(pergunta);
}
