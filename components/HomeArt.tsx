/**
 * Janela gótica do herói da home, do protótipo aprovado. É a única assinatura
 * arquitetônica da página: abstrata, decorativa e sem retrato de santo, para o
 * gótico continuar discreto. As cores são da própria ilustração, derivadas do
 * azul-mineral e do bordô dos tokens.
 */
export function GothicWindow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 465" fill="none" aria-hidden="true" className={className}>
      <path d="M36 434V176C36 108 100 53 210 13c110 40 174 95 174 163v258" stroke="#586c74" strokeWidth="2" />
      <path d="M55 434V185C55 128 118 73 210 38c92 35 155 90 155 147v249" stroke="#96a6a8" strokeWidth="1.5" />
      <path d="M74 434V198c0-49 54-96 136-133 82 37 136 84 136 133v236" fill="#d6dfdf" stroke="#5e757e" strokeWidth="1.5" />
      <path d="M85 434V209c0-48 54-96 125-128 71 32 125 80 125 128v225" fill="#273d49" />
      <path d="M107 434V215c0-37 43-80 103-108 60 28 103 71 103 108v219" stroke="#71909c" />
      <path d="M130 434V224c0-31 33-65 80-91 47 26 80 60 80 91v210" stroke="#71909c" />
      <path d="M154 434V237c0-24 22-51 56-73 34 22 56 49 56 73v197" stroke="#71909c" />
      <path d="M210 81v353" stroke="#71909c" strokeWidth="1.2" />
      <path d="M74 308h272M85 365h250" stroke="#71909c" />
      <circle cx="210" cy="206" r="31" fill="#e1e5db" stroke="#d7b9a6" />
      <circle cx="210" cy="206" r="22" stroke="#8c313e" strokeWidth="1.6" />
      <path d="M210 182v48m-24-24h48M194 190l32 32m0-32-32 32" stroke="#8c313e" strokeWidth="1.3" />
      <path d="m108 351 49-37 53 37 53-37 49 37" stroke="#b8ccd0" strokeWidth="1.3" />
      <path d="M136 435v-61m148 61v-61" stroke="#b8ccd0" strokeWidth="1.5" />
      <path d="M36 434h348M12 447h396" stroke="#7e9193" strokeWidth="2" />
      <path d="M74 311c46 17 83 15 136-7 53 22 90 24 136 7v123H74V311Z" fill="#3d5660" fillOpacity=".35" />
      <path d="M78 170c0-39 49-90 132-127 83 37 132 88 132 127" stroke="#8c313e" strokeOpacity=".65" strokeWidth="1.5" />
      <path d="M74 435v-96m272 96v-96" stroke="#a1b7bc" strokeWidth="2" />
      <path d="m36 435 20-26m328 26-20-26" stroke="#586c74" strokeWidth="2" />
    </svg>
  );
}

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
