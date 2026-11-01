import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { INSTAGRAM_VIDEOS, instagramEmbedHeight } from "@/lib/instagramVideos";
import { firstParagraph, shortcodeFromUrl } from "@/scripts/add-instagram-video";

describe("vídeos do Instagram", () => {
  it("deve ter a capa de cada vídeo em public/videos", () => {
    for (const { id } of INSTAGRAM_VIDEOS) {
      expect(existsSync(`public/videos/${id}.jpg`), id).toBe(true);
    }
  });

  it("não deve repetir vídeo", () => {
    const ids = INSTAGRAM_VIDEOS.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("altura do player do Instagram", () => {
  it("deve aceitar a mensagem MEASURE, em texto ou objeto", () => {
    expect(instagramEmbedHeight('{"details":{"height":796},"type":"MEASURE"}')).toBe(796);
    expect(instagramEmbedHeight({ type: "MEASURE", details: { height: 678 } })).toBe(678);
  });

  it("deve ignorar qualquer outra mensagem", () => {
    for (const data of ["texto", "null", null, 5, { type: "MOUNTED" }, { type: "MEASURE", details: { height: "9" } }]) {
      expect(instagramEmbedHeight(data)).toBeNull();
    }
    expect(instagramEmbedHeight({ type: "MEASURE", details: { height: 0 } })).toBeNull();
  });
});

describe("script de adicionar vídeo", () => {
  it("deve extrair o código de post e de reel", () => {
    expect(shortcodeFromUrl("https://www.instagram.com/p/DfMnx9DB7r-/")).toBe("DfMnx9DB7r-");
    expect(shortcodeFromUrl("https://www.instagram.com/reel/DfMw1btB8hj/?igsh=abc")).toBe("DfMw1btB8hj");
    expect(shortcodeFromUrl("https://www.instagram.com/compendiocatolico/reel/DfKJupsBD7t/")).toBe("DfKJupsBD7t");
  });

  it("deve recusar o que não é post do Instagram", () => {
    expect(shortcodeFromUrl("https://www.instagram.com/compendiocatolico/")).toBeNull();
    expect(shortcodeFromUrl("https://example.com/p/DfMnx9DB7r-/")).toBeNull();
  });

  it("deve usar só o primeiro parágrafo da legenda", () => {
    expect(firstParagraph("Gancho do vídeo?\n\nResto da legenda.\n\n#tag")).toBe("Gancho do vídeo?");
    expect(firstParagraph("  Só uma linha  ")).toBe("Só uma linha");
  });
});
