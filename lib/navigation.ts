/**
 * Navegação global do cabeçalho.
 *
 * Fica fora do componente porque decidir qual item está ativo é regra, e regra
 * aqui é testada em módulo puro (ver `vitest.config.ts`).
 */

export const MAIN_NAV = [
  { id: "explorar", label: "Explorar", href: "/" },
  { id: "liturgia", label: "Liturgia de hoje", href: "/liturgia-diaria" },
  { id: "academia", label: "Academia da Fé", href: "/academia" },
  { id: "santos", label: "Santos", href: "/santos" },
  { id: "velas", label: "Velas", href: "/velas" },
] as const;

export type MainNavId = (typeof MAIN_NAV)[number]["id"];

/** Tudo o que não é seção própria faz parte de explorar o acervo. */
export function activeNavItem(pathname: string): MainNavId {
  const section = MAIN_NAV.find(
    ({ href }) => href !== "/" && (pathname === href || pathname.startsWith(`${href}/`)),
  );
  return section?.id ?? "explorar";
}
