"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

/**
 * Entrar ou ir ao perfil. A sessão é lida no navegador de propósito: ler o cookie
 * no servidor, dentro do layout, tiraria todas as páginas do cache.
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

  if (loggedIn) {
    return (
      <Link href="/perfil" className="shrink-0 text-meta font-semibold text-ink-muted hover:text-accent">
        Perfil
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => void signIn("google")}
      className="shrink-0 text-meta font-semibold text-ink-muted hover:text-accent"
    >
      Entrar
    </button>
  );
}
