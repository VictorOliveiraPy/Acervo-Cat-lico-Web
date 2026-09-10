import Image from "next/image";

import { VELA_IMAGEM, formatVelaDate, formatVelaLocation, velaTipoInfo } from "@/lib/velas";
import type { Vela } from "@/lib/velasSchemas";

/**
 * O mural público: as velas acesas por quem passou por aqui antes.
 *
 * Grade de cartões, não lista — cada vela é um gesto individual (nome,
 * intenção, devoção escolhida), e a grade deixa isso ler como um mosaico de
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
        const local = formatVelaLocation(vela.cidade, vela.estado);
        return (
          <li
            key={vela.id}
            className="flex gap-4 rounded-edge border border-rule-faint bg-parchment-raised p-4"
          >
            <Image
              src={VELA_IMAGEM}
              alt="Vela acesa"
              width={88}
              height={88}
              className="h-20 w-20 shrink-0 rounded-edge object-cover sm:h-24 sm:w-24"
            />
            <div className="min-w-0">
              <p className="kicker text-bordeaux">{info.label}</p>
              <p className="font-display text-body text-ink">{vela.nome}</p>
              {local ? <p className="text-meta text-ink-muted/80">{local}</p> : null}
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
