"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  /** Termo já buscado, para o campo não esvaziar ao voltar para /busca. */
  initialQuery?: string;
  /** `prominent` é o campo da página inicial; `compact`, o do cabeçalho. */
  variant?: "compact" | "prominent";
  /** Rótulo acessível — o campo do cabeçalho não tem label visível. */
  label?: string;
};

const FIELD_STYLE = {
  compact: "h-10 text-meta",
  prominent: "h-14 text-lead",
} as const;

/**
 * Campo de busca que leva para `/busca`.
 *
 * É um `form` com `action="/busca"` de propósito: sem JavaScript, o submit
 * ainda navega para a página de resultados (renderizada no servidor). O
 * `router.push` só evita o recarregamento quando há JS.
 *
 * O botão nunca fica desabilitado: quem valida o tamanho mínimo do termo é a
 * página de busca, que sabe explicar o que fazer — botão morto sem explicação
 * deixa a pessoa sem saber por que nada aconteceu (e quebraria o submit por
 * Enter no caminho sem JS).
 */
export function SearchField({
  initialQuery = "",
  variant = "compact",
  label = "Buscar no acervo",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form
      action="/busca"
      method="get"
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-stretch gap-2"
    >
      <label className="sr-only" htmlFor={`search-${variant}`}>
        {label}
      </label>
      <input
        id={`search-${variant}`}
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar qualquer tema do mundo católico…"
        autoComplete="off"
        className={`${FIELD_STYLE[variant]} w-full rounded-edge border border-rule-faint bg-parchment-raised px-3 font-body text-ink placeholder:text-ink-muted/80 focus:border-bordeaux focus:outline-none`}
      />
      <button
        type="submit"
        className={`${FIELD_STYLE[variant]} shrink-0 rounded-edge border border-bordeaux bg-bordeaux px-5 font-body text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft`}
      >
        Buscar
      </button>
    </form>
  );
}
