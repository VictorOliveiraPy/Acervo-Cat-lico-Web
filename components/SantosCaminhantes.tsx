import Link from "next/link";
import type { ReactNode } from "react";

import { categoryPath } from "@/lib/categories";
import {
  SANTOS_CAMINHANTES,
  type SantoCaminhante,
  type SantoFigura,
  atrasoEmSegundos,
  cicloEmSegundos,
} from "@/lib/santosCaminhantes";

type Atributos = { manto: string; cabeca: ReactNode; corpo: ReactNode };

/**
 * Desenho de cada figura, em monocromia com os tokens do projeto: o traço é
 * `ink`, os tecidos variam entre `ink`, `muted`, `raised` e `canvas`, e o
 * halo usa o tom `warning` como dourado. A cor não carrega significado, só
 * o formato (mitra, asas, capuz) diferencia um santo do outro.
 */
const ATRIBUTOS: Record<SantoFigura, Atributos> = {
  francisco: {
    manto: "fill-muted",
    cabeca: <path d="M17 15 Q24 4 31 15 Q24 11 17 15Z" className="fill-muted" />,
    corpo: (
      <>
        <path d="M18 44 H30" className="stroke-canvas" strokeWidth="2" />
        <ellipse cx="36" cy="40" rx="3.5" ry="2.5" className="fill-raised" />
      </>
    ),
  },
  papa: {
    manto: "fill-canvas",
    cabeca: <path d="M18 13 Q24 5 30 13Z" className="fill-canvas" />,
    corpo: <path d="M24 30 V44 M20 35 H28" strokeWidth="1.6" />,
  },
  anjo: {
    manto: "fill-canvas",
    cabeca: null,
    corpo: (
      <path
        d="M17 32 Q3 22 4 44 Q12 40 18 42Z M31 32 Q45 22 44 44 Q36 40 30 42Z"
        className="fill-raised stroke-border-strong"
      />
    ),
  },
  maria: {
    manto: "fill-muted",
    cabeca: (
      <path d="M16 17 Q16 6 24 6 Q32 6 32 17 Q28 11 24 11 Q20 11 16 17Z" className="fill-muted" />
    ),
    corpo: <path d="M24 30 V50" className="stroke-canvas" strokeWidth="1.4" />,
  },
  bispo: {
    manto: "fill-ink",
    cabeca: <path d="M18 12 L24 0 L30 12Z" className="fill-ink" />,
    corpo: <rect x="30" y="36" width="9" height="12" className="fill-raised" />,
  },
  monge: {
    manto: "fill-ink",
    cabeca: <path d="M16 16 Q24 2 32 16 Q24 11 16 16Z" className="fill-ink" />,
    corpo: <path d="M24 32 V46 M19 37 H29" className="stroke-canvas" strokeWidth="1.6" />,
  },
  peregrino: {
    manto: "fill-muted",
    cabeca: <path d="M13 12 H35 M18 12 Q24 2 30 12Z" className="fill-ink" strokeWidth="2" />,
    corpo: <path d="M37 22 V70" strokeWidth="2" />,
  },
  evangelista: {
    manto: "fill-raised",
    cabeca: null,
    corpo: <path d="M12 40 L24 37 L36 40 V50 L24 47 L12 50Z" className="fill-canvas" />,
  },
  santa: {
    manto: "fill-ink",
    cabeca: (
      <path d="M16 17 Q16 6 24 6 Q32 6 32 17 Q28 12 24 12 Q20 12 16 17Z" className="fill-ink" />
    ),
    corpo: (
      <>
        <circle cx="24" cy="40" r="6" className="fill-none stroke-warning" strokeDasharray="1.5 2" />
        <path d="M24 46 V52" className="stroke-warning" strokeWidth="1.5" />
      </>
    ),
  },
};

function Figura({ figura }: { figura: SantoFigura }) {
  const { manto, cabeca, corpo } = ATRIBUTOS[figura];
  const atrasDoManto = figura === "anjo";
  return (
    <svg viewBox="0 0 48 72" className="santo-passo h-20 w-14 stroke-ink" strokeWidth="1.2">
      {atrasDoManto ? corpo : null}
      <circle cx="24" cy="14" r="12.5" className="fill-warning-soft stroke-warning" />
      <path d="M7 67 L15 27 Q24 21 33 27 L41 67 Z" className={manto} />
      {atrasDoManto ? null : corpo}
      <circle cx="24" cy="15" r="7.5" className="fill-raised" />
      {cabeca}
      <ellipse cx="16" cy="68" rx="6" ry="3" className="santo-pe-a fill-ink" />
      <ellipse cx="32" cy="68" rx="6" ry="3" className="santo-pe-b fill-ink" />
    </svg>
  );
}

function Caminhante({ santo, indice }: { santo: SantoCaminhante; indice: number }) {
  return (
    <Link
      href={categoryPath(santo.categoria)}
      // Decorativo: as mesmas categorias já estão na página, e um link que
      // anda não é alvo justo para teclado nem leitor de tela.
      aria-hidden="true"
      tabIndex={-1}
      className="santo-caminha pointer-events-auto absolute bottom-1 left-0 flex flex-col items-center"
      style={{
        animationDuration: `${cicloEmSegundos()}s`,
        animationDelay: `${atrasoEmSegundos(indice)}s`,
      }}
    >
      <span className="mb-0.5 whitespace-nowrap border border-border bg-canvas px-2 py-0.5 text-label text-ink">
        {santo.placa}
      </span>
      <Figura figura={santo.figura} />
    </Link>
  );
}

/**
 * Faixa fixa no pé da tela onde uma procissão de santos em miniatura cruza a
 * página, cada um com uma placa que leva a uma categoria. É enfeite: não
 * captura cliques fora dos santos, fica de fora do teclado e do leitor de
 * tela, some para quem pede menos movimento e para na hora se o mouse (ou o
 * dedo) chega perto de um santo.
 */
export function SantosCaminhantes() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-32 overflow-hidden motion-reduce:hidden print:hidden"
      aria-hidden="true"
    >
      {SANTOS_CAMINHANTES.map((santo, indice) => (
        <Caminhante key={santo.figura} santo={santo} indice={indice} />
      ))}
    </div>
  );
}
