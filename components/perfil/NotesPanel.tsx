"use client";

import Link from "next/link";
import { useState } from "react";

import { addNoteAction, deleteNoteAction } from "@/app/(pt)/perfil/actions";
import { MAX_TEXT_LENGTH, NOTE_TAGS, formatNoteDate, type Note } from "@/lib/perfil";

const FIELD =
  "w-full rounded-edge border border-border-strong bg-raised px-3 py-2.5 text-meta text-ink focus:border-accent focus:outline-none";

export function NotesPanel({
  notes,
  lessons,
  onChange,
}: {
  notes: readonly Note[];
  lessons: ReadonlyArray<{ slug: string; title: string }>;
  onChange: (next: Note[]) => void;
}) {
  const [tag, setTag] = useState<(typeof NOTE_TAGS)[number]>(NOTE_TAGS[0]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const titleBySlug = new Map(lessons.map(({ slug, title }) => [slug, title]));

  async function add(form: HTMLFormElement) {
    const data = new FormData(form);
    setPending(true);
    setMessage("");
    const result = await addNoteAction({
      categoria: tag,
      texto: String(data.get("texto") ?? ""),
      licao: tag === "Lição" ? String(data.get("licao") ?? "") || null : null,
    });
    setPending(false);
    if (result.status === "saved") {
      onChange([result.item, ...notes]);
      form.reset();
    } else {
      setMessage(result.status === "anonymous" ? "Entre com o Google para salvar." : result.message);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Apagar esta anotação? Isso não pode ser desfeito.")) return;
    const result = await deleteNoteAction(id);
    if (result.status === "deleted") onChange(notes.filter((note) => note.id !== id));
    else setMessage("Não foi possível apagar agora. Tente de novo em instantes.");
  }

  return (
    <div className="grid items-start gap-6 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void add(event.currentTarget);
        }}
        className="flex flex-col gap-3 rounded-panel border border-border bg-surface p-4"
      >
        <h2 className="font-display text-title-sm text-ink">Nova anotação</h2>
        <label className="flex flex-col gap-1 text-meta text-ink-muted">
          Categoria
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value as (typeof NOTE_TAGS)[number])}
            className={FIELD}
          >
            {NOTE_TAGS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        {tag === "Lição" ? (
          <label className="flex flex-col gap-1 text-meta text-ink-muted">
            Lição (opcional)
            <select name="licao" defaultValue="" className={FIELD}>
              <option value="">Nenhuma em especial</option>
              {lessons.map(({ slug, title }) => (
                <option key={slug} value={slug}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="flex flex-col gap-1 text-meta text-ink-muted">
          Texto
          <textarea
            name="texto"
            required
            maxLength={MAX_TEXT_LENGTH}
            rows={5}
            placeholder="O que você aprendeu ou quer lembrar?"
            className={`${FIELD} min-h-[130px] resize-y`}
          />
        </label>
        <p className="text-label text-ink-muted">
          As anotações ficam salvas no servidor. Não escreva aqui os seus pecados: para isso, use o
          exame em <a href="#confissao" className="underline underline-offset-2">Preparar confissão</a>, que não é salvo.
        </p>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Salvando…" : "Salvar anotação"}
        </button>
        <p role="status" aria-live="polite" className="text-meta text-ink-muted">
          {message}
        </p>
      </form>

      {notes.length > 0 ? (
        <ul className="flex min-w-0 flex-col gap-5">
          {notes.map((note) => (
            <li key={note.id} className="border-l-2 border-border pl-4 hover:border-accent">
              <div className="flex flex-wrap items-center gap-x-3 text-meta text-ink-muted">
                <span className="font-semibold text-accent">{note.categoria}</span>
                <time dateTime={note.criado_em}>{formatNoteDate(note.criado_em)}</time>
                {note.licao && titleBySlug.has(note.licao) ? (
                  <Link href={`/academia/${note.licao}`} className="underline underline-offset-2 hover:text-accent">
                    {titleBySlug.get(note.licao)}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => void remove(note.id)}
                  className="min-h-[44px] px-2 hover:text-accent"
                >
                  Apagar
                </button>
              </div>
              <p className="max-w-measure whitespace-pre-wrap break-words text-body text-ink">{note.texto}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-meta text-ink-muted">Suas anotações aparecem aqui.</p>
      )}
    </div>
  );
}
