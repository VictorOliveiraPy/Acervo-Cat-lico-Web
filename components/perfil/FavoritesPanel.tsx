"use client";

import Link from "next/link";
import { useState } from "react";

import { addFavoriteAction, deleteFavoriteAction } from "@/app/(pt)/perfil/actions";
import { FAVORITE_KINDS, MAX_TEXT_LENGTH, type Favorite } from "@/lib/perfil";

const FILTERS = ["Todos", ...FAVORITE_KINDS] as const;
const QUIET_BUTTON = "min-h-[44px] rounded-edge px-3 text-meta text-ink-muted hover:text-accent";
const FIELD =
  "min-w-0 rounded-edge border border-border-strong bg-raised px-3 py-2.5 text-meta text-ink focus:border-accent focus:outline-none";

function CopyButton({ favorite }: { favorite: Favorite }) {
  const [label, setLabel] = useState("Copiar");

  async function copy() {
    const reference = favorite.referencia ? ` (${favorite.referencia})` : "";
    try {
      await navigator.clipboard.writeText(`"${favorite.texto}"${reference}`);
      setLabel("Copiado");
    } catch {
      setLabel("Selecione e copie");
    }
    window.setTimeout(() => setLabel("Copiar"), 1600);
  }

  return (
    <button type="button" onClick={() => void copy()} className={QUIET_BUTTON}>
      {label}
    </button>
  );
}

export function FavoritesPanel({
  favorites,
  onChange,
}: {
  favorites: readonly Favorite[];
  onChange: (next: Favorite[]) => void;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const visible = favorites.filter((item) => filter === "Todos" || item.tipo === filter);

  async function add(form: HTMLFormElement) {
    const data = new FormData(form);
    setPending(true);
    setMessage("");
    const result = await addFavoriteAction({
      tipo: String(data.get("tipo")) as (typeof FAVORITE_KINDS)[number],
      texto: String(data.get("texto") ?? ""),
      referencia: String(data.get("referencia") ?? ""),
    });
    setPending(false);
    if (result.status === "saved") {
      onChange([result.item, ...favorites]);
      form.reset();
      setFilter("Todos");
    } else {
      setMessage(result.status === "anonymous" ? "Entre com o Google para guardar." : result.message);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Remover este texto dos seus favoritos?")) return;
    const result = await deleteFavoriteAction(id);
    if (result.status === "deleted") onChange(favorites.filter((item) => item.id !== id));
    else setMessage("Não foi possível remover agora. Tente de novo em instantes.");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === filter}
            onClick={() => setFilter(option)}
            className={`min-h-[36px] rounded-full border px-3 text-meta transition-colors ${
              option === filter
                ? "border-ink bg-ink text-canvas"
                : "border-border text-ink hover:border-accent"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
          {visible.map((favorite) => (
            <li key={favorite.id}>
              <article className="flex h-full flex-col gap-2.5 rounded-panel border border-border bg-surface px-5 pb-2 pt-5">
                <p className="eyebrow">{favorite.tipo}</p>
                <blockquote className="whitespace-pre-line break-words font-display text-title-sm text-ink">
                  {favorite.texto}
                </blockquote>
                {favorite.referencia ? (
                  <p className="text-meta text-ink-muted">
                    {favorite.url_origem ? (
                      <Link href={favorite.url_origem} className="underline underline-offset-2 hover:text-accent">
                        {favorite.referencia}
                      </Link>
                    ) : (
                      favorite.referencia
                    )}
                  </p>
                ) : null}
                <div className="mt-auto flex justify-end gap-1 border-t border-border pt-1">
                  <CopyButton favorite={favorite} />
                  <button type="button" onClick={() => void remove(favorite.id)} className={QUIET_BUTTON}>
                    Remover
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-meta text-ink-muted">Nenhum texto guardado neste filtro ainda.</p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void add(event.currentTarget);
        }}
        className="grid gap-2 min-[820px]:grid-cols-[2fr_1fr_140px_auto]"
      >
        <label className="contents">
          <span className="sr-only">Texto</span>
          <input
            name="texto"
            required
            maxLength={MAX_TEXT_LENGTH}
            placeholder="Cole um trecho que tocou você"
            className={FIELD}
          />
        </label>
        <label className="contents">
          <span className="sr-only">Referência</span>
          <input name="referencia" maxLength={200} placeholder="Referência (ex.: Sl 23,1)" className={FIELD} />
        </label>
        <label className="contents">
          <span className="sr-only">Tipo</span>
          <select name="tipo" className={FIELD}>
            {FAVORITE_KINDS.map((kind) => (
              <option key={kind}>{kind}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </form>
      <p role="status" aria-live="polite" className="text-meta text-ink-muted">
        {message}
      </p>
    </div>
  );
}
