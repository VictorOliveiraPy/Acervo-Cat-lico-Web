import { describe, expect, it } from "vitest";

import { CATEGORY_SLUGS } from "@/lib/schemas";
import {
  SANTOS_CAMINHANTES,
  SANTOS_SIMULTANEOS,
  SEGUNDOS_POR_TRAVESSIA,
  atrasoEmSegundos,
  cicloEmSegundos,
} from "@/lib/santosCaminhantes";

describe("santos caminhantes", () => {
  it("deve apontar cada placa para uma categoria que existe", () => {
    for (const santo of SANTOS_CAMINHANTES) {
      expect(CATEGORY_SLUGS).toContain(santo.categoria);
    }
  });

  it("deve ter uma figura e uma categoria diferentes por santo", () => {
    const figuras = new Set(SANTOS_CAMINHANTES.map((s) => s.figura));
    const categorias = new Set(SANTOS_CAMINHANTES.map((s) => s.categoria));

    expect(figuras.size).toBe(SANTOS_CAMINHANTES.length);
    expect(categorias.size).toBe(SANTOS_CAMINHANTES.length);
  });

  it("deve escalonar os atrasos em fatias iguais de travessia", () => {
    expect(cicloEmSegundos()).toBe(
      SEGUNDOS_POR_TRAVESSIA * (SANTOS_CAMINHANTES.length / SANTOS_SIMULTANEOS),
    );
    expect(atrasoEmSegundos(1)).toBe(-SEGUNDOS_POR_TRAVESSIA / SANTOS_SIMULTANEOS);
  });

  it("deve deixar exatamente os simultâneos dentro da travessia no instante zero", () => {
    const emCena = SANTOS_CAMINHANTES.filter(
      (_, indice) => -atrasoEmSegundos(indice) < SEGUNDOS_POR_TRAVESSIA,
    );

    expect(emCena).toHaveLength(SANTOS_SIMULTANEOS);
  });
});
