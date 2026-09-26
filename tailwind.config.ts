import type { Config } from "tailwindcss";

/**
 * Tokens de design do acervo — fonte única de cor, tipografia e espaçamento.
 *
 * A paleta é neutra fria (branco + três degraus de cinza) com um único acento
 * cromático, o bordô. Cores são nomeadas por PAPEL (`canvas`, `surface`,
 * `accent`), nunca por valor: um componente pede "a superfície do cartão", não
 * "o cinza #EEF1F4" — assim trocar o tom não obriga a varrer o código.
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
        canvas: "#FFFFFF", // fundo da página
        surface: "#F7F8FA", // cards, campos, painéis
        raised: "#EEF1F4", // faixas recuadas, chips, skeleton

        // Linhas: `border` é o filete visível de 1px que substitui a sombra.
        border: {
          DEFAULT: "#DDE1E7",
          strong: "#C4CAD3", // divisória mais marcada, sem virar preto
        },

        // Texto.
        ink: {
          DEFAULT: "#1A1D21", // corpo e títulos
          muted: "#5A6069", // texto secundário (resumos, legendas)
        },

        // Acento único: bordô.
        accent: {
          DEFAULT: "#7A2E3A",
          hover: "#5E222C",
          active: "#4A1A22",
          soft: "#F3E4E7", // preenchimento lavado (seleção, realce de busca)
        },

        // Cor semântica, separada do acento de marca: estado não se confunde
        // com identidade.
        success: {
          DEFAULT: "#1D6B3C",
          soft: "#E3F0E7",
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
        sans: ["var(--font-body)", "system-ui", "Segoe UI", "sans-serif"],
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
        // Cantos praticamente retos: o acervo é impresso, não app de celular.
        none: "0",
        edge: "2px",
      },
      boxShadow: {
        // Sem sombras no cromo: profundidade vem de espaço e do filete de 1px.
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
