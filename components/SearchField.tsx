"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { trackEvent } from "@/lib/analytics";

type Props = {
  /** Termo já buscado, para o campo não esvaziar ao voltar para /busca. */
  initialQuery?: string;
  /** Mantém a busca restrita à categoria escolhida. */
  category?: string;
  /** `prominent` é o campo da página inicial; `compact`, o do cabeçalho. */
  variant?: "compact" | "prominent";
  /** Rótulo acessível — o campo do cabeçalho não tem label visível. */
  label?: string;
  /** Texto de exemplo; distingue a busca de uma categoria da busca do cabeçalho. */
  placeholder?: string;
};

const FIELD_STYLE = {
  compact: "h-10 text-meta",
  prominent: "h-12 text-body sm:h-14",
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
  category,
  variant = "compact",
  label = "Buscar no acervo",
  placeholder,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  // O cabeçalho e a página podem ter um campo cada: o id precisa ser único.
  const inputId = useId();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({ q: query.trim() });
    if (category) params.set("categoria", category);
    trackEvent("search_submitted", {
      has_category: Boolean(category),
      query_length: query.trim().length,
    });
    router.push(`/busca?${params.toString()}`);
  }

  return (
    <form
      action="/busca"
      method="get"
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-stretch gap-1 rounded-panel border border-border-strong bg-raised p-1 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15"
    >
      {category ? <input type="hidden" name="categoria" value={category} /> : null}
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder ?? (variant === "prominent" ? "O que você deseja compreender?" : "Buscar no acervo…")}
        autoComplete="off"
        className={`${FIELD_STYLE[variant]} min-w-0 w-full border-0 bg-transparent px-3 font-sans text-ink placeholder:text-meta placeholder:text-ink-muted focus:outline-none sm:placeholder:text-[length:inherit]`}
      />
      <button
        type="submit"
        className={`${FIELD_STYLE[variant]} shrink-0 rounded-edge border border-accent bg-accent px-3 font-sans text-meta font-bold text-white transition-colors hover:bg-accent-hover sm:px-5`}
      >
        Buscar
        {variant === "prominent" ? <span aria-hidden="true" className="hidden sm:inline"> →</span> : null}
      </button>
    </form>
  );
}
