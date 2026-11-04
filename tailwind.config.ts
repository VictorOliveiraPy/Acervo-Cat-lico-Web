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
        // Os valores usam variáveis CSS para suportar dark mode (var definido em globals.css).
        canvas: "var(--color-canvas, #F3F4F1)",
        gold: "#A8843A", // só filetes e ornamentos: 3,3:1 sobre o fundo não serve para texto
        surface: "var(--color-surface, #FBFCF9)",
        raised: "var(--color-raised, #FFFFFF)",

        // Linhas
        border: {
          DEFAULT: "var(--color-border, #D2D9D6)",
          strong: "var(--color-border-strong, #AEB9B6)",
        },

        // Texto
        ink: {
          DEFAULT: "var(--color-ink, #253039)",
          muted: "var(--color-ink-muted, #41505A)",
        },

        // Acento único: bordô
        accent: {
          DEFAULT: "var(--color-accent, #8C313E)",
          hover: "var(--color-accent-hover, #722632)",
          active: "var(--color-accent-hover, #722632)",
          soft: "var(--color-accent-soft, #F5E9EB)",
        },

        // Azul mineral institucional — não muda entre temas
        mineral: "#263E4D",

        // Cores semânticas de estado — não mudam entre temas
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
