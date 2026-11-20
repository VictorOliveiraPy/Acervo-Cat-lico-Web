import Link from "next/link";

const ABAS = [
  { href: "/painel", rotulo: "Visitas" },
  { href: "/painel/videos", rotulo: "Vídeos" },
] as const;

/** Abas do painel de administração. */
export function PainelAbas({ atual }: { atual: (typeof ABAS)[number]["href"] }) {
  return (
    <nav aria-label="Painel" className="flex gap-1 border-b border-border">
      {ABAS.map(({ href, rotulo }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === atual ? "page" : undefined}
          className={`min-h-[44px] border-b-2 px-3.5 pt-3 text-meta font-semibold ${
            href === atual ? "border-accent text-ink" : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          {rotulo}
        </Link>
      ))}
    </nav>
  );
}
