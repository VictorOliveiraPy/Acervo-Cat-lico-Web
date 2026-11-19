"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { setPatronAction } from "@/app/(pt)/perfil/actions";
import { PatronPicker } from "@/components/perfil/PatronPicker";
import { SaintStage } from "@/components/perfil/SaintStage";
import { patronById, type PatronId } from "@/lib/padroeiros";

/**
 * Primeiro passo depois de criar a conta: escolher o santo de devoção. Enquanto não
 * confirma, a pessoa troca à vontade e vê cada santo em 3D; nada é salvo até o botão.
 */
export function PatronChoice({ nome }: { nome: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<PatronId>("teresinha");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const patron = patronById(selected);

  async function confirm() {
    setStatus("saving");
    const result = await setPatronAction(selected);
    if (result.status === "saved") router.refresh();
    else setStatus("error");
  }

  return (
    <section
      aria-labelledby="escolha-padroeiro"
      className="grid items-center gap-5 min-[820px]:grid-cols-[minmax(260px,380px)_1fr] min-[820px]:gap-9"
    >
      <SaintStage saintId={patron.id} saintName={patron.nome} />

      <div className="flex min-w-0 flex-col gap-[18px]">
        <p className="eyebrow">Conta criada</p>
        <h1 id="escolha-padroeiro" className="font-display text-title-lg text-ink md:text-title-xl">
          {nome}, escolha seu santo de devoção
        </h1>
        <p className="max-w-measure text-ink-muted">
          Ele fica no seu perfil e acompanha seus estudos. Dá para trocar depois, quando quiser.
        </p>
        <PatronPicker selected={selected} onChoose={setSelected} />
        <p className="font-display text-title-sm text-ink-muted">
          <em className="text-ink">{patron.nome}</em> · festa em {patron.festa}
        </p>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={status === "saving"}
            onClick={() => void confirm()}
          >
            {status === "saving" ? "Salvando…" : `Escolher ${patron.nomeCurto}`}
          </button>
        </div>
        <p role="status" aria-live="polite" className="text-meta text-danger">
          {status === "error" ? "Não foi possível salvar o padroeiro. Tente de novo em instantes." : ""}
        </p>
      </div>
    </section>
  );
}
