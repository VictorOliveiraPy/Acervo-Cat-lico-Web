"use client";

import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { importLocalProgressAction } from "@/app/(pt)/perfil/actions";
import { readProgress } from "@/lib/academiaProgress";
import { LOGIN_ENABLED } from "@/lib/auth-public";

const IMPORTED_KEY = "compendio:academia:imported";

/** Leva uma vez para a conta o que foi concluído neste navegador antes do login. */
async function importLocalProgress() {
  try {
    if (localStorage.getItem(IMPORTED_KEY)) return;
    const done = Object.entries(readProgress())
      .filter(([, progress]) => progress.completed)
      .map(([slug]) => slug);
    await importLocalProgressAction(done);
    localStorage.setItem(IMPORTED_KEY, "1");
  } catch {
    // Sem armazenamento ou sem API: tenta de novo no próximo carregamento.
  }
}

/** O menu de quem já entrou: perfil, ranking e sair. Fecha no clique fora e no Esc. */
function MenuDaConta() {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (evento: MouseEvent) => {
      if (!caixa.current?.contains(evento.target as Node)) setAberto(false);
    };
    const esc = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  const item = "block w-full px-4 py-2.5 text-left text-meta text-ink hover:bg-accent-soft hover:text-accent";
  return (
    <div ref={caixa} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={aberto}
        aria-haspopup="true"
        onClick={() => setAberto((valor) => !valor)}
        className="flex items-center gap-1.5 text-meta font-semibold text-ink-muted hover:text-accent"
      >
        <span aria-hidden="true" className="text-gold">✦</span>
        <span className="hidden sm:inline">Minha jornada</span>
        <span className="sm:hidden">Conta</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={aberto ? "rotate-180" : ""}>
          <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {aberto ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-panel border border-border bg-surface py-1 shadow-lg">
          {/* `<a>`, e não `Link`: o perfil tem conteúdo privado e abre do zero, sem herdar
              scripts de terceiros já carregados em outras páginas. */}
          <a href="/perfil" className={item}>
            Meu perfil
          </a>
          <a href="/ranking" className={item}>
            Ranking
          </a>
          <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className={`${item} border-t border-border`}>
            Sair
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Convite à jornada ou o menu da conta. A sessão é lida no navegador de propósito: ler o
 * cookie no servidor, dentro do layout, tiraria todas as páginas do cache.
 */
export function AccountMenu() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!LOGIN_ENABLED) return;
    void getSession().then((session) => {
      if (!session) return;
      setLoggedIn(true);
      void importLocalProgress();
    });
  }, []);

  if (!LOGIN_ENABLED) return null;
  if (loggedIn) return <MenuDaConta />;

  // "Entrar" não dizia o que a conta dá: o convite leva à página que mostra a jornada.
  return (
    <Link
      href="/jornada"
      aria-label="Comece sua jornada"
      className="convite-jornada inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-meta font-semibold text-white hover:bg-accent-hover"
    >
      <span aria-hidden="true">✦</span>
      <span className="hidden sm:inline">Comece sua jornada</span>
      <span className="sm:hidden">Jornada</span>
    </Link>
  );
}
