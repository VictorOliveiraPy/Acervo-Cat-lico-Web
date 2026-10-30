"use client";

import { useEffect, useRef, useState } from "react";

import { setPatronAction } from "@/app/(pt)/perfil/actions";
import { ConfessionPanel } from "@/components/perfil/ConfessionPanel";
import { FavoritesPanel } from "@/components/perfil/FavoritesPanel";
import { NotesPanel } from "@/components/perfil/NotesPanel";
import { SaintStage } from "@/components/perfil/SaintStage";
import { PATRONS, patronById, type PatronId } from "@/lib/padroeiros";
import {
  PROFILE_TABS,
  levelFor,
  tabForKey,
  tabFromHash,
  type Favorite,
  type Note,
  type ProfileTabId,
} from "@/lib/perfil";

function Stat({ value, label, children }: { value: React.ReactNode; label: string; children?: React.ReactNode }) {
  return (
    <div className="bg-surface p-2.5 sm:px-3.5 sm:py-3">
      <p className="font-display text-[1.375rem] leading-tight text-ink [font-variant-numeric:tabular-nums] sm:text-[1.75rem]">
        {value}
      </p>
      <p className="text-label text-ink-muted [letter-spacing:0]">{label}</p>
      {children}
    </div>
  );
}

/**
 * Parte interativa do perfil. Os dados chegam prontos do servidor; daqui em diante
 * cada mudança atualiza o estado local e a contagem do cabeçalho, sem recarregar.
 */
