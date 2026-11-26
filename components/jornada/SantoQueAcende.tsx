"use client";

import { useEffect, useState } from "react";

import { SaintStage } from "@/components/perfil/SaintStage";
import { DEGRAUS } from "@/lib/jornada";
import { patronById } from "@/lib/padroeiros";

const SANTO = patronById("miguel");
const INTERVALO_MS = 3200;

/**
 * Demonstração do perfil: o mesmo santo em cada estágio de luz, do Peregrino ao
 * Mestre Espiritual. Avança sozinho; quem prefere menos movimento escolhe no clique.
 */
export function SantoQueAcende() {
  const [atual, setAtual] = useState(0);
  const [automatico, setAutomatico] = useState(true);

  useEffect(() => {
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calmo || !automatico) return;
    const relogio = setInterval(() => setAtual((i) => (i + 1) % DEGRAUS.length), INTERVALO_MS);
    return () => clearInterval(relogio);
  }, [automatico]);

  const degrau = DEGRAUS[atual] ?? DEGRAUS[0]!;
  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <SaintStage saintId={SANTO.id} saintName={SANTO.nome} estagio={degrau.estagio} />
      <figcaption className="mt-4 text-center">
        <p aria-live="polite" className="font-display text-title-sm text-ink">
          Nível {degrau.nivel} · <span className="text-accent">{degrau.titulo}</span>
        </p>
        <div className="mx-auto mt-3 flex max-w-[260px] gap-1.5" role="group" aria-label="Ver o santo em cada estágio">
          {DEGRAUS.map((d, i) => (
            <button
              key={d.nivel}
              type="button"
              aria-label={`Nível ${d.nivel}: ${d.titulo}`}
              aria-pressed={i === atual}
              onClick={() => {
                setAutomatico(false);
                setAtual(i);
              }}
              className="h-2 flex-1 overflow-hidden rounded-full bg-border"
            >
              <span
                className={`block h-full rounded-full bg-gold transition-[width] duration-700 ${i <= atual ? "w-full" : "w-0"}`}
              />
            </button>
          ))}
        </div>
        <p className="mt-2 text-label text-ink-muted [letter-spacing:0]">Quanto mais você reza e estuda, mais o seu santo brilha.</p>
      </figcaption>
    </figure>
  );
}
