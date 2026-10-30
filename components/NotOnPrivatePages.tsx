"use client";

import { usePathname } from "next/navigation";

/** Scripts de terceiros não entram em `/perfil`, onde há anotações e o exame de consciência. */
export function NotOnPrivatePages({ children }: { children: React.ReactNode }) {
  return usePathname() === "/perfil" ? null : <>{children}</>;
}
