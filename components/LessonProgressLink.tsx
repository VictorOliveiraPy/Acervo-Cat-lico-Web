"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { lessonStatus, readProgress, type LessonStatus } from "@/lib/academiaProgress";

const ACTION: Record<LessonStatus, string> = {
  not_started: "Iniciar lição",
  in_progress: "Continuar lição",
  completed: "Rever lição",
};

const STATUS_NOTE: Record<LessonStatus, string | null> = {
  not_started: null,
  in_progress: "Em andamento",
  completed: "✓ Concluída",
};

/**
 * Link para uma lição com o estado salvo neste navegador. O servidor não conhece
 * esse estado, então a primeira pintura é sempre "Iniciar lição" e o texto só
 * muda depois de hidratar.
 */
export function LessonProgressLink({
  slug,
  className = "btn-tertiary",
}: {
  slug: string;
  className?: string;
}) {
  const [status, setStatus] = useState<LessonStatus>("not_started");

  useEffect(() => {
    setStatus(lessonStatus(readProgress(), slug));
  }, [slug]);

  const note = STATUS_NOTE[status];

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <Link href={`/academia/${slug}`} className={className}>
        {ACTION[status]} <span aria-hidden="true">→</span>
      </Link>
      {note ? <span className="text-meta text-ink-muted">{note}</span> : null}
    </span>
  );
}
