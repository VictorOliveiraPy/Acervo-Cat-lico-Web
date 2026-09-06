"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { acenderVelaAction, type AcenderVelaState } from "@/app/velas/actions";
import { DEFAULT_VELA_TIPO, VELA_TIPOS } from "@/lib/velas";
import { VELA_INTENCAO_MAX, VELA_NOME_MAX, type VelaTipo } from "@/lib/velasSchemas";

const INITIAL_STATE: AcenderVelaState = { status: "idle" };

/** Botão de envio: só ele sabe do `pending` (`useFormStatus` exige estar
 * dentro do `<form>`, não pode ler o estado no componente pai). */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-edge border border-bordeaux bg-bordeaux px-6 py-3 text-label uppercase tracking-[0.09em] text-parchment-raised transition-colors hover:bg-bordeaux-soft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Acendendo…" : "Acender a vela"}
    </button>
  );
}

/** Grade de velas escolhíveis — cada uma é um `radio` disfarçado de cartão
 * de imagem, para não perder acessibilidade de teclado/leitor de tela. */
function VelaPicker({
  selected,
  onSelect,
}: {
  selected: VelaTipo;
  onSelect: (tipo: VelaTipo) => void;
}) {
  return (
    <fieldset>
      <legend className="kicker">Escolha a vela</legend>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {VELA_TIPOS.map((item) => {
          const checked = item.tipo === selected;
          return (
            <label
              key={item.tipo}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-edge border p-3 transition-colors ${
                checked
                  ? "border-bordeaux bg-parchment-raised"
                  : "border-rule-faint hover:border-bordeaux/60"
              }`}
            >
              <input
                type="radio"
                name="tipo"
                value={item.tipo}
                checked={checked}
                onChange={() => onSelect(item.tipo)}
                className="sr-only"
              />
              <Image
                src={item.imagem}
                alt={`Vela de ${item.label}`}
                width={128}
                height={128}
                className="h-28 w-28 rounded-edge object-cover sm:h-32 sm:w-32"
              />
              <span className="text-meta text-ink">{item.label}</span>
            </label>
          );
        })}
      </div>
      <VelaCreditos />
    </fieldset>
  );
}

/** Crédito das fotos que a licença exige — só as que precisam, numa linha só. */
function VelaCreditos() {
  const creditos = VELA_TIPOS.filter((item) => item.imagemCredito);
  if (creditos.length === 0) return null;

  return (
    <p className="mt-3 text-meta text-ink-muted/70">
      Fotos: {creditos.map((item) => `${item.label} — ${item.imagemCredito}`).join(" · ")}
    </p>
  );
}

export function VelaForm() {
  const [state, formAction] = useFormState(acenderVelaAction, INITIAL_STATE);
  const [tipo, setTipo] = useState<VelaTipo>(DEFAULT_VELA_TIPO);
  const formRef = useRef<HTMLFormElement>(null);

  // Ao acender com sucesso, limpa nome/intenção para a próxima vela — a
  // seleção de vela (`tipo`) é estado controlado à parte e não é afetada
  // por `reset()`, então mantém a última cor escolhida.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-6 rounded-edge border border-rule-faint bg-parchment-raised p-6"
    >
      <VelaPicker selected={tipo} onSelect={setTipo} />

      <div>
        <label htmlFor="nome" className="kicker">
          Seu nome (ou apelido)
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={VELA_NOME_MAX}
          placeholder="Ex.: Maria, ou 'uma mãe em oração'"
          className="mt-2 w-full rounded-edge border border-rule-faint bg-parchment px-4 py-2.5 text-body text-ink placeholder:text-ink-muted/70 focus:border-bordeaux focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="intencao" className="kicker">
          Intenção (opcional)
        </label>
        <textarea
          id="intencao"
          name="intencao"
          rows={3}
          maxLength={VELA_INTENCAO_MAX}
          placeholder="Ex.: Pela saúde da minha família"
          className="mt-2 w-full resize-none rounded-edge border border-rule-faint bg-parchment px-4 py-2.5 text-body text-ink placeholder:text-ink-muted/70 focus:border-bordeaux focus:outline-none"
        />
      </div>

      {state.status !== "idle" && state.message ? (
        <p
          className={`text-meta ${state.status === "error" ? "text-state-error" : "text-bordeaux"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
