import { describe, expect, it } from "vitest";

import tailwindConfig from "@/tailwind.config";
import {
  COLORS,
  CONTRAST_PAIRS,
  PHOTO_OVERLAY,
  compositeOver,
  contrastRatio,
  parseRgba,
  relativeLuminance,
} from "@/lib/designTokens";

/**
 * Trava a paleta em WCAG AA.
 *
 * O acervo é uma ferramenta de leitura de texto longo: contraste aqui não é
 * detalhe de polimento, é a condição de uso. Por isso a paleta é testada, não
 * auditada depois — trocar um hex que derrube um par usado pela interface
 * falha `npm test` no mesmo commit, com o nome do par e a razão na mensagem.
 */
describe("matemática de contraste", () => {
  it("deve dar 21:1 para preto sobre branco e 1:1 para cores idênticas", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#7A2E3A", "#7A2E3A")).toBeCloseTo(1, 5);
  });

  it("deve ser simétrico na ordem dos argumentos", () => {
    expect(contrastRatio("#1A1D21", "#FFFFFF")).toBeCloseTo(
      contrastRatio("#FFFFFF", "#1A1D21"),
      10,
    );
  });

  it("deve calcular a luminância dos canais puros", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBe(0);
  });

  it("deve recusar cor que não seja #rrggbb em vez de inventar um valor", () => {
    expect(() => relativeLuminance("white")).toThrow("Cor não é #rrggbb");
  });
});

describe("composição de cor translúcida sobre fundo opaco", () => {
  it("deve devolver o próprio fundo quando o primeiro plano é transparente", () => {
    // Given / When
    const composto = compositeOver("#FFFFFF", "#4A141D", 0);
    // Then
    expect(composto).toBe("#4A141D");
  });

  it("deve devolver a própria cor quando o primeiro plano é opaco", () => {
    expect(compositeOver("#FFFFFF", "#4A141D", 1)).toBe("#FFFFFF");
  });

  it("deve ler um rgba() completo, com o alpha junto", () => {
    // Given / When
    const veu = parseRgba("rgba(74, 20, 29, 0.62)");
    // Then
    expect(veu).toEqual({ hex: "#4A141D", alpha: 0.62 });
  });

  it("deve recusar rgba() malformado em vez de assumir um alpha", () => {
    expect(() => parseRgba("#4A141D")).toThrow("Não é rgba");
  });

  it("deve recusar alpha fora de 0–1 em vez de arredondar", () => {
    expect(() => compositeOver("#FFFFFF", "#000000", 1.4)).toThrow("Alpha fora de 0–1");
  });
});

describe("tokens de cor da interface", () => {
  it("deve manter todos os valores em #rrggbb válido", () => {
    for (const [token, value] of Object.entries(COLORS)) {
      expect(value, `${token} não é #rrggbb`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("deve manter o acento da marca no bordô decidido pelo time", () => {
    // O tom cheio é o do plano de design; não é para ninguém "clareá-lo" sem
    // perceber ao mexer no arquivo.
    expect(COLORS.accent.toUpperCase()).toBe("#8C313E");
  });

  it("deve manter o fundo editorial neutro, sem viés quente de pergaminho", () => {
    // O canvas aprovado é levemente mineral. Um creme amarelado continua
    // sendo uma regressão e este teste o detecta.
    const [r, g, b] = [1, 3, 5].map((offset) =>
      parseInt(COLORS.canvas.slice(offset, offset + 2), 16),
    ) as [number, number, number];
    expect(b).toBeGreaterThanOrEqual(r - 4);
    expect(g).toBeGreaterThanOrEqual(b);
  });
});

describe("concordância entre os tokens e o Tailwind", () => {
  it("deve manter as cores semânticas iguais nos dois lugares", () => {
    // Os pares de contraste só provam algo se medirem a cor que a tela pinta.
    const colors = tailwindConfig.theme?.extend?.colors as Record<
      string,
      string | Record<string, string>
    >;
    const tone = (name: string, key: string) => (colors[name] as Record<string, string>)[key];

    expect(tone("success", "DEFAULT")).toBe(COLORS.success);
    expect(tone("success", "soft")).toBe(COLORS.successSoft);
    expect(tone("warning", "DEFAULT")).toBe(COLORS.warning);
    expect(tone("warning", "soft")).toBe(COLORS.warningSoft);
    expect(tone("danger", "DEFAULT")).toBe(COLORS.danger);
    expect(tone("danger", "soft")).toBe(COLORS.dangerSoft);
    expect(tone("accent", "DEFAULT")).toBe(COLORS.accent);
    expect(tone("accent", "soft")).toBe(COLORS.accentSoft);
    expect(colors.mineral).toBe(COLORS.mineral);
  });
});

describe.each(CONTRAST_PAIRS)(
  "par de contraste %s sobre %s",
  (foreground, background, minimum, reason) => {
    it(`deve alcançar ${minimum}:1 ou mais (${reason})`, () => {
      // Given
      const fg = COLORS[foreground];
      const bg = COLORS[background];
      const ratio = contrastRatio(fg, bg);

      // Then
      expect(
        ratio,
        `${foreground} (${fg}) sobre ${background} (${bg}) = ${ratio.toFixed(2)}:1 — abaixo de ${minimum}:1 (${reason})`,
      ).toBeGreaterThanOrEqual(minimum);
    });
  },
);

describe("contraste do véu bordô sobre as fotos dos banners", () => {
  // O véu é rgba, então a cor que o olho vê depende da foto atrás. O pior caso
  // é o véu sobre a foto mais clara possível (branco): se o texto branco do
  // banner passa em AA aí, passa sobre qualquer foto do acervo.
  const { hex, alpha } = parseRgba(PHOTO_OVERLAY.veil);
  const veilOverWhite = compositeOver(hex, "#FFFFFF", alpha);
  const veilOverDark = compositeOver(hex, "#000000", alpha);

  it("deve passar AA para o título do banner mesmo sobre a foto mais clara", () => {
    expect(
      contrastRatio(PHOTO_OVERLAY.onVeil, veilOverWhite),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("deve passar AA para o texto do banner a 85% de opacidade", () => {
    // Given
    const softened = compositeOver(PHOTO_OVERLAY.onVeil, veilOverWhite, 0.85);
    // Then
    expect(contrastRatio(softened, veilOverWhite)).toBeGreaterThanOrEqual(4.5);
  });

  it("deve manter o texto legível também sobre a foto mais escura", () => {
    expect(
      contrastRatio(PHOTO_OVERLAY.onVeil, veilOverDark),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
