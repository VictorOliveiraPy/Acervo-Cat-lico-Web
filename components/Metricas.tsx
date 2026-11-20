"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { enviarMetrica } from "@/lib/metricas";

/**
 * Conta as páginas vistas (a cada troca de endereço, inclusive na navegação sem
 * recarregar) e os cliques em links marcados com `data-evento`, que funcionam até em
 * componentes de servidor, sem `onClick`. O painel não conta a si mesmo.
 */
export function Metricas() {
  const pathname = usePathname();
  const primeira = useRef(true);

  useEffect(() => {
    if (pathname.startsWith("/painel")) return;
    // De onde a pessoa veio só faz sentido na primeira página da visita.
    const referencia = primeira.current ? document.referrer : undefined;
    primeira.current = false;
    enviarMetrica({ tipo: "pagina", caminho: pathname, ...(referencia ? { referencia } : {}) });
  }, [pathname]);

  useEffect(() => {
    function aoClicar(event: MouseEvent) {
      const alvo = (event.target as Element | null)?.closest<HTMLElement>("[data-evento]");
      const evento = alvo?.dataset.evento;
      if (evento) enviarMetrica({ tipo: "evento", caminho: window.location.pathname, evento });
    }
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  return null;
}
