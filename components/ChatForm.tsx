"use client";

import Link from "next/link";
import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { perguntarAction, type PerguntarState } from "@/app/perguntar/actions";
import { CATEGORY_LABELS, entryPath } from "@/lib/categories";
import { CHAT_PERGUNTA_MAX, type FonteCitada } from "@/lib/chatSchemas";
import { isCategorySlug } from "@/lib/schemas";

const INITIAL_STATE: PerguntarState = { status: "idle" };

/** Botão de envio: só ele sabe do `pending` (`useFormStatus` exige estar
 * dentro do `<form>`) — mesmo padrão de `VelaForm.tsx`. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-edge border border-bordeaux bg-bordeaux px-6 py-3 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Perguntando…" : "Perguntar"}
    </button>
  );
}

/** Uma fonte citada, com link pro verbete real quando a categoria é
 * reconhecida — a API sempre devolve uma categoria válida, mas o contrato
 * no frontend não estreita esse tipo, então a checagem fica aqui. */
function FonteLink({ fonte }: { fonte: FonteCitada }) {
  if (!isCategorySlug(fonte.categoria)) {
    return <span className="text-ink-muted">{fonte.titulo}</span>;
  }
  return (
    <Link
      href={entryPath(fonte.categoria, fonte.slug)}
      className="text-bordeaux underline-offset-4 hover:underline"
    >
      {fonte.titulo}
      <span className="text-ink-muted"> — {CATEGORY_LABELS[fonte.categoria].nav}</span>
    </Link>
  );
}

export function ChatForm() {
  const [state, formAction] = useFormState(perguntarAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div>
      <form ref={formRef} action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="pergunta" className="sr-only">
            Sua pergunta
          </label>
          <textarea
            id="pergunta"
            name="pergunta"
            required
            maxLength={CHAT_PERGUNTA_MAX}
            rows={2}
            placeholder="Pergunte algo sobre fé, doutrina ou vida católica…"
            className="w-full resize-none rounded-edge border border-rule-faint bg-parchment-raised px-4 py-3 text-body text-ink placeholder:text-ink-muted focus:border-bordeaux focus:outline-none"
          />
        </div>
        <SubmitButton />
      </form>

      {state.status === "error" ? (
        <p className="mt-4 text-meta text-state-error">{state.message}</p>
      ) : null}

      {state.status === "success" ? (
        <div className="mt-8 border-t border-rule-faint pt-6">
          <p className="kicker text-bordeaux">Você perguntou</p>
          <p className="mt-1 max-w-measure text-body text-ink-muted">{state.pergunta}</p>

          <p className="mt-6 kicker text-bordeaux">Resposta</p>
          <p className="mt-2 max-w-measure text-body leading-loose text-ink">{state.resposta}</p>

          {state.fontes && state.fontes.length > 0 ? (
            <div className="mt-6">
              <p className="kicker">Fontes consultadas no acervo</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {state.fontes.map((fonte) => (
                  <li key={`${fonte.categoria}/${fonte.slug}`} className="text-meta">
                    <FonteLink fonte={fonte} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
