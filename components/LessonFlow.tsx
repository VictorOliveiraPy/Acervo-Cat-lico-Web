"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { completeLessonAction, type CompleteLessonResult } from "@/app/perfil/actions";
import type { Lesson } from "@/lib/academia";
import {
  LAST_STEP,
  LESSON_STEPS,
  isCorrectAnswer,
  readProgress,
  saveProgress,
  withStep,
} from "@/lib/academiaProgress";
import { trackEvent } from "@/lib/analytics";
import { LOGIN_ENABLED } from "@/lib/auth-public";

type Feedback = { tone: "success" | "error" | "hint"; title: string; text: string };

const FEEDBACK_STYLE: Record<Feedback["tone"], string> = {
  success: "border-success bg-success-soft text-success",
  error: "border-danger bg-danger-soft text-danger",
  hint: "border-warning bg-warning-soft text-warning",
};

/**
 * Fluxo da lição: explicação → exercício → feedback → próximo passo.
 *
 * O acerto e o erro são anunciados por `role="status"` e dizem em texto o que
 * aconteceu, nunca só por cor. Errar não trava nada: a pessoa muda a resposta
 * ou volta à explicação, e o artigo fica a um clique em qualquer etapa.
 */
export function LessonFlow({ lesson, articleHref }: { lesson: Lesson; articleHref: string }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [result, setResult] = useState<CompleteLessonResult | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Mover o foco só depois de uma ação da pessoa, nunca ao abrir a página.
  const shouldFocus = useRef(false);

  useEffect(() => {
    const saved = readProgress()[lesson.slug];
    if (saved) setStep(saved.step);
  }, [lesson.slug]);

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    headingRef.current?.focus();
  }, [step]);

  function goTo(next: number) {
    shouldFocus.current = true;
    setStep(next);
    setSelected(null);
    setFeedback(null);
    saveProgress(withStep(readProgress(), lesson.slug, next));
  }

  function startPractice() {
    trackEvent("lesson_started", { lesson: lesson.slug });
    goTo(1);
  }

  function checkAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setFeedback({
        tone: "hint",
        title: "Escolha uma alternativa.",
        text: "Selecione uma das respostas antes de verificar.",
      });
      return;
    }
    if (isCorrectAnswer(lesson, selected)) {
      setFeedback({ tone: "success", title: "Correto.", text: lesson.quiz.onCorrect });
    } else {
      setFeedback({ tone: "error", title: "Revise o conceito.", text: lesson.quiz.onWrong });
    }
  }

  function finish() {
    trackEvent("lesson_completed", { lesson: lesson.slug });
    // A lição conclui mesmo sem login ou sem API: os pontos são um extra.
    if (LOGIN_ENABLED && selected) {
      void completeLessonAction(lesson.slug, selected).then(setResult, () => undefined);
    }
    goTo(LAST_STEP);
  }

  const isCorrect = feedback?.tone === "success";

  return (
    <div>
      <ol aria-label="Progresso da lição" className="grid grid-cols-3 gap-2">
        {LESSON_STEPS.map((label, index) => {
          const isCurrent = index === step;
          const isDone = index < step;
          return (
            <li
              key={label}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex items-center gap-2 border-t-[3px] pt-3 text-meta ${
                isCurrent
                  ? "border-accent font-bold text-ink"
                  : isDone
                    ? "border-success text-ink-muted"
                    : "border-border text-ink-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-label ${
                  isCurrent
                    ? "border-accent bg-accent text-white"
                    : isDone
                      ? "border-success text-success"
                      : "border-border-strong"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span className="min-w-0">
                {label}
                {isDone ? <span className="sr-only"> (concluída)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>

      <section className="mt-6 rounded-panel border border-border bg-surface p-5 sm:p-8">
        <p className="eyebrow">
          Etapa {String(step + 1).padStart(2, "0")} / {LESSON_STEPS[step]}
        </p>

        {step === 0 ? (
          <>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 font-display text-title-lg text-ink focus:outline-none"
            >
              {lesson.concept.title}
            </h2>
            {lesson.concept.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-measure text-body text-ink-muted">
                {paragraph}
              </p>
            ))}
            {lesson.concept.highlights.length > 0 ? (
            <ul className="mt-6 grid gap-2 sm:grid-cols-3">
              {lesson.concept.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-edge border border-border bg-canvas px-3 py-5 text-center font-display text-title-sm text-ink"
                >
                  {highlight}
                </li>
              ))}
            </ul>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="button" onClick={startPractice} className="btn btn-primary">
                Responder exercício <span aria-hidden="true">→</span>
              </button>
              <Link href={articleHref} className="btn-tertiary">
                Ver artigo completo
              </Link>
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <form onSubmit={checkAnswer}>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 font-display text-title-lg text-ink focus:outline-none"
            >
              {lesson.quiz.question}
            </h2>
            <fieldset className="mt-4">
              <legend className="max-w-measure text-body text-ink-muted">
                {lesson.quiz.prompt}
              </legend>
              <div className="mt-4 flex flex-col gap-2">
                {lesson.quiz.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-edge border p-4 text-body text-ink transition-colors hover:border-accent ${
                      selected === option.id ? "border-accent bg-accent-soft" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="resposta"
                      value={option.id}
                      checked={selected === option.id}
                      onChange={() => {
                        setSelected(option.id);
                        setFeedback(null);
                      }}
                      className="mt-1.5 h-4 w-4 shrink-0 accent-accent"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Sempre no DOM: leitor de tela só anuncia a mudança de uma região
                viva que já existia antes do texto entrar. */}
            <div role="status" aria-live="polite" className="mt-4">
              {feedback ? (
                <p className={`rounded-edge border px-4 py-3 text-meta ${FEEDBACK_STYLE[feedback.tone]}`}>
                  <strong>{feedback.title}</strong> {feedback.text}
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              {isCorrect ? (
                <button type="button" onClick={finish} className="btn btn-primary">
                  Concluir lição <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Verificar resposta <span aria-hidden="true">→</span>
                </button>
              )}
              <button type="button" onClick={() => goTo(0)} className="btn-tertiary">
                Rever explicação
              </button>
            </div>
          </form>
        ) : null}

        {step === LAST_STEP ? (
          <>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 font-display text-title-lg text-ink focus:outline-none"
            >
              {lesson.completion.title}
            </h2>
            <p className="mt-4 max-w-measure text-body text-ink-muted">{lesson.completion.text}</p>
            <p className="mt-4 text-meta text-success">
              <span aria-hidden="true">✓ </span>Exercício de compreensão concluído
            </p>
            {result?.status === "saved" ? (
              <p role="status" className="mt-1 text-meta text-ink-muted">
                Salvo no seu perfil. Você tem {result.points} pontos.
              </p>
            ) : null}
            {result?.status === "anonymous" ? (
              <p role="status" className="mt-1 text-meta text-ink-muted">
                Entre com o Google para somar pontos no seu perfil.
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={articleHref} className="btn btn-primary">
                Voltar ao artigo <span aria-hidden="true">→</span>
              </Link>
              <button type="button" onClick={() => goTo(0)} className="btn btn-secondary">
                Refazer lição
              </button>
            </div>
          </>
        ) : null}
      </section>

      <p className="mt-3 text-meta text-ink-muted">
        {LOGIN_ENABLED
          ? "Sem login, o progresso fica só neste navegador. Com login, vai para o seu perfil."
          : "Sem cadastro: o progresso fica guardado só neste navegador."}
      </p>
    </div>
  );
}
