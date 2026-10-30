import type { Config } from "tailwindcss";

/**
 * Tokens de design do acervo — fonte única de cor, tipografia e espaçamento.
 *
 * Paleta aprovada no Design System 1.0 do Compêndio. Cores são nomeadas por
 * PAPEL (`canvas`, `surface`, `accent`), nunca por valor: os componentes
 * continuam desacoplados dos hexadecimais do compêndio de implementação.
 *
 * Os neutros foram escolhidos com viés frio (canal azul no topo) de propósito:
 * sobre vidro, um cinza quente lê como papel amarelado por acidente. O único
 * matiz da interface é o bordô, reservado a ação primária, link e foco.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Superfícies, do mais claro ao mais recuado.
        canvas: "#F3F4F1", // fundo editorial aprovado
        surface: "#FBFCF9", // cards, campos, painéis
        raised: "#FFFFFF", // faixas elevadas e campos

        // Linhas: `border` é o filete visível de 1px que substitui a sombra.
        border: {
          DEFAULT: "#D2D9D6",
          strong: "#AEB9B6", // divisória mais marcada, sem virar preto
        },

        // Texto.
        ink: {
          DEFAULT: "#253039", // corpo e títulos
          muted: "#41505A", // texto secundário (resumos, legendas)
        },

        // Acento único: bordô.
        accent: {
          DEFAULT: "#8C313E",
          hover: "#722632",
          active: "#722632",
          soft: "#F5E9EB", // preenchimento lavado (seleção, realce de busca)
        },

        // Azul mineral institucional para superfícies de contraste, não para
        // competir com o bordô nas ações.
        mineral: "#263E4D",

        // Cor semântica, separada do acento de marca: estado não se confunde
        // com identidade.
        success: {
          DEFAULT: "#326D51",
          soft: "#E7F2EB",
        },
        warning: {
          DEFAULT: "#7A5210",
          soft: "#F6EEDD",
        },
        danger: {
          DEFAULT: "#973027",
          soft: "#F6E3E1",
        },
      },
      fontFamily: {
        // Fonte de destaque (títulos) e de corpo, via variáveis do next/font.
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        // Escala tipográfica única (rótulo → título de página).
        label: ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.09em" }],
        meta: ["0.8125rem", { lineHeight: "1.35rem" }],
        body: ["1.0625rem", { lineHeight: "1.75rem" }],
        lead: ["1.1875rem", { lineHeight: "1.9rem" }],
        "title-sm": ["1.375rem", { lineHeight: "1.85rem" }],
        "title-md": ["1.75rem", { lineHeight: "2.15rem" }],
        "title-lg": ["2.25rem", { lineHeight: "2.6rem" }],
        "title-xl": ["3rem", { lineHeight: "3.2rem" }],
      },
      spacing: {
        band: "1.125rem", // altura de respiro das faixas do cabeçalho
        section: "4.5rem", // distância entre seções de uma página
      },
      maxWidth: {
        measure: "68ch", // largura de leitura confortável (coluna única)
        shell: "76rem", // largura máxima do cabeçalho/rodapé/grades
      },
      borderRadius: {
        none: "0",
        edge: "5px",
        panel: "9px",
        feature: "16px",
      },
      boxShadow: {
        none: "none",
        // Única sombra aprovada, reservada a overlays flutuantes.
        soft: "0 12px 40px rgba(28, 48, 53, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
