"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { entryPath } from "@/lib/categories";
import { whatsappShareUrl } from "@/lib/entryDisplay";
import { SITE_URL } from "@/lib/site";
import type { CategorySlug } from "@/lib/schemas";

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
  const entryUrl = `${SITE_URL}${entryPath(categoria as CategorySlug, slug)}`;

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
      <a
        href={whatsappShareUrl(titulo, entryUrl)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("entry_shared", { method: "whatsapp" })}
        className="btn btn-secondary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.124 1.523 5.855L.054 23.454a.5.5 0 0 0 .613.613l5.6-1.469A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.966 9.966 0 0 1-5.126-1.407l-.367-.219-3.8.997.998-3.8-.22-.368A9.965 9.965 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        WhatsApp
      </a>
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
