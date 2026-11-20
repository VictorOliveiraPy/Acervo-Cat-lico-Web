import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/Editorial";
import { ReelCard } from "@/components/ReelCard";
import { parseTema, REEL_TEMAS } from "@/lib/reels";
import { fetchReels } from "@/lib/services/reelsService";
import { INSTAGRAM_URL } from "@/lib/site";

const DESCRIPTION =
  "Santos, Bíblia, Missa e história da Igreja em vídeos curtos do Compêndio Católico. Filtre pelo tema que você quer ver.";

export const metadata: Metadata = {
  title: "Reels",
  description: DESCRIPTION,
  alternates: { canonical: "/reels" },
};

function FilterLink({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-[36px] items-center rounded-full border px-3 text-meta transition-colors ${
        active ? "border-ink bg-ink text-canvas" : "border-border text-ink hover:border-accent"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function ReelsPage({ searchParams }: { searchParams: { tema?: string | string[] } }) {
  const tema = parseTema(searchParams.tema);
  const { itens: reels } = await fetchReels(tema);

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader kicker="Vídeos" title="Reels" description={DESCRIPTION} />
      <div className="mt-6">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Seguir no Instagram <span aria-hidden="true">→</span>
        </a>
      </div>

      <nav aria-label="Filtrar por tema" className="mt-8 flex flex-wrap gap-2">
        <FilterLink href="/reels" active={!tema}>
          Todos
        </FilterLink>
        {Object.entries(REEL_TEMAS).map(([id, label]) => (
          <FilterLink key={id} href={`/reels?tema=${id}`} active={tema === id}>
            {label}
          </FilterLink>
        ))}
      </nav>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {reels.map((reel) => (
          <li key={reel.slug}>
            <ReelCard reel={reel} />
          </li>
        ))}
      </ul>
    </div>
  );
}
