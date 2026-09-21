import Link from "next/link";

import { CATEGORY_LABELS, entryPath } from "@/lib/categories";
import type { FonteCitada } from "@/lib/chatSchemas";
import { isCategorySlug } from "@/lib/schemas";

/** Uma fonte citada pelo chatbot, com link pro verbete real quando a
 * categoria é reconhecida — a API sempre devolve uma categoria válida, mas
 * o contrato no frontend não estreita esse tipo, então a checagem fica
 * aqui. Usado por `ChatWidget` (único consumidor, desde que a página
 * dedicada `/perguntar` foi removida em favor do widget flutuante). */
export function FonteLink({ fonte }: { fonte: FonteCitada }) {
  if (!isCategorySlug(fonte.categoria)) {
    return <span className="text-ink-muted">{fonte.titulo}</span>;
  }
  return (
    <Link
      href={entryPath(fonte.categoria, fonte.slug)}
      className="text-bordeaux underline-offset-4 hover:underline"
    >
      {fonte.titulo}
      <span className="text-ink-muted"> — {CATEGORY_LABELS[fonte.categoria].nav}</span>
    </Link>
  );
}
