import type { Config } from "tailwindcss";

/**
 * Tokens de design do acervo — fonte única de cor, tipografia e espaçamento.
 *
 * A paleta decidida pelo time é fechada (pergaminho, bordô, púrpura, dourado).
 * Os neutros derivados (`parchment.deep`, `rule.faint`) foram escolhidos com
 * viés quente do próprio pergaminho, não cinza puro: um filete cinza-neutro
 * sobre fundo creme lê como acidente, não como decisão editorial.
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
        parchment: {
          DEFAULT: "#F5F0E6", // superfície principal
          raised: "#FBF8F1", // folha sobre a mesa (cards, painéis)
          deep: "#ECE4D3", // faixa recuada (segunda banda do cabeçalho)
        },
        bordeaux: {
          DEFAULT: "#6B1F2A",
          soft: "#8A3441", // hover/estado ativo, mesma família
        },
        purple: {
          DEFAULT: "#4A2545",
        },
        gold: {
          DEFAULT: "#B8912F", // reservado a filetes e detalhes
          wash: "#E8DCBA", // dourado rebaixado, para preenchimento sutil
        },
        ink: {
          DEFAULT: "#241B22",
          muted: "#6E6058",
        },
        rule: {
          faint: "#DCD2BE", // filete de separação discreto
        },
        // Cor semântica é separada do bordô da marca de propósito:
        // estado (ok/aviso/erro) não pode se confundir com identidade.
        state: {
          notice: "#7A5B12",
          error: "#8C2F1F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        body: ["var(--font-body)", "system-ui", "Segoe UI", "sans-serif"],
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
        // Cantos praticamente retos: o projeto é impresso, não app de celular.
        none: "0",
        edge: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
