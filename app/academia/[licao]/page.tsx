import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, EditorialNotice, SourceList } from "@/components/Editorial";
import { LessonFlow } from "@/components/LessonFlow";
import { LESSONS, lessonBySlug } from "@/lib/academia";
import { entryPath } from "@/lib/categories";
import { saintAssetFor } from "@/lib/saintAssets";

type Params = { licao: string };

export function generateStaticParams(): Params[] {
  return LESSONS.map(({ slug }) => ({ licao: slug }));
}

// A lista é exaustiva: lição fora dela é 404 real, não uma página 200 vazia.
export const dynamicParams = false;

export function generateMetadata({ params }: { params: Params }): Metadata {
  const lesson = lessonBySlug(params.licao);
  if (!lesson) return { title: "Academia da Fé" };
  return {
    title: `${lesson.title} · Academia da Fé`,
    description: lesson.subtitle,
    alternates: { canonical: `/academia/${lesson.slug}` },
    robots: { index: lesson.review === "reviewed", follow: true },
  };
}

export default function LessonPage({ params }: { params: Params }) {
  const lesson = lessonBySlug(params.licao);
  if (!lesson) notFound();

  const [article] = lesson.relatedEntries;
  const articleHref = article ? entryPath(article.categoria, article.slug) : "/academia";
  const saint = lesson.contextSaint
    ? saintAssetFor({ categoria: "santos", slug: lesson.contextSaint.slug })
    : null;

  return (
    <div className="mx-auto max-w-shell px-4 py-10 sm:px-6">
      <Breadcrumbs
        trail={[
          { label: "Academia da Fé", href: "/academia" },
          { label: lesson.module },
          { label: lesson.title },
        ]}
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="eyebrow">{lesson.module}</p>
            <Link href={articleHref} className="btn-tertiary">
              <span aria-hidden="true">←</span> Consultar artigo
            </Link>
          </div>
          <h1 className="mt-3 font-display text-title-lg text-ink md:text-title-xl">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-measure text-lead text-ink-muted">{lesson.subtitle}</p>

          {lesson.review === "pending" ? (
            <div className="mt-6">
              <EditorialNotice>
                Lição em revisão editorial: o texto ainda aguarda a conferência de uma pessoa
                revisora. Para referência, consulte o artigo e os documentos citados.
              </EditorialNotice>
            </div>
          ) : null}

          <div className="mt-8">
            <LessonFlow lesson={lesson} articleHref={articleHref} />
          </div>

          <div className="mt-10">
            <SourceList sources={lesson.sources} />
          </div>
        </div>

        {saint && lesson.contextSaint ? (
          <aside aria-label="Santo relacionado" className="mt-10 lg:mt-0">
            <div className="rounded-panel border border-border bg-surface p-5">
              <p className="eyebrow">Contexto</p>
              <div className="mt-3 flex items-start gap-4 lg:flex-col">
                <Image
                  src={saint.avatar}
                  alt=""
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h2 className="font-display text-title-sm text-ink">{saint.name}</h2>
                  <p className="mt-1 text-meta text-ink-muted">{lesson.contextSaint.note}</p>
                  <Link href={entryPath("santos", saint.slug)} className="btn-tertiary mt-2">
                    Ver biografia <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
