import Link from "next/link";

import { deslocamento } from "@/lib/caminho";

/** As primeiras casas da trilha, em miniatura: duas feitas, a atual pulsando, o resto à espera. */
const AMOSTRA = [
  { titulo: "O chamado", estado: "feita" },
  { titulo: "A Palavra", estado: "feita" },
  { titulo: "Aprender a fé", estado: "atual" },
  { titulo: "O abraço do Pai", estado: "bloqueada" },
  { titulo: "Com Maria", estado: "bloqueada" },
] as const;

const NO = {
  feita: "bg-gold text-white shadow-[0_4px_0_#7d6128]",
  atual: "trilha-atual bg-accent text-white shadow-[0_5px_0_#5B2333] scale-110",
  bloqueada: "bg-border text-ink-muted shadow-[0_4px_0_rgba(0,0,0,0.12)]",
} as const;

/** Convite da home para o Caminho da Santidade: leva à página pública da trilha. */
export function CaminhoConvite() {
  return (
    <section
      aria-labelledby="caminho-convite"
      className="grid items-center gap-8 overflow-hidden rounded-panel border border-gold/50 bg-gradient-to-br from-accent-soft via-surface to-surface p-6 sm:p-8 md:grid-cols-[1.2fr_1fr]"
    >
      <div>
        <p className="text-label font-semibold uppercase text-accent">Novo · grátis</p>
        <h2 id="caminho-convite" className="mt-2 font-display text-title-lg text-ink">
          Caminho da Santidade
        </h2>
        <p className="mt-3 max-w-measure text-body text-ink-muted">
          Uma trilha de 36 casas pelas três vias da vida espiritual. Reze o Terço, vá à Missa, confesse-se, estude a fé:
          cada tarefa feita é uma casa a mais, e o seu santo padroeiro em 3D caminha com você até a santidade.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/caminho-da-santidade" className="btn btn-primary">
            Conhecer o Caminho
          </Link>
          <Link href="/jornada" className="btn btn-secondary">
            Como funciona a jornada
          </Link>
        </div>
      </div>

      <ol aria-hidden="true" className="mx-auto flex w-[220px] flex-col items-center gap-3">
        {AMOSTRA.map((casa, i) => (
          <li key={casa.titulo} className="flex flex-col items-center" style={{ transform: `translateX(${deslocamento(i + 1) * 60}px)` }}>
            <span className={`flex h-12 w-12 items-center justify-center rounded-full text-meta font-semibold ${NO[casa.estado]}`}>
              {casa.estado === "feita" ? "✓" : casa.estado === "atual" ? "✦" : i + 1}
            </span>
            <span className={`mt-1 text-label [letter-spacing:0] ${casa.estado === "atual" ? "font-semibold text-ink" : "text-ink-muted"}`}>
              {casa.titulo}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
