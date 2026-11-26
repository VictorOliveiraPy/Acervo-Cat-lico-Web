"use client";

import { signIn } from "next-auth/react";

/** Abre o login do Google; conta nova cai no perfil, onde escolhe o padroeiro. */
export function CriarConta({ children = "Criar minha conta grátis", className = "btn btn-primary" }: { children?: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={() => void signIn("google", { callbackUrl: "/perfil" })} className={className}>
      {children}
    </button>
  );
}
