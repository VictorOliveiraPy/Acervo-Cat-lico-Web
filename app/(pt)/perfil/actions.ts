"use server";

import { revalidatePath } from "next/cache";

import { LESSONS, lessonBySlug } from "@/lib/academia";
import { isCorrectAnswer } from "@/lib/academiaProgress";
import { ApiError } from "@/lib/api";
import { currentUser } from "@/lib/auth";
import { isPatronId } from "@/lib/padroeiros";
import {
  favoriteInputSchema,
  noteInputSchema,
  type Favorite,
  type FavoriteInput,
  type Note,
  type NoteInput,
} from "@/lib/perfil";
import { CATEGORY_SLUGS } from "@/lib/schemas";
import {
  addFavorite,
  addNote,
  completeLessons,
  deleteFavorite,
  deleteNote,
  deleteProfile,
  setPatron,
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

export type SaveItemResult<T> =
  | { status: "saved"; item: T }
  | { status: "anonymous" }
  | { status: "error"; message: string };

export type DeleteItemResult = { status: "deleted" | "anonymous" | "error" };

function saveFailure(error: ApiError): { status: "error"; message: string } {
  const messages: Record<number, string> = {
    409: "Você chegou ao limite de 500 itens nesta lista. Apague um para guardar outro.",
    429: "Espere um instante antes de guardar de novo.",
  };
  return {
    status: "error",
    message: messages[error.status] ?? "Não foi possível salvar agora. Tente de novo em instantes.",
  };
}

export async function setPatronAction(
  padroeiroId: string,
): Promise<{ status: "saved" | "anonymous" | "error" }> {
  if (!isPatronId(padroeiroId)) return { status: "error" };
  const user = await currentUser();
  if (!user) return { status: "anonymous" };

  try {
    await setPatron(user.subject, padroeiroId);
  } catch (error: unknown) {
    if (error instanceof ApiError) return { status: "error" };
    throw error;
  }
  revalidatePath("/perfil");
  return { status: "saved" };
}

export async function addFavoriteAction(input: FavoriteInput): Promise<SaveItemResult<Favorite>> {
  const parsed = favoriteInputSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Confira o texto: ele pode ter até 2000 caracteres." };

  const user = await currentUser();
  if (!user) return { status: "anonymous" };

  try {
    // O botão "Guardar" pode ser o primeiro contato da pessoa com o perfil.
    await syncProfile(user.subject, user.name);
    const item = await addFavorite(user.subject, parsed.data);
    revalidatePath("/perfil");
    return { status: "saved", item };
  } catch (error: unknown) {
    if (error instanceof ApiError) return saveFailure(error);
    throw error;
  }
}

export async function deleteFavoriteAction(id: number): Promise<DeleteItemResult> {
  const user = await currentUser();
  if (!user) return { status: "anonymous" };

  try {
    await deleteFavorite(user.subject, id);
  } catch (error: unknown) {
    if (error instanceof ApiError) return { status: "error" };
    throw error;
  }
  revalidatePath("/perfil");
  return { status: "deleted" };
}

export async function addNoteAction(input: NoteInput): Promise<SaveItemResult<Note>> {
  const parsed = noteInputSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Confira o texto: ele pode ter até 2000 caracteres." };

  const user = await currentUser();
  if (!user) return { status: "anonymous" };

  try {
    await syncProfile(user.subject, user.name);
    const item = await addNote(user.subject, parsed.data);
    revalidatePath("/perfil");
    return { status: "saved", item };
  } catch (error: unknown) {
    if (error instanceof ApiError) return saveFailure(error);
    throw error;
  }
}

export async function deleteNoteAction(id: number): Promise<DeleteItemResult> {
  const user = await currentUser();
  if (!user) return { status: "anonymous" };

  try {
    await deleteNote(user.subject, id);
  } catch (error: unknown) {
    if (error instanceof ApiError) return { status: "error" };
    throw error;
  }
  revalidatePath("/perfil");
  return { status: "deleted" };
}

export async function deleteAccountAction(): Promise<void> {
  const user = await currentUser();
  if (!user) return;
  await deleteProfile(user.subject);
  revalidatePath("/perfil");
}
