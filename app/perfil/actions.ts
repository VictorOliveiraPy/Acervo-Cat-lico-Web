"use server";

import { revalidatePath } from "next/cache";

import { LESSONS, lessonBySlug } from "@/lib/academia";
import { isCorrectAnswer } from "@/lib/academiaProgress";
import { ApiError } from "@/lib/api";
import { currentUser } from "@/lib/auth";
import { CATEGORY_SLUGS } from "@/lib/schemas";
import {
  completeLessons,
  deleteProfile,
  syncProfile,
  updateProfile,
} from "@/lib/services/perfilService";

export type SaveProfileState = { status: "idle" | "success" | "error"; message?: string };

export async function saveProfileAction(
  _state: SaveProfileState,
  formData: FormData,
): Promise<SaveProfileState> {
  const user = await currentUser();
  if (!user) return { status: "error", message: "Entre com o Google para salvar." };

  const nome = String(formData.get("nome") ?? "").trim();
  if (nome.length < 2 || nome.length > 40) {
    return { status: "error", message: "O nome de exibição precisa ter de 2 a 40 caracteres." };
  }
  const known = new Set<string>(CATEGORY_SLUGS);
  const preferencias = formData.getAll("preferencias").map(String).filter((slug) => known.has(slug));

  try {
    await updateProfile(user.subject, {
      nome,
      preferencias,
      no_ranking: formData.get("no_ranking") === "on",
    });
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
    return { status: "error", message: "Não foi possível salvar agora. Tente de novo em instantes." };
  }
  revalidatePath("/perfil");
  return { status: "success", message: "Perfil salvo." };
}

export type CompleteLessonResult =
  | { status: "saved"; points: number }
  | { status: "anonymous" }
  | { status: "error" };

/** Confere a resposta aqui, no servidor, antes de somar os pontos. */
export async function completeLessonAction(
  slug: string,
  optionId: string,
): Promise<CompleteLessonResult> {
  const lesson = lessonBySlug(slug);
  if (!lesson || !isCorrectAnswer(lesson, optionId)) return { status: "error" };

  const user = await currentUser();
  if (!user) return { status: "anonymous" };

  try {
    await syncProfile(user.subject, user.name);
    const profile = await completeLessons(user.subject, [slug]);
    return { status: "saved", points: profile.pontos };
  } catch (error: unknown) {
    if (error instanceof ApiError) return { status: "error" };
    throw error;
  }
}

/** Leva para a conta o que foi concluído neste navegador antes do login. */
export async function importLocalProgressAction(slugs: string[]): Promise<void> {
  const user = await currentUser();
  if (!user) return;

  const known = new Set(LESSONS.map(({ slug }) => slug));
  const valid = slugs.filter((slug) => known.has(slug));
  if (valid.length === 0) return;

  try {
    await syncProfile(user.subject, user.name);
    await completeLessons(user.subject, valid);
  } catch (error: unknown) {
    if (!(error instanceof ApiError)) throw error;
  }
}

export async function deleteAccountAction(): Promise<void> {
  const user = await currentUser();
  if (!user) return;
  await deleteProfile(user.subject);
  revalidatePath("/perfil");
}
