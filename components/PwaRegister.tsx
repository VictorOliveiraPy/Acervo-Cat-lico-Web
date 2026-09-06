"use client";

import { useEffect } from "react";

/**
 * Registra o service worker mínimo (`public/sw.js`). Sem isso, o
 * Chrome/Android não oferece "Instalar app" mesmo com `manifest.ts` certo —
 * um dos critérios de instalabilidade é ter um service worker registrado
 * com handler de fetch.
 *
 * Componente client separado (não dá pra chamar `navigator.serviceWorker`
 * num Server Component) que não renderiza nada — só dispara o registro.
 */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falhar em registrar não pode quebrar o site — só deixa de
        // oferecer instalação como app, o site normal continua igual.
      });
    }
  }, []);

  return null;
}
