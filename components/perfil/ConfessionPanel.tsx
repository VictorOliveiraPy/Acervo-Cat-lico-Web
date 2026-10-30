"use client";

import { useEffect, useState } from "react";

import {
  ATO_DE_CONTRICAO,
  ATO_DE_CONTRICAO_FONTE,
  CINCO_PASSOS,
  EXAME,
  readLastConfession,
  saveLastConfession,
} from "@/lib/confissao";
import { daysBetween, formatTimeSince } from "@/lib/perfil";

function localToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const CARD = "flex flex-col gap-3 rounded-panel border border-border bg-surface p-5";
const WHO = "font-sans text-label font-bold uppercase text-ink-muted";

/**
 * REGRA DE PRIVACIDADE: o que a pessoa marca no exame vive só neste `useState`.
 * Nada daqui vai para o servidor, para o armazenamento do navegador, para analytics
 * ou para logs. `lib/perfil.test.ts` confere isso no código deste arquivo.
 * Só a data da última confissão é salva, e só neste navegador.
 */
export function ConfessionPanel() {
  const [marked, setMarked] = useState<ReadonlySet<string>>(new Set());
  const [lastConfession, setLastConfession] = useState("");
  const [today, setToday] = useState("");

  // Só depois de montar: no servidor não existe armazenamento nem o dia local da pessoa.
  useEffect(() => {
    setLastConfession(readLastConfession());
    setToday(localToday());
  }, []);

  function toggle(key: string) {
    setMarked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function changeDate(value: string) {
    setLastConfession(value);
    saveLastConfession(value);
  }

  const days = lastConfession && today ? daysBetween(lastConfession, today) : null;
  const items = EXAME.flatMap(({ perguntas }, group) =>
    perguntas.filter((_, index) => marked.has(`${group}-${index}`)),
  );

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-panel border border-border bg-surface p-4 text-meta text-ink">
        O exame de consciência fica só na memória desta tela. Nada é salvo nem enviado, e tudo
        some ao sair da página, recarregar ou tocar em <strong>Apagar exame</strong>.
      </p>

      <div className="grid items-start gap-7 min-[820px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* `autoComplete="off"`: sem isso, alguns navegadores restauram as caixas marcadas
            ao recarregar, o que contrariaria a promessa do aviso acima. */}
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()} className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-title-md text-ink">Exame de consciência</h2>
            <button type="button" onClick={() => setMarked(new Set())} className="btn btn-secondary">
              Apagar exame
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {EXAME.map(({ numero, titulo, perguntas }, group) => {
              const count = perguntas.filter((_, index) => marked.has(`${group}-${index}`)).length;
              return (
                <details
                  key={numero}
                  open={group === 0}
                  className="overflow-hidden rounded-panel border border-border bg-surface"
                >
                  <summary className="flex cursor-pointer list-none items-baseline gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-[3.5rem] font-display text-title-sm text-accent">{numero}</span>
                    <span className="flex-1 text-meta font-semibold text-ink">{titulo}</span>
                    {count > 0 ? (
                      <span className="text-label text-ink-muted">
                        {count} {count === 1 ? "marcado" : "marcados"}
                      </span>
                    ) : null}
                  </summary>
                  <div className="flex flex-col gap-2 px-4 pb-4">
                    {perguntas.map((pergunta, index) => {
                      const key = `${group}-${index}`;
                      return (
                        <label key={key} className="flex items-start gap-3 text-meta text-ink">
                          <input
                            type="checkbox"
                            checked={marked.has(key)}
                            onChange={() => toggle(key)}
                            className="mt-1 h-4 w-4 shrink-0 accent-accent"
                          />
                          <span>{pergunta}</span>
                        </label>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </form>

        <aside className="flex min-w-0 flex-col gap-4">
          <div className={CARD}>
            <p className="eyebrow">Última confissão</p>
            <p className="font-display text-title-lg text-ink">
              {days === null ? (
                "–"
              ) : (
                <>
                  {days} <span className="font-sans text-meta text-ink-muted">{days === 1 ? "dia atrás" : "dias atrás"}</span>
                </>
              )}
            </p>
            <label className="flex flex-wrap items-center gap-2 text-meta text-ink-muted">
              Data
              <input
                type="date"
                value={lastConfession}
                max={today || undefined}
                onChange={(event) => changeDate(event.target.value)}
                className="rounded-edge border border-border-strong bg-raised px-3 py-1.5 text-ink"
              />
            </label>
          </div>

          <div className={CARD}>
            <h3 className="font-display text-title-sm text-ink">Sua lista</h3>
            {items.length > 0 ? (
              <ul className="flex list-disc flex-col gap-1 pl-5 text-meta text-ink">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-meta text-ink-muted">Marque os pontos do exame para levar à confissão.</p>
            )}
          </div>

          <div className={CARD}>
            <h3 className="font-display text-title-sm text-ink">Os cinco passos</h3>
            <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-meta text-ink">
              {CINCO_PASSOS.map(({ nome, detalhe }) => (
                <li key={nome}>
                  <strong>{nome}</strong>
                  {detalhe}
                </li>
              ))}
            </ol>
          </div>

          <div className={CARD}>
            <h3 className="font-display text-title-sm text-ink">Na hora</h3>
            <p className={WHO}>Você</p>
            <p className="text-meta text-ink">
              Em nome do Pai, do Filho e do Espírito Santo. Padre, minha última confissão foi{" "}
              {days === null ? "há algum tempo" : formatTimeSince(days)}. Estes são os meus pecados…
            </p>
            <p className={WHO}>Ao terminar</p>
            <p className="text-meta text-ink">
              É só isso, padre. Peço perdão a Deus por estes e por todos os pecados de que não me lembro.
            </p>
            <p className={WHO}>Ato de contrição</p>
            <blockquote className="font-display text-lead italic text-ink">{ATO_DE_CONTRICAO}</blockquote>
            <p className="text-label text-ink-muted">
              Fonte:{" "}
              <a
                href={ATO_DE_CONTRICAO_FONTE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-accent"
              >
                {ATO_DE_CONTRICAO_FONTE.nome}
              </a>
            </p>
            <p className={WHO}>Depois da absolvição</p>
            <p className="text-meta text-ink">Graças a Deus. Amém.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