export function PerfilView({
  nome,
  pontos,
  padroeiroId,
  licoesConcluidas,
  licoesTotal,
  favoritos,
  anotacoes,
  licoes,
}: {
  nome: string;
  pontos: number;
  padroeiroId: string;
  licoesConcluidas: number;
  licoesTotal: number;
  favoritos: readonly Favorite[];
  anotacoes: readonly Note[];
  licoes: ReadonlyArray<{ slug: string; title: string }>;
}) {
  const [patronId, setPatronId] = useState<string>(padroeiroId);
  const [patronError, setPatronError] = useState("");
  const [favorites, setFavorites] = useState<readonly Favorite[]>(favoritos);
  const [notes, setNotes] = useState<readonly Note[]>(anotacoes);
  const [tab, setTab] = useState<ProfileTabId>(PROFILE_TABS[0].id);
  const tabRefs = useRef(new Map<ProfileTabId, HTMLButtonElement>());

  const patron = patronById(patronId);
  const level = levelFor(pontos);
  const progress = licoesTotal > 0 ? Math.round((licoesConcluidas / licoesTotal) * 100) : 0;

  // O hash só existe no navegador: o servidor sempre desenha a primeira aba.
  useEffect(() => {
    const sync = () => setTab(tabFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function openTab(id: ProfileTabId, focus = false) {
    setTab(id);
    // `replaceState`, e não `location.hash`: troca a URL sem pular a página até a aba
    // e sem encher o botão Voltar com uma entrada por clique.
    window.history.replaceState(window.history.state, "", `#${id}`);
    if (focus) tabRefs.current.get(id)?.focus();
  }

  async function choosePatron(id: PatronId) {
    const previous = patronId;
    // Troca na hora e desfaz se falhar: esperar a rede faria o santo demorar a mudar.
    setPatronId(id);
    setPatronError("");
    const result = await setPatronAction(id);
    if (result.status !== "saved") {
      setPatronId(previous);
      setPatronError("Não foi possível salvar o padroeiro. Tente de novo em instantes.");
    }
  }

  const counts: Partial<Record<ProfileTabId, number>> = {
    favoritos: favorites.length,
    anotacoes: notes.length,
  };

  return (
    <div className="flex flex-col gap-7">
      <section
        aria-label="Identidade"
        className="grid items-center gap-5 min-[820px]:grid-cols-[minmax(260px,380px)_1fr] min-[820px]:gap-9"
      >
        <SaintStage saintId={patron.id} saintName={patron.nome} />

        <div className="flex min-w-0 flex-col gap-[18px]">
          <p className="eyebrow">Meu perfil</p>
          <h1 className="break-words font-display text-title-lg text-ink md:text-title-xl">{nome}</h1>
          <p className="font-display text-title-sm text-ink-muted">
            Sob a proteção de <em className="text-ink">{patron.nome}</em> · festa em {patron.festa}
          </p>
          <p className="w-fit rounded-full bg-accent-soft px-3 py-1 text-meta font-semibold text-accent">
            {level.nome}
            {level.proximo
              ? ` · próximo nível: ${level.proximo.nome} em ${level.proximo.faltam} pontos`
              : ""}
          </p>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-border bg-border">
            <Stat value={pontos} label="pontos" />
            <Stat
              value={
                <>
                  {licoesConcluidas}
                  <span className="text-meta text-ink-muted">/{licoesTotal}</span>
                </>
              }
              label="lições"
            >
              <div
                role="progressbar"
                aria-label="Lições concluídas"
                aria-valuemin={0}
                aria-valuemax={licoesTotal}
                aria-valuenow={licoesConcluidas}
                className="mt-2 h-1 overflow-hidden rounded bg-border"
              >
                <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
              </div>
            </Stat>
            <Stat value={favorites.length} label="textos guardados" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-meta text-ink-muted">Escolha seu padroeiro</p>
            <div className="flex flex-wrap gap-2">
              {PATRONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={option.id === patron.id}
                  onClick={() => void choosePatron(option.id)}
                  className={`flex min-h-[36px] items-center gap-2 rounded-full border bg-surface py-1 pl-1.5 pr-3 text-meta transition-colors ${
                    option.id === patron.id
                      ? "border-accent font-semibold text-accent"
                      : "border-border text-ink hover:border-accent"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 rounded-full border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${option.cores.tunica} 50%, ${option.cores.manto ?? option.cores.tunica} 50%)`,
                    }}
                  />
                  {option.nomeCurto}
                </button>
              ))}
            </div>
            <p role="status" aria-live="polite" className="text-meta text-danger">
              {patronError}
            </p>
          </div>
        </div>
      </section>

      <div>
        <div
          role="tablist"
          aria-label="Seções do perfil"
          className="flex gap-1 overflow-x-auto border-b border-border"
        >
          {PROFILE_TABS.map(({ id, label }) => (
            <button
              key={id}
              ref={(element) => {
                if (element) tabRefs.current.set(id, element);
                else tabRefs.current.delete(id);
              }}
              type="button"
              role="tab"
              id={`aba-${id}`}
              aria-controls={id}
              aria-selected={tab === id}
              // Só a aba ativa entra na ordem do Tab; as outras se alcançam pelas setas.
              tabIndex={tab === id ? 0 : -1}
              onClick={() => openTab(id)}
              onKeyDown={(event) => {
                const next = tabForKey(id, event.key);
                if (next) {
                  event.preventDefault();
                  openTab(next, true);
                }
              }}
              className={`min-h-[44px] shrink-0 whitespace-nowrap border-b-2 px-3.5 text-meta font-semibold transition-colors ${
                tab === id ? "border-accent text-ink" : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {label}
              {counts[id] !== undefined ? (
                <span className="ml-1 font-normal text-ink-muted [font-variant-numeric:tabular-nums]">
                  {counts[id]}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Os painéis ficam montados e só se escondem com `hidden`: desmontar a aba da
            confissão apagaria o exame ao olhar outra aba. */}
        <section
          role="tabpanel"
          id="favoritos"
          aria-labelledby="aba-favoritos"
          tabIndex={0}
          hidden={tab !== "favoritos"}
          className="scroll-mt-32 pt-5"
        >
          <FavoritesPanel favorites={favorites} onChange={setFavorites} />
        </section>
        <section
          role="tabpanel"
          id="anotacoes"
          aria-labelledby="aba-anotacoes"
          tabIndex={0}
          hidden={tab !== "anotacoes"}
          className="scroll-mt-32 pt-5"
        >
          <NotesPanel notes={notes} lessons={licoes} onChange={setNotes} />
        </section>
        <section
          role="tabpanel"
          id="confissao"
          aria-labelledby="aba-confissao"
          tabIndex={0}
          hidden={tab !== "confissao"}
          className="scroll-mt-32 pt-5"
        >
          <ConfessionPanel />
        </section>
      </div>
    </div>
  );
}
