import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/Editorial";
import { LessonProgressLink } from "@/components/LessonProgressLink";
import { LESSONS, indexableLessons } from "@/lib/academia";

const DESCRIPTION =
  "Lições curtas com explicação, exercício e feedback, sem cadastro. Os artigos do acervo continuam abertos a todos.";

// Sem lição revisada, a página não tem o que oferecer aos buscadores ainda.
export const metadata: Metadata = {
  title: "Academia da Fé",
  description: DESCRIPTION,
  alternates: { canonical: "/academia" },
  robots: { index: indexableLessons().length > 0, follow: true },
};

export default function AcademiaPage() {
  const modules = [...new Set(LESSONS.map((lesson) => lesson.module))];

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <PageHeader
        kicker="Academia da Fé"
        title="Aprender, uma etapa por vez."
        description={DESCRIPTION}
      />

      {modules.map((module) => (
        <section key={module} aria-labelledby={`modulo-${module}`} className="mt-10">
          <h2 id={`modulo-${module}`} className="font-display text-title-md text-ink">
            {module}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {LESSONS.filter((lesson) => lesson.module === module).map((lesson) => (
              <li key={lesson.slug} className="rounded-panel border border-border bg-surface p-5">
                <h3 className="font-display text-title-sm text-ink">{lesson.title}</h3>
                <p className="mt-1 text-meta text-ink-muted">{lesson.subtitle}</p>
                {lesson.review === "pending" ? (
                  <p className="mt-2 text-meta text-warning">Em revisão editorial</p>
                ) : null}
                <div className="mt-4">
                  <LessonProgressLink slug={lesson.slug} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-10 max-w-measure text-meta text-ink-muted">
        A Academia não pontua oração nem mede vida espiritual: etapas e pontos servem só para
        acompanhar o estudo. Nenhum artigo depende de uma lição para ser lido.{" "}
        <Link href="/ranking" className="text-accent underline underline-offset-4">
          Ver o ranking
        </Link>
      </p>
    </div>
  );
}
