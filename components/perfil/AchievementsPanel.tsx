import { proximaConquista, quantoFalta, type Conquista, type Grupo } from "@/lib/conquistas";

/** Um traço por grupo, no mesmo estilo de linha dos outros ícones do site. */
const ICONES: Record<Grupo, React.ReactNode> = {
  // Chama: dias seguidos.
  constancia: <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.4-4.8C10 10 11 11 11.5 12 12.5 9.5 12.6 6 12 3Z" />,
  // Auréola sobre a cabeça: o caminho do santo, pelos níveis.
  caminho: (
    <>
      <ellipse cx="12" cy="5.5" rx="5" ry="1.8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 21c.6-3.4 3-5 6-5s5.4 1.6 6 5" />
    </>
  ),
  // Estrada que sobe até uma cruz: o Caminho da Santidade.
  santidade: (
    <>
      <path d="M6 21c0-4 6-4 6-8s-4-4-4-7" />
      <path d="M12 3v5M10 5h4" />
    </>
  ),
  // Livro aberto: a Academia da Fé.
  estudo: <path d="M12 6.5C10 5 7.5 4.5 4 4.5v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2Zm0 0v13" />,
  // Pergaminho: o que a pessoa guarda e escreve.
  tesouro: (
    <>
      <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7" />
      <path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2 2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
      <path d="M12 9h4M12 13h4" />
    </>
  ),
};

function Medalha({ grupo, ganha }: { grupo: Grupo; ganha: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 ${
        ganha ? "border-gold bg-accent-soft text-accent" : "border-dashed border-border-strong text-ink-muted"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONES[grupo]}
      </svg>
    </span>
  );
}

/** Quantas das que faltam ficam à vista; as outras vão para "ver todas". */
const A_VISTA = 3;

function Cartao({ c }: { c: Conquista }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-[12px] border border-border p-3 ${c.ganha ? "bg-surface" : "bg-transparent"}`}
    >
      <Medalha grupo={c.grupo} ganha={c.ganha} />
      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${c.ganha ? "text-ink" : "text-ink-muted"}`}>
          {c.nome}
          <span className="sr-only">{c.ganha ? " (ganha)" : " (ainda não ganha)"}</span>
        </p>
        <p className="text-meta text-ink-muted">{c.descricao}</p>
        {c.ganha ? null : (
          <div
            role="progressbar"
            aria-label={`Progresso em ${c.nome}`}
            aria-valuemin={0}
            aria-valuemax={c.alvo}
            aria-valuenow={c.atual}
            aria-valuetext={`${c.atual} de ${c.alvo}`}
            className="mt-1.5 flex items-center gap-2"
          >
            <span className="h-1 flex-1 overflow-hidden rounded bg-border">
              <span className="block h-full bg-gold" style={{ width: `${Math.round((c.atual / c.alvo) * 100)}%` }} />
            </span>
            <span className="text-label text-ink-muted [letter-spacing:0] [font-variant-numeric:tabular-nums]">
              {c.atual}/{c.alvo}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

const GRADE = "grid gap-2 sm:grid-cols-2 lg:grid-cols-3";

/**
 * Conquistas do Santo Guardião, calculadas do progresso do perfil. À vista ficam as
 * ganhas e as três mais perto de sair; o resto abre em "ver todas".
 */
export function AchievementsPanel({ lista }: { lista: readonly Conquista[] }) {
  const ganhas = lista.filter((c) => c.ganha);
  const proxima = proximaConquista(lista);
  const faltam = lista
    .filter((c) => !c.ganha)
    .sort((a, b) => b.atual / b.alvo - a.atual / a.alvo);
  const aVista = [...ganhas, ...faltam.slice(0, A_VISTA)];
  const escondidas = faltam.slice(A_VISTA);

  return (
    <section aria-labelledby="conquistas" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="conquistas" className="font-display text-title-md text-ink">
          Conquistas
        </h2>
        <p className="text-meta text-ink-muted [font-variant-numeric:tabular-nums]">
          {ganhas.length} de {lista.length}
          {proxima ? (
            <>
              {" "}· próxima: <span className="text-ink">{proxima.nome}</span>, {quantoFalta(proxima)}
            </>
          ) : (
            " · todas ganhas"
          )}
        </p>
      </div>
      <ul className={GRADE}>
        {aVista.map((c) => (
          <Cartao key={c.id} c={c} />
        ))}
      </ul>
      {escondidas.length > 0 ? (
        <details className="group">
          <summary className="w-fit cursor-pointer list-none text-meta font-semibold text-accent underline-offset-4 hover:underline">
            <span className="group-open:hidden">Ver as outras {escondidas.length}</span>
            <span className="hidden group-open:inline">Esconder</span>
          </summary>
          <ul className={`${GRADE} mt-3`}>
            {escondidas.map((c) => (
              <Cartao key={c.id} c={c} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
