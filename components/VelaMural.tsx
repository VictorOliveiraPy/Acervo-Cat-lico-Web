import Image from "next/image";

import { formatVelaDate, velaTipoInfo } from "@/lib/velas";
import type { Vela } from "@/lib/velasSchemas";

/**
 * O mural público: as velas acesas por quem passou por aqui antes.
 *
 * Grade de cartões, não lista — cada vela é um gesto individual (nome,
 * intenção, cor escolhida), e a grade deixa isso ler como um mosaico de
 * pessoas, não como uma tabela de registros.
 */
export function VelaMural({ velas }: { velas: Vela[] }) {
  if (velas.length === 0) {
    return (
      <p className="text-body text-ink-muted">
        Nenhuma vela acesa ainda — seja a primeira pessoa a acender uma.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {velas.map((vela) => {
        const info = velaTipoInfo(vela.tipo);
        return (
          <li
            key={vela.id}
            className="flex gap-4 rounded-edge border border-rule-faint bg-parchment-raised p-4"
          >
            <Image
              src={info.imagem}
              alt={`Vela ${info.label.toLowerCase()}`}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-edge object-cover"
            />
            <div className="min-w-0">
              <p className="font-display text-body text-ink">{vela.nome}</p>
              {vela.intencao ? (
                <p className="mt-1 text-meta italic text-ink-muted">
                  “{vela.intencao}”
                </p>
              ) : null}
              <p className="mt-2 text-meta text-ink-muted/80">
                {formatVelaDate(vela.criado_em)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
