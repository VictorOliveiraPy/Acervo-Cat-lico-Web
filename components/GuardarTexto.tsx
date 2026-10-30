"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { addFavoriteAction } from "@/app/(pt)/perfil/actions";
import { LOGIN_ENABLED } from "@/lib/auth-public";
import type { FAVORITE_KINDS } from "@/lib/perfil";

/**
 * Guarda um trecho nos favoritos do perfil. Serve em qualquer página, por exemplo:
 *
 *   <GuardarTexto tipo="Santos" texto="Paz e bem." referencia="São Francisco" />
 *
 * `urlOrigem` usa a página atual quando omitido, para o favorito levar de volta a ela.
 * É diferente do "☆ Guardar" dos verbetes (`EntryActions`), que marca a página inteira
 * neste navegador; este botão guarda o texto na conta da pessoa.
 */
export function GuardarTexto({
  tipo,
  texto,
  referencia = "",
  urlOrigem,
  rotulo = "Guardar texto",
  className = "btn btn-secondary",
}: {
  tipo: (typeof FAVORITE_KINDS)[number];
  texto: string;
  referencia?: string;
  urlOrigem?: string;
  rotulo?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "pending" | "saved" | "anonymous">("idle");
  const [error, setError] = useState("");

  if (!LOGIN_ENABLED) return null;

  async function save() {
    setState("pending");
    setError("");
    const result = await addFavoriteAction({
      tipo,
      texto,
      referencia,
      url_origem: urlOrigem ?? pathname,
    });
    if (result.status === "error") {
      setState("idle");
      setError(result.message);
    } else {
      setState(result.status);
    }
  }

  if (state === "anonymous") {
    return (
      <a
        href={`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`}
        className="text-meta text-accent underline underline-offset-2"
      >
        Entre com o Google para guardar
      </a>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void save()}
        disabled={state === "pending" || state === "saved"}
        className={`${className} disabled:opacity-60`}
      >
        {state === "saved" ? "Guardado" : state === "pending" ? "Guardando…" : rotulo}
      </button>
      <span role="status" aria-live="polite" className="text-meta text-ink-muted">
        {error}
      </span>
    </span>
  );
}
