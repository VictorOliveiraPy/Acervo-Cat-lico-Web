import { z } from "zod";

import type { Lesson } from "@/lib/academia";

/**
 * Progresso das lições, guardado neste navegador.
 *
 * Sem conta nem backend de Academia, o `localStorage` é o único lugar honesto
 * para isso, o mesmo usado por favoritos e tamanho do texto. O progresso não
 * acompanha a pessoa em outro aparelho, e o texto da tela diz isso.
 */

/**
 * A resposta certa é decidida aqui, e não dentro da tela. Fica neste módulo, e não
 * em `lib/academia.ts`, para a tela da lição não levar o texto de todas as lições.
 */
export function isCorrectAnswer(lesson: Lesson, optionId: string): boolean {
  return lesson.quiz.correctId === optionId;
}

export const PROGRESS_STORAGE_KEY = "compendio:academia:progress";

/** 0 = compreender, 1 = praticar, 2 = concluir. */
export const LESSON_STEPS = ["Compreender", "Praticar", "Concluir"] as const;
export const LAST_STEP = LESSON_STEPS.length - 1;

const lessonProgressSchema = z.object({
  step: z.number().int().min(0).max(LAST_STEP),
  completed: z.boolean(),
});

const progressSchema = z.record(lessonProgressSchema);

export type LessonProgress = z.infer<typeof lessonProgressSchema>;
export type ProgressMap = z.infer<typeof progressSchema>;

export type LessonStatus = "not_started" | "in_progress" | "completed";

/**
 * Lê o que estiver salvo. O conteúdo do `localStorage` pode ter sido editado à
 * mão ou vir de outra versão: se não bater com o formato, vale como vazio em
 * vez de quebrar a lição.
 */
export function parseProgress(raw: string | null): ProgressMap {
  if (!raw) return {};
  try {
    const parsed = progressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

/** Avança sem nunca desfazer uma conclusão: refazer a lição não apaga o feito. */
export function withStep(progress: ProgressMap, slug: string, step: number): ProgressMap {
  const completed = (progress[slug]?.completed ?? false) || step === LAST_STEP;
  return { ...progress, [slug]: { step, completed } };
}

export function lessonStatus(progress: ProgressMap, slug: string): LessonStatus {
  const lesson = progress[slug];
  if (!lesson) return "not_started";
  if (lesson.completed) return "completed";
  return lesson.step > 0 ? "in_progress" : "not_started";
}

export function readProgress(): ProgressMap {
  try {
    return parseProgress(localStorage.getItem(PROGRESS_STORAGE_KEY));
  } catch {
    return {};
  }
}

/** Sem armazenamento disponível a lição continua funcionando, só não é lembrada. */
export function saveProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Modo privado ou cota cheia: nada a fazer, e nada que impeça o estudo.
  }
}
