/**
 * Faixa editorial da home: um assunto, uma ação. É o substituto dos banners de
 * foto de ponta a ponta, que o guia aprovado desaconselha como fundo de tela.
 */
export function EditorialStrip({
  eyebrow,
  title,
  description,
  media,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  media?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-start gap-4 rounded-panel border border-border bg-surface p-5">
      {media}
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 font-display text-title-sm text-ink">{title}</h2>
        <p className="mt-1 text-meta text-ink-muted">{description}</p>
        <div className="mt-3">{children}</div>
      </div>
    </section>
  );
}
