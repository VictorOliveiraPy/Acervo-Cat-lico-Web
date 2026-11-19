import { describe, expect, it } from "vitest";

import { shareImageUrl } from "@/lib/wikimedia";

const SITE = "https://compendio-catolico.com";

describe("imagem de compartilhamento", () => {
  it("troca o original da Wikimedia pela miniatura de 500px", () => {
    expect(
      shareImageUrl("https://upload.wikimedia.org/wikipedia/commons/1/16/San_Francesco.jpg", SITE),
    ).toBe("https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/San_Francesco.jpg/500px-San_Francesco.jpg");
  });

  it("SVG vira PNG, como a Wikimedia gera", () => {
    expect(shareImageUrl("https://upload.wikimedia.org/wikipedia/commons/a/ab/Brasao.svg", SITE)).toBe(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Brasao.svg/500px-Brasao.svg.png",
    );
  });

  it("mantém o que já é miniatura ou não tem miniatura conhecida", () => {
    const thumb = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/X.jpg/330px-X.jpg";
    expect(shareImageUrl(thumb, SITE)).toBe(thumb);
    const tif = "https://upload.wikimedia.org/wikipedia/commons/1/16/Mapa.tif";
    expect(shareImageUrl(tif, SITE)).toBe(tif);
  });

  it("só reescreve quando o arquivo termina no formato", () => {
    const tif = "https://upload.wikimedia.org/wikipedia/commons/1/16/Mapa.jpg.tif";
    expect(shareImageUrl(tif, SITE)).toBe(tif);
    expect(shareImageUrl("https://upload.wikimedia.org/wikipedia/commons/1/16/Planta.svg.jpg", SITE)).toBe(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Planta.svg.jpg/500px-Planta.svg.jpg",
    );
  });

  it("não reescreve URL que só contém a da Wikimedia no meio", () => {
    const outra = "https://example.org/?u=https://upload.wikimedia.org/wikipedia/commons/1/16/X.jpg";
    expect(shareImageUrl(outra, SITE)).toBe(outra);
  });

  it("imagem do próprio site vira endereço absoluto", () => {
    expect(shareImageUrl("/img-acervo/vela.jpg", SITE)).toBe(`${SITE}/img-acervo/vela.jpg`);
  });

  it("outros sites ficam como estão", () => {
    expect(shareImageUrl("https://example.org/a.jpg", SITE)).toBe("https://example.org/a.jpg");
  });
});
