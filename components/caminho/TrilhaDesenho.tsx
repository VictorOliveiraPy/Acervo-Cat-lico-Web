import type { ReactNode } from "react";

import { deslocamento, estadoDaCasa, progressoDaVia, type Caminho, type Casa } from "@/lib/caminho";

/** Largura da estrada e quanto cada casa sai do centro, em px (o SVG usa os mesmos). */
const LARGURA = 320;
const CENTRO = LARGURA / 2;
const AMPLITUDE = 86;
const LIGACAO = 44;

/** Cor de cada via: do vinho da conversão ao ouro da união com Deus. */
const COR_DA_VIA: Record<string, { faixa: string; texto: string }> = {
  purgativa: { faixa: "from-[#5B2333] to-[#8C313E]", texto: "text-white" },
  iluminativa: { faixa: "from-[#8C6A2A] to-[#C9A24E]", texto: "text-white" },
  unitiva: { faixa: "from-[#C9A24E] to-[#F1DFA8]", texto: "text-[#3B2A12]" },
};

function Icone({ casa, estado }: { casa: Casa; estado: "feita" | "atual" | "bloqueada" }) {
  if (estado === "feita") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (estado === "bloqueada") {
    return <span className="font-display text-title-sm [font-variant-numeric:tabular-nums]">{casa.numero}</span>;
  }
  // Atual: livro para lição, chama para prática.
  return casa.tipo === "licao" ? (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 6.5C10 5 7.5 4.5 4 4.5v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2Zm0 0v13" />
    </svg>
  ) : (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.4-4.8C10 10 11 11 11.5 12 12.5 9.5 12.6 6 12 3Z" />
    </svg>
  );
}

const ESTILO_DO_NO = {
  feita: "bg-gold text-white shadow-[0_5px_0_#7d6128]",
  atual: "trilha-atual bg-accent text-white shadow-[0_6px_0_#5B2333] scale-110",
  bloqueada: "bg-border text-ink-muted shadow-[0_5px_0_rgba(0,0,0,0.12)]",
} as const;

/**
 * A estrada do Caminho da Santidade, casa por casa, separada em vias. `aoLado` fica em
 * pé sobre a casa atual (o santo 3D) e `abaixo`, logo embaixo dela (o que fazer agora).
 */
export function TrilhaDesenho({
  caminho,
  concluidas,
  aoLado,
  abaixo,
}: {
  caminho: Caminho;
  concluidas: number;
  aoLado?: ReactNode;
  abaixo?: ReactNode;
}) {
  const fim = concluidas >= caminho.casas.length;
  return (
    <ol className="mx-auto flex w-full max-w-[420px] flex-col items-center">
      {caminho.vias.map((via) => {
        const casas = caminho.casas.filter((casa) => casa.via === via.id);
        const { feitas, total } = progressoDaVia(caminho, via.id, concluidas);
        const cor = COR_DA_VIA[via.id] ?? COR_DA_VIA.purgativa!;
        return (
          <li key={via.id} className="w-full">
            <div className={`mb-6 mt-4 rounded-panel bg-gradient-to-r px-5 py-4 ${cor.faixa} ${cor.texto}`}>
              <p className="text-label font-semibold uppercase opacity-90">
                {feitas === total ? "Concluída" : `${feitas} de ${total} casas`}
              </p>
              <h3 className={`font-display text-title-sm ${cor.texto}`}>{via.nome}</h3>
              <p className="text-meta opacity-90">{via.descricao}</p>
            </div>
            <ol className="relative mx-auto" style={{ width: LARGURA }}>
              {casas.map((casa, i) => {
                const estado = estadoDaCasa(casa.numero, concluidas);
                const x = CENTRO + deslocamento(casa.numero) * AMPLITUDE;
                const anterior = i > 0 ? CENTRO + deslocamento(casa.numero - 1) * AMPLITUDE : null;
                const atual = estado === "atual";
                return (
                  <li key={casa.numero} id={`casa-${casa.numero}`} className="relative scroll-mt-40">
                    {anterior !== null ? (
                      <svg width={LARGURA} height={LIGACAO} aria-hidden="true" className="block">
                        <path
                          d={`M${anterior} 0 C${anterior} ${LIGACAO / 2}, ${x} ${LIGACAO / 2}, ${x} ${LIGACAO}`}
                          fill="none"
                          strokeWidth="10"
                          strokeLinecap="round"
                          className={casa.numero <= concluidas + 1 ? "stroke-gold/60" : "stroke-border"}
                          strokeDasharray={casa.numero <= concluidas ? undefined : "2 16"}
                        />
                      </svg>
                    ) : null}
                    <div className="relative flex flex-col items-center" style={{ transform: `translateX(${x - CENTRO}px)` }}>
                      {/* O santo em pé na estrada, sobre a casa onde a pessoa está. */}
                      {atual && aoLado ? <div className="mb-1 w-[118px]">{aoLado}</div> : null}
                      <span
                        aria-hidden="true"
                        className={`flex h-[68px] w-[68px] items-center justify-center rounded-full transition-transform ${ESTILO_DO_NO[estado]}`}
                      >
                        <Icone casa={casa} estado={estado} />
                      </span>
                      <p className={`mt-2 max-w-[150px] text-center text-meta leading-tight ${atual ? "font-semibold text-ink" : "text-ink-muted"}`}>
                        <span className="sr-only">
                          Casa {casa.numero} ({estado === "feita" ? "concluída" : atual ? "atual" : "bloqueada"}):{" "}
                        </span>
                        {casa.titulo}
                        <span className="block text-label [letter-spacing:0]">{casa.tarefa_nome}</span>
                      </p>
                    </div>
                    {atual && abaixo ? <div className="relative z-10 mx-auto mt-4 w-[300px] max-w-[88vw]">{abaixo}</div> : null}
                  </li>
                );
              })}
            </ol>
          </li>
        );
      })}
      <li className="mt-10 flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl ${
            fim ? "trilha-atual bg-gradient-to-b from-[#F1DFA8] to-[#C9A24E] shadow-[0_0_40px_rgba(201,162,78,0.8)]" : "bg-border"
          }`}
        >
          ✦
        </span>
        <p className="mt-3 font-display text-title-sm text-ink">Santidade</p>
        <p className="max-w-[260px] text-meta text-ink-muted">
          {fim ? "Você chegou ao fim da trilha. A santidade continua todo dia." : "O fim do caminho: a vida inteira unida a Deus."}
        </p>
      </li>
    </ol>
  );
}
