"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { whatsappShareUrl } from "@/lib/entryDisplay";

const FAVORITES_KEY = "compendio:favorites";

type Props = {
  categoria: string;
  slug: string;
  titulo: string;
};

function favoriteKey(categoria: string, slug: string): string {
  return `${categoria}/${slug}`;
}

function useShare(titulo: string) {
  const [shareMessage, setShareMessage] = useState("");

  async function share() {
    const url = window.location.href;
    const nativeShareAvailable = typeof navigator.share === "function";
    try {
      if (nativeShareAvailable) {
        await navigator.share({ title: titulo, text: `Leia: ${titulo}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copiado para a área de transferência.");
      }
      trackEvent("entry_shared", { method: nativeShareAvailable ? "native" : "clipboard" });
    } catch {
      setShareMessage("Compartilhamento cancelado.");
    }
  }

  return { share, shareMessage };
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

  const { share, shareMessage } = useShare(titulo);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3" aria-label="Ações da entrada">
      <button
        type="button"
        onClick={toggleFavorite}
        className="btn btn-secondary"
        aria-pressed={isFavorite}
      >
        {isFavorite ? "★ Salvo" : "☆ Guardar"}
      </button>
      <button
        type="button"
        onClick={share}
        className="btn btn-secondary"
      >
        Compartilhar
      </button>
      {message || shareMessage ? (
        <span className="text-meta text-ink-muted" role="status" aria-live="polite">
          {message || shareMessage}
        </span>
      ) : null}
    </div>
  );
}

/** Compartilhar no fim do artigo. `url` vem do servidor: o link já sai pronto no HTML. */
export function EntryShare({ titulo, url }: { titulo: string; url: string }) {
  const { share, shareMessage } = useShare(titulo);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3" aria-label="Compartilhar esta entrada">
      <button type="button" onClick={share} className="btn btn-secondary">
        Compartilhar
      </button>
      <a
        href={whatsappShareUrl(titulo, url)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("entry_shared", { method: "whatsapp" })}
        className="btn btn-secondary"
      >
        Compartilhar no WhatsApp
      </a>
      {shareMessage ? (
        <span className="text-meta text-ink-muted" role="status" aria-live="polite">
          {shareMessage}
        </span>
      ) : null}
    </div>
  );
}
