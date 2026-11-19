"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { homeProgressAction, type HomeProgressResult } from "@/app/(pt)/perfil/actions";
import { LOGIN_ENABLED } from "@/lib/auth-public";

const FAIXA = "flex flex-wrap items-center justify-between gap-3 rounded-panel border border-border bg-surface px-5 py-4";

/**
 * Faixa logo abaixo do topo da home. Quem está logado vê a própria sequência de dias e
 * a próxima conquista; quem não está vê o convite para começar a sua. Vem do navegador,
 * depois da página: a home continua igual para todos e cacheada.
 */
export function HomeProgress() {
  const [progresso, setProgresso] = useState<HomeProgressResult | null>(null);

  useEffect(() => {
    if (!LOGIN_ENABLED) return;
    let vivo = true;
    homeProgressAction()
      .then((resultado) => vivo && setProgresso(resultado))
      .catch(() => vivo && setProgresso({ status: "error" }));
    return () => {
      vivo = false;
    };
  }, []);

  if (!progresso || progresso.status === "error") return null;

  if (progresso.status === "anonymous") {
    return (
      <aside aria-label="Sua caminhada" className={FAIXA}>
        <div>
          <p className="font-semibold text-ink">Reze e estude todo dia, e acompanhe sua caminhada.</p>
          <p className="text-meta text-ink-muted">
            Com uma conta, você ganha uma sequência de dias, conquistas e um santo guardião.
          </p>
        </div>
        <Link href="/api/auth/signin?callbackUrl=/perfil" className="btn btn-secondary">
          Começar minha sequência
        </Link>
      </aside>
    );
  }

  if (progresso.status === "sem-padroeiro") {
    return (
      <aside aria-label="Sua caminhada" className={FAIXA}>
        <p className="font-semibold text-ink">Falta escolher seu santo guardião.</p>
        <Link href="/perfil" className="btn btn-secondary">
          Escolher agora
        </Link>
      </aside>
    );
  }

  return (
    <aside aria-label="Sua caminhada" className={FAIXA}>
      <div>
        <p className="font-semibold text-ink">
          <span aria-hidden="true">🔥 </span>
          {progresso.titulo}
        </p>
        <p className="text-meta text-ink-muted">{progresso.detalhe}</p>
      </div>
      <Link href="/perfil" className="btn btn-secondary">
        Práticas de hoje
      </Link>
    </aside>
  );
}
