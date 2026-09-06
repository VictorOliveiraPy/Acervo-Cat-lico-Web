import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

/**
 * Web App Manifest — é isto que faz o navegador oferecer "Adicionar à tela
 * inicial" no Android (e permite instalar como app de verdade no desktop) e
 * dá ao ícone/nome corretos quando alguém já instalou.
 *
 * Convenção de arquivo do Next: só de existir `app/manifest.ts`, o Next já
 * gera `/manifest.webmanifest` e injeta o `<link rel="manifest">` sozinho —
 * não precisa declarar isso em `layout.tsx`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Compêndio",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E6", // parchment — tela de splash ao abrir
    theme_color: "#6B1F2A", // bordeaux — barra de status/cor do app
    lang: "pt-BR",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
