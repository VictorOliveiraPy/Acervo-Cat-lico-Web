"use server";

/**
 * Server Action do formulário de acender vela.
 *
 * Fica em arquivo à parte (exigência do Next para Server Actions) e é a
 * única ponte entre o formulário no cliente e `acenderVela` — a página em si
 * (`page.tsx`) permanece Server Component, sem `"use client"` na leitura do
 * mural.
 */

import { revalidatePath } from "next/cache";

import { ApiError, getErrorMessage } from "@/lib/api";
import { acenderVela } from "@/lib/services/velasService";
import {
  VELA_CIDADE_MAX,
  VELA_ESTADO_MAX,
  VELA_NOME_MAX,
  VELA_TIPO_SLUGS,
  type VelaTipo,
} from "@/lib/velasSchemas";

export type AcenderVelaState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Checagem propositalmente simples, espelhando `_EMAIL_RE` no backend — só
// para dar uma mensagem melhor que "erro 422" antes de ir à rede; a
// validação que vale é a do backend.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function isVelaTipo(value: FormDataEntryValue | null): value is VelaTipo {
  return typeof value === "string" && (VELA_TIPO_SLUGS as readonly string[]).includes(value);
}

export async function acenderVelaAction(
  _prevState: AcenderVelaState,
  formData: FormData,
): Promise<AcenderVelaState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const intencao = String(formData.get("intencao") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();
  const estado = String(formData.get("estado") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const tipo = formData.get("tipo");

  if (!nome) {
    return { status: "error", message: "Informe um nome (ou apelido) para acender a vela." };
  }
  if (nome.length > VELA_NOME_MAX) {
    return { status: "error", message: `O nome pode ter no máximo ${VELA_NOME_MAX} caracteres.` };
  }
  if (cidade.length > VELA_CIDADE_MAX || estado.length > VELA_ESTADO_MAX) {
    return { status: "error", message: "Cidade ou estado muito longos." };
  }
  if (email && !EMAIL_RE.test(email)) {
    return { status: "error", message: "Informe um e-mail válido (ou deixe em branco)." };
  }
  if (!isVelaTipo(tipo)) {
    return { status: "error", message: "Escolha uma vela." };
  }

  try {
    await acenderVela({ nome, intencao, tipo, cidade, estado, email });
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 429) {
      return { status: "error", message: error.message };
    }
    if (error instanceof ApiError && error.status === 503) {
      return {
        status: "error",
        message: "O mural de velas está temporariamente indisponível. Tente novamente em instantes.",
      };
    }
    return { status: "error", message: getErrorMessage(error) };
  }

  // Revalida a própria página para a vela nova aparecer no mural sem reload
  // manual — a lista vem da mesma requisição de servidor que renderiza a
  // página, então precisa ser invalidada explicitamente.
  revalidatePath("/velas");
  return { status: "success", message: "Sua vela foi acesa. Obrigado por rezar conosco." };
}
