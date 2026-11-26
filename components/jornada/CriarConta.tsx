"use client";

import { signIn } from "next-auth/react";

/** Abre o login do Google; conta nova cai no perfil, onde escolhe o padroeiro. */
export function CriarConta({
  children = "Criar minha conta grátis",
  className = "btn btn-primary",
  destino = "/perfil",
}: {
  children?: React.ReactNode;
  className?: string;
  /** Para onde ir depois do login (sem padroeiro, o perfil pede a escolha antes). */
  destino?: string;
}) {
  return (
    <button type="button" onClick={() => void signIn("google", { callbackUrl: destino })} className={className}>
      {children}
    </button>
  );
}
