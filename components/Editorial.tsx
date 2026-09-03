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
    <div className="border-b border-rule-faint pb-8">
      {kicker ? <p className="kicker">{kicker}</p> : null}
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
    <aside className="rounded-edge border-l-2 border-state-notice bg-gold-wash/40 px-5 py-4">
      <p className="kicker text-state-notice">Nota editorial</p>
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
    <blockquote className="max-w-measure border-l-2 border-gold py-1 pl-6 font-display text-lead italic text-ink">
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
        <div key={label} className="border-t border-rule-faint pt-3">
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
            className="inline-flex items-center rounded-edge border border-rule-faint bg-parchment-raised px-2.5 py-1 text-meta text-ink-muted transition-colors hover:border-bordeaux hover:text-bordeaux"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Fontes citadas pela entrada, como texto — o acervo não inventa link. */
export function SourceList({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="fontes">
      <h2 id="fontes" className="kicker">
        Fontes
      </h2>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li
            key={source}
            className="max-w-measure border-t border-rule-faint pt-2 text-meta text-ink-muted"
          >
            {source}
          </li>
        ))}
      </ul>
    </section>
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
                className="underline-offset-4 hover:text-bordeaux hover:underline"
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
  const border = tone === "error" ? "border-state-error" : "border-rule-faint";
  const heading = tone === "error" ? "text-state-error" : "text-ink";

  return (
    <div className={`rounded-edge border ${border} bg-parchment-raised px-6 py-8`}>
      <h2 className={`font-display text-title-sm ${heading}`}>{title}</h2>
      {children ? (
        <div className="mt-3 max-w-measure text-body text-ink-muted">
          {children}
        </div>
      ) : null}
    </div>
  );
}
