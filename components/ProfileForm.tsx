"use client";

import { signOut } from "next-auth/react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteAccountAction,
  saveProfileAction,
  type SaveProfileState,
} from "@/app/(pt)/perfil/actions";

const INITIAL_STATE: SaveProfileState = { status: "idle" };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
      {pending ? "Salvando…" : "Salvar perfil"}
    </button>
  );
}

export function ProfileForm({
  nome,
  preferencias,
  noRanking,
  categories,
}: {
  nome: string;
  preferencias: readonly string[];
  noRanking: boolean;
  categories: ReadonlyArray<{ slug: string; label: string }>;
}) {
  const [state, action] = useFormState(saveProfileAction, INITIAL_STATE);

  async function removeAccount() {
    const confirmed = window.confirm(
      "Apagar seu perfil, pontos, lições concluídas, textos favoritos e anotações? Isso não pode ser desfeito.",
    );
    if (!confirmed) return;
    await deleteAccountAction();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6 rounded-panel border border-border bg-surface p-6">
        <div>
          <label htmlFor="nome" className="kicker">
            Nome de exibição
          </label>
          <input
            id="nome"
            name="nome"
            defaultValue={nome}
            minLength={2}
            maxLength={40}
            required
            className="mt-2 w-full max-w-md rounded-edge border border-border-strong bg-raised px-4 py-2.5 text-body text-ink focus:border-accent focus:outline-none"
          />
        </div>

        <fieldset>
          <legend className="kicker">Temas de interesse</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ slug, label }) => (
              <label key={slug} className="flex items-center gap-2 text-meta text-ink">
                <input
                  type="checkbox"
                  name="preferencias"
                  value={slug}
                  defaultChecked={preferencias.includes(slug)}
                  className="h-4 w-4 accent-accent"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex items-start gap-2 text-meta text-ink">
          <input
            type="checkbox"
            name="no_ranking"
            defaultChecked={noRanking}
            className="mt-0.5 h-4 w-4 accent-accent"
          />
          <span>Mostrar meu nome de exibição e meus pontos no ranking público.</span>
        </label>

        <div role="status" aria-live="polite" className="text-meta text-ink-muted">
          {state.message}
        </div>
        <div>
          <SaveButton />
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="btn btn-secondary">
          Sair
        </button>
        <button type="button" onClick={() => void removeAccount()} className="btn btn-secondary">
          Apagar minha conta
        </button>
      </div>
    </div>
  );
}
