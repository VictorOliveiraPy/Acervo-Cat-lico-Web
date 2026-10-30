import Link from "next/link";

import type { MetaField } from "@/lib/entryDisplay";

/**
 * Primitivas editoriais reaproveitadas pelas páginas.
 *
 * Estão num arquivo só porque só fazem sentido juntas: são as peças que dão a
 * mesma cara a cabeçalho de página, aviso, ficha de dados, tags e fontes. Cada
 * uma existe por um papel diferente — nada aqui é "card genérico".
 */

type PageHeaderProps = {
  kicker?: string;
  title: string;
  /** Uma linha explicando o que a página mostra, na voz do leitor. */
  description?: string;
  meta?: string;
};

/** Cabeçalho de página: rótulo, título e uma linha de contexto. */
export function PageHeader({
  kicker,
  title,
  description,
  meta,
}: PageHeaderProps) {
  return (
    <div className="border-b border-border pb-8">
      {kicker ? <p className="eyebrow">{kicker}</p> : null}
      <h1 className="mt-2 font-display text-title-lg text-ink md:text-title-xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-measure text-lead text-ink-muted">
          {description}
        </p>
      ) : null}
      {meta ? <p className="mt-4 text-meta text-ink-muted">{meta}</p> : null}
    </div>
  );
}

/**
 * Aviso editorial vindo do próprio acervo (`aviso` da categoria).
 *
 * Usa a cor semântica de aviso, nunca o bordô da marca: a pessoa precisa
 * distinguir "recado sobre o conteúdo" de "identidade do site".
 */
export function EditorialNotice({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-edge border-l-2 border-warning bg-warning-soft px-5 py-4">
      <p className="kicker text-warning">Nota editorial</p>
      <p className="mt-2 max-w-measure text-meta text-ink">{children}</p>
    </aside>
  );
}

/**
 * Texto de uma oração, para ler e rezar.
 *
 * `whitespace-pre-line` preserva as quebras de linha do dado (uma por
 * verso/frase) sem precisar de `paragraphs()` — aqui a quebra de linha é
 * parte do conteúdo, não formatação de prosa a ser recomposta. A borda
 * dourada a distingue visualmente de `corpo` (a explicação em prosa que vem
 * depois): esta é a parte para rezar, o resto é contexto sobre ela.
 */
export function PrayerText({ texto }: { texto: string }) {
  return (
    <blockquote className="max-w-measure border-l-2 border-border-strong py-1 pl-6 font-display text-lead italic text-ink">
      <p className="whitespace-pre-line">{texto}</p>
    </blockquote>
  );
}

/** Ficha de dados próprios da entrada (festa, pontificado, local, anos). */
export function MetaList({ fields }: { fields: MetaField[] }) {
  if (fields.length === 0) return null;

  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {fields.map(({ label, value }) => (
        <div key={label} className="border-t border-border pt-3">
          <dt className="kicker">{label}</dt>
          <dd className="mt-1 text-body text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Tags da entrada como atalho de busca.
 *
 * Cada tag leva à busca por aquele termo em todo o acervo — é o caminho mais
 * curto entre "isto me interessou aqui" e "onde mais isto aparece".
 */
export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/busca?q=${encodeURIComponent(tag)}`}
            className="inline-flex items-center rounded-edge border border-border bg-surface px-2.5 py-1 text-meta text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Fontes citadas, como texto: o acervo não inventa link.
 *
 * `details` aberto: é o componente expansível do protótipo, sem JavaScript, mas
 * a procedência vem à vista porque vale mais que qualquer ornamento da página.
 */
export function SourceList({
  sources,
  title = "Fontes",
}: {
  sources: readonly string[];
  title?: string;
}) {
  if (sources.length === 0) return null;

  return (
    <details open id="fontes" className="group rounded-panel border border-border bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-meta font-bold text-ink [&::-webkit-details-marker]:hidden">
        <span className="flex items-baseline gap-2">
          <h2 className="font-sans text-meta font-bold text-ink">{title}</h2>
          <span className="font-normal text-ink-muted">({sources.length})</span>
        </span>
        <span aria-hidden="true" className="font-normal group-open:hidden">
          +
        </span>
        <span aria-hidden="true" className="hidden font-normal group-open:inline">
          −
        </span>
      </summary>
      <ul className="space-y-2 px-4 pb-4">
        {sources.map((source) => (
          <li key={source} className="border-t border-border pt-2 text-meta text-ink-muted">
            {source}
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * Sumário contextual do artigo, na lateral das telas grandes. Não é sidebar
 * global: só existe dentro do artigo, e some no celular para não empurrar a
 * leitura para baixo.
 */
export function PageToc({
  label,
  items,
}: {
  label: string;
  items: ReadonlyArray<{ href: string; label: string }>;
}) {
  if (items.length < 2) return null;

  return (
    <nav aria-label={label} className="sticky top-36">
      <p className="kicker border-b border-border pb-3">{label}</p>
      <ul className="mt-2 flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block py-1.5 text-meta text-ink-muted underline-offset-4 hover:text-accent hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Migalhas de navegação: acervo → categoria → entrada. */
export function Breadcrumbs({
  trail,
}: {
  trail: ReadonlyArray<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Trilha de navegação" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-meta text-ink-muted">
        {trail.map((step, index) => (
          <li key={`${step.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {step.href ? (
              <Link
                href={step.href}
                className="underline-offset-4 hover:text-accent hover:underline"
              >
                {step.label}
              </Link>
            ) : (
              <span className="text-ink">{step.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Mensagem de estado vazio ou de falha.
 *
 * `tone` separa "não achei nada" (informativo) de "deu errado" (erro) — e a
 * mensagem sempre diz o que fazer em seguida, nunca só pede desculpa.
 */
export function StatusMessage({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children?: React.ReactNode;
  tone?: "info" | "error";
}) {
  const box = tone === "error" ? "border-danger bg-danger-soft" : "border-border bg-surface";
  const heading = tone === "error" ? "text-danger" : "text-ink";

  return (
    <div className={`rounded-panel border ${box} px-6 py-8`}>
      <h2 className={`font-display text-title-sm ${heading}`}>{title}</h2>
      {children ? (
        <div className={`mt-3 max-w-measure text-body ${tone === "error" ? "text-ink" : "text-ink-muted"}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
