"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";

const FAVORITES_KEY = "compendio:favorites";

type Props = {
  categoria: string;
  slug: string;
  titulo: string;
};

function favoriteKey(categoria: string, slug: string): string {
  return `${categoria}/${slug}`;
}

export function EntryActions({ categoria, slug, titulo }: Props) {
  const key = favoriteKey(categoria, slug);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
      setIsFavorite(Array.isArray(saved) && saved.includes(key));
    } catch {
      setIsFavorite(false);
    }
  }, [key]);

  function toggleFavorite() {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
      const favorites = Array.isArray(saved) ? saved.filter((item) => typeof item === "string") : [];
      const next = isFavorite
        ? favorites.filter((item) => item !== key)
        : [...favorites, key];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      setIsFavorite(!isFavorite);
      setMessage(isFavorite ? "Removido dos seus favoritos." : "Salvo nos seus favoritos.");
      trackEvent("entry_favorited", { action: isFavorite ? "remove" : "add" });
    } catch {
      setMessage("Não foi possível salvar neste navegador.");
    }
  }

  async function shareEntry() {
    const url = window.location.href;
    const nativeShareAvailable = typeof navigator.share === "function";
    try {
      if (nativeShareAvailable) {
        await navigator.share({ title: titulo, text: `Leia: ${titulo}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("Link copiado para a área de transferência.");
      }
      trackEvent("entry_shared", { method: nativeShareAvailable ? "native" : "clipboard" });
    } catch {
      setMessage("Compartilhamento cancelado.");
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3" aria-label="Ações da entrada">
      <button
        type="button"
        onClick={toggleFavorite}
        className="rounded-edge border border-bordeaux px-4 py-2 text-label uppercase tracking-[0.09em] text-bordeaux transition-colors hover:bg-bordeaux hover:text-parchment-raised"
        aria-pressed={isFavorite}
      >
        {isFavorite ? "★ Salvo" : "☆ Guardar"}
      </button>
      <button
        type="button"
        onClick={shareEntry}
        className="rounded-edge border border-rule-faint px-4 py-2 text-label uppercase tracking-[0.09em] text-ink-muted transition-colors hover:border-bordeaux hover:text-bordeaux"
      >
        Compartilhar
      </button>
      {message ? (
        <span className="text-meta text-ink-muted" role="status" aria-live="polite">
          {message}
        </span>
      ) : null}
    </div>
  );
}