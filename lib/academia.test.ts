import { describe, expect, it } from "vitest";

import {
  LESSONS,
  indexableLessons,
  isIndexable,
  lessonBySlug,
  lessonForEntry,
} from "@/lib/academia";
import { COMPENDIO_LESSONS } from "@/lib/academiaCompendio";
import {
  LAST_STEP,
  isCorrectAnswer,
  lessonStatus,
  parseProgress,
  withStep,
} from "@/lib/academiaProgress";
import { saintAssetFor } from "@/lib/saintAssets";

const trindade = lessonBySlug("santissima-trindade");

describe("lições da Academia", () => {
  it("deve encontrar a lição pelo slug e recusar uma inexistente", () => {
    expect(trindade?.title).toBe("Santíssima Trindade");
    expect(lessonBySlug("nao-existe")).toBeNull();
  });

  it("deve aceitar só a alternativa correta", () => {
    if (!trindade) throw new Error("lição ausente");
    expect(isCorrectAnswer(trindade, "b")).toBe(true);
    expect(isCorrectAnswer(trindade, "a")).toBe(false);
    expect(isCorrectAnswer(trindade, "c")).toBe(false);
  });

  it("deve ter a resposta certa entre as alternativas de toda lição", () => {
    for (const lesson of LESSONS) {
      const ids = lesson.quiz.options.map(({ id }) => id);
      expect(ids, lesson.slug).toContain(lesson.quiz.correctId);
      expect(new Set(ids).size, lesson.slug).toBe(ids.length);
    }
  });

  it("deve ligar o artigo à lição só nos verbetes relacionados", () => {
    expect(lessonForEntry("catecismo", "santissima-trindade")?.slug).toBe("santissima-trindade");
    expect(lessonForEntry("santos", "santissima-trindade")).toBeNull();
  });

  it("deve usar no contexto apenas santo com arte revisada", () => {
    for (const lesson of LESSONS) {
      if (!lesson.contextSaint) continue;
      const asset = saintAssetFor({ categoria: "santos", slug: lesson.contextSaint.slug });
      expect(asset, lesson.slug).not.toBeNull();
    }
  });

  it("deve expor aos buscadores só a lição revisada", () => {
    expect(trindade?.review).toBe("reviewed");
    expect(indexableLessons()).toContain(trindade);
    expect(indexableLessons().every((lesson) => lesson.review === "reviewed")).toBe(true);
  });
});

describe("lições do Compêndio", () => {
  it("deve ter as 50 lições, além da Trindade e da criação", () => {
    expect(COMPENDIO_LESSONS).toHaveLength(50);
    expect(LESSONS).toHaveLength(52);
  });

  it("deve manter slugs únicos, porque cada um vira uma URL", () => {
    const slugs = LESSONS.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("deve citar a fonte e ligar cada lição a um verbete do acervo", () => {
    for (const lesson of COMPENDIO_LESSONS) {
      expect(lesson.sources[0], lesson.slug).toMatch(/^Compêndio do Catecismo da Igreja Católica, n\. \d+$/);
      expect(lesson.relatedEntries.length, lesson.slug).toBeGreaterThan(0);
      expect(lesson.quiz.options, lesson.slug).toHaveLength(3);
    }
  });

  it("não deve deixar a alternativa certa sempre na mesma posição", () => {
    const positions = new Set(COMPENDIO_LESSONS.map(({ quiz }) => quiz.correctId));
    expect(positions).toEqual(new Set(["a", "b", "c"]));
  });

  it("deve deixar fora dos buscadores as lições curtas do Compêndio", () => {
    expect(COMPENDIO_LESSONS.some(isIndexable)).toBe(false);
    expect(indexableLessons().map(({ slug }) => slug)).toEqual(["santissima-trindade", "a-criacao"]);
  });

  it("deve publicar todas como revisadas e abrir a partir do artigo", () => {
    expect(LESSONS.every(({ review }) => review === "reviewed")).toBe(true);
    expect(lessonForEntry("catecismo", "a-criacao")?.slug).toBe("a-criacao");
    expect(lessonForEntry("novissimos", "purgatorio")?.slug).toBe("o-purgatorio");
  });
});

describe("progresso das lições", () => {
  it("deve valer como vazio quando o conteúdo salvo não é válido", () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress("não é json")).toEqual({});
    expect(parseProgress('{"licao":{"step":99,"completed":false}}')).toEqual({});
  });

  it("deve ler de volta o que foi salvo", () => {
    const saved = withStep({}, "licao", 1);
    expect(parseProgress(JSON.stringify(saved))).toEqual(saved);
  });

  it("deve distinguir não iniciada, em andamento e concluída", () => {
    expect(lessonStatus({}, "licao")).toBe("not_started");
    expect(lessonStatus(withStep({}, "licao", 0), "licao")).toBe("not_started");
    expect(lessonStatus(withStep({}, "licao", 1), "licao")).toBe("in_progress");
    expect(lessonStatus(withStep({}, "licao", LAST_STEP), "licao")).toBe("completed");
  });

  it("não deve apagar a conclusão ao refazer a lição", () => {
    const done = withStep({}, "licao", LAST_STEP);
    const redo = withStep(done, "licao", 0);
    expect(redo.licao).toEqual({ step: 0, completed: true });
    expect(lessonStatus(redo, "licao")).toBe("completed");
  });

  it("não deve guardar pontos nem qualquer pontuação", () => {
    expect(Object.keys(withStep({}, "licao", 1).licao ?? {}).sort()).toEqual(["completed", "step"]);
  });
});
