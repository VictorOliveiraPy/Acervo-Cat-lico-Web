import localFont from "next/font/local";

/*
 * EB Garamond já pertence ao repositório e é carregada localmente: o build
 * não depende do Google Fonts e a identidade editorial não muda conforme a
 * rede. Corpo e controles usam a pilha sans-serif de sistema definida no
 * Tailwind, como prevê o guia aprovado.
 */
export const display = localFont({
  src: [
    { path: "../public/fonts/EBGaramond-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/EBGaramond-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/EBGaramond-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-display",
});
